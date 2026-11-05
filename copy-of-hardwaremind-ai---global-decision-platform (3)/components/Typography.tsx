import React from 'react';
import { typographyScale, gradientText, glowText, animatedUnderline } from '../utils/typography';

type TypographyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'code';
type GradientVariant = keyof typeof gradientText | 'none';
type GlowVariant = keyof typeof glowText | 'none';
type UnderlineVariant = keyof typeof animatedUnderline | 'none';

interface TypographyProps {
  variant?: TypographyVariant;
  gradient?: GradientVariant;
  glow?: GlowVariant;
  underline?: UnderlineVariant;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

/**
 * Typography component with advanced text effects
 * 
 * @example
 * <Typography variant="h1" gradient="rainbow">
 *   Welcome to AIVA
 * </Typography>
 * 
 * <Typography variant="body" glow="cyan">
 *   Futuristic AI Platform
 * </Typography>
 */
export function Typography({
  variant = 'body',
  gradient = 'none',
  glow = 'none',
  underline = 'none',
  as,
  className = '',
  children,
}: TypographyProps) {
  // Determine the HTML element to render
  const Component = as || getDefaultElement(variant);

  // Build className
  const classes = [
    typographyScale[variant],
    gradient !== 'none' ? gradientText[gradient] : '',
    glow !== 'none' ? glowText[glow] : '',
    underline !== 'none' ? animatedUnderline[underline] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{children}</Component>;
}

function getDefaultElement(variant: TypographyVariant): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'display':
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'caption':
      return 'span';
    case 'code':
      return 'code';
    default:
      return 'p';
  }
}

/**
 * Animated number display component
 */
interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  tabular?: boolean;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1000,
  tabular = true,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // If duration is very short or 0, just set the value immediately
    if (duration <= 0) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    const startValue = displayValue;
    const range = value - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + range * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Safety check for NaN values
  const safeDisplayValue = isNaN(displayValue) ? value : displayValue;
  const formattedValue = `${prefix}${safeDisplayValue.toFixed(decimals)}${suffix}`;
  const tabularClass = tabular ? 'tabular-nums' : '';

  return (
    <span className={`${tabularClass} ${className}`}>
      {formattedValue}
    </span>
  );
}

/**
 * Gradient text component
 */
interface GradientTextProps {
  variant?: GradientVariant;
  className?: string;
  children: React.ReactNode;
}

export function GradientText({ variant = 'cyan', className = '', children }: GradientTextProps) {
  return (
    <span className={`${gradientText[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Glowing text component
 */
interface GlowTextProps {
  variant?: GlowVariant;
  className?: string;
  children: React.ReactNode;
}

export function GlowText({ variant = 'cyan', className = '', children }: GlowTextProps) {
  return (
    <span className={`${glowText[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Code block component with syntax highlighting support
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', className = '', showLineNumbers = false }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <pre className={`relative overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-4 ${className}`}>
      <code className={`language-${language} text-sm font-mono`}>
        {showLineNumbers ? (
          <div className="flex">
            <div className="select-none pr-4 text-white/30 text-right">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="flex-1">{code}</div>
          </div>
        ) : (
          code
        )}
      </code>
    </pre>
  );
}
