/**
 * Typography Utilities
 * 
 * Provides utility functions for advanced typography effects including
 * gradient text, glowing text, animated underlines, and dynamic counting.
 */

/**
 * Generate gradient text CSS classes
 */
export const gradientText = {
  cyan: 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent',
  magenta: 'bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent',
  purple: 'bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent',
  rainbow: 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent',
  gold: 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent',
};

/**
 * Generate glow text CSS classes
 */
export const glowText = {
  cyan: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]',
  magenta: 'text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]',
  purple: 'text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]',
  blue: 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]',
  white: 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]',
};

/**
 * Animated underline variants
 */
export const animatedUnderline = {
  gradient: 'relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-cyan-400 after:to-purple-500 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300',
  glow: 'relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cyan-400 after:shadow-[0_0_8px_rgba(34,211,238,0.8)] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300',
  expand: 'relative after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:-translate-x-1/2 hover:after:w-full after:transition-all after:duration-300',
};

/**
 * Typography scale with letter spacing and optimized readability
 * Ensures proper line height (1.5-1.8 for body text) and contrast
 */
export const typographyScale = {
  display: 'text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none',
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-snug',
  h4: 'text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-snug',
  h5: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-normal leading-snug',
  h6: 'text-base md:text-lg lg:text-xl font-semibold tracking-normal leading-snug',
  body: 'text-base leading-relaxed tracking-normal', // line-height: 1.75
  bodyLarge: 'text-lg leading-relaxed tracking-normal',
  bodySmall: 'text-sm leading-relaxed tracking-normal',
  caption: 'text-xs leading-normal tracking-wide uppercase',
  code: 'font-mono text-sm font-medium',
};

/**
 * Animate number counting from start to end
 */
export function animateNumber(
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1000,
  options?: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    easing?: (t: number) => number;
  }
): void {
  const { decimals = 0, prefix = '', suffix = '', easing = (t) => t } = options || {};
  
  const startTime = performance.now();
  const range = end - start;

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const current = start + range * easedProgress;
    
    element.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Easing functions for number animations
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  elastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    const s = p / 4;
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  },
};

/**
 * Format number with tabular figures (for consistent width)
 */
export function formatTabularNumber(value: number, decimals: number = 0): string {
  return value.toFixed(decimals).replace(/\d/g, (d) => String.fromCharCode(0x2080 + parseInt(d)));
}

/**
 * Create a gradient text element
 */
export function createGradientText(
  text: string,
  gradient: keyof typeof gradientText
): string {
  return `<span class="${gradientText[gradient]}">${text}</span>`;
}

/**
 * Create a glowing text element
 */
export function createGlowText(
  text: string,
  color: keyof typeof glowText
): string {
  return `<span class="${glowText[color]}">${text}</span>`;
}

/**
 * Apply animated underline to element
 */
export function applyAnimatedUnderline(
  element: HTMLElement,
  variant: keyof typeof animatedUnderline
): void {
  element.className += ` ${animatedUnderline[variant]}`;
}

/**
 * Typography presets for common use cases
 */
export const typographyPresets = {
  heroTitle: `${typographyScale.display} ${gradientText.rainbow}`,
  sectionTitle: `${typographyScale.h2} ${glowText.cyan}`,
  cardTitle: `${typographyScale.h4} font-semibold`,
  emphasis: `${glowText.purple} font-semibold`,
  link: `${animatedUnderline.gradient} cursor-pointer`,
  stat: 'font-mono tabular-nums text-3xl font-bold',
};
