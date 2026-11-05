/**
 * Smart Error Retry Mechanism
 * Implements exponential backoff and intelligent retry strategies
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    retryableErrors = ['NetworkError', 'TimeoutError', 'Failed to fetch'],
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if error is retryable
      const isRetryable = retryableErrors.some(
        retryableError => lastError.message.includes(retryableError)
      );

      if (attempt === maxRetries || !isRetryable) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      // Call retry callback
      onRetry?.(attempt + 1, lastError);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Retry with jitter (randomized delay to prevent thundering herd)
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );
      const jitter = Math.random() * baseDelay * 0.3; // 30% jitter
      const delay = baseDelay + jitter;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  reset() {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

// Global circuit breaker instances
const circuitBreakers = new Map<string, CircuitBreaker>();

/**
 * Get or create a circuit breaker for a specific operation
 */
export function getCircuitBreaker(key: string): CircuitBreaker {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(key, new CircuitBreaker());
  }
  return circuitBreakers.get(key)!;
}

/**
 * Execute with circuit breaker and retry
 */
export async function executeWithCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  retryOptions?: RetryOptions
): Promise<T> {
  const breaker = getCircuitBreaker(key);
  
  return breaker.execute(() => 
    retryWithBackoff(fn, retryOptions)
  );
}

