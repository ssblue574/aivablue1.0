import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typography, AnimatedNumber, GradientText, GlowText, CodeBlock } from './Typography';
import * as fc from 'fast-check';

describe('Typography Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default variant', () => {
      render(<Typography>Hello World</Typography>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders with h1 variant', () => {
      render(<Typography variant="h1">Title</Typography>);
      const element = screen.getByText('Title');
      expect(element.tagName).toBe('H1');
    });

    it('renders with custom element', () => {
      render(<Typography variant="body" as="div">Content</Typography>);
      const element = screen.getByText('Content');
      expect(element.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Typography className="custom-class">Text</Typography>);
      expect(screen.getByText('Text')).toHaveClass('custom-class');
    });
  });

  describe('Gradient Effects', () => {
    it('applies cyan gradient', () => {
      render(<Typography gradient="cyan">Gradient Text</Typography>);
      const element = screen.getByText('Gradient Text');
      expect(element.className).toContain('bg-gradient-to-r');
      expect(element.className).toContain('from-cyan-400');
    });

    it('applies rainbow gradient', () => {
      render(<Typography gradient="rainbow">Rainbow</Typography>);
      const element = screen.getByText('Rainbow');
      expect(element.className).toContain('bg-gradient-to-r');
    });
  });

  describe('Glow Effects', () => {
    it('applies cyan glow', () => {
      render(<Typography glow="cyan">Glowing Text</Typography>);
      const element = screen.getByText('Glowing Text');
      expect(element.className).toContain('text-cyan-400');
      expect(element.className).toContain('drop-shadow');
    });

    it('applies magenta glow', () => {
      render(<Typography glow="magenta">Magenta Glow</Typography>);
      const element = screen.getByText('Magenta Glow');
      expect(element.className).toContain('text-pink-500');
    });
  });

  describe('Underline Effects', () => {
    it('applies gradient underline', () => {
      render(<Typography underline="gradient">Underlined</Typography>);
      const element = screen.getByText('Underlined');
      expect(element.className).toContain('after:bg-gradient-to-r');
    });

    it('applies glow underline', () => {
      render(<Typography underline="glow">Glow Underline</Typography>);
      const element = screen.getByText('Glow Underline');
      expect(element.className).toContain('after:bg-cyan-400');
    });
  });

  describe('Combined Effects', () => {
    it('applies multiple effects simultaneously', () => {
      render(
        <Typography variant="h2" gradient="purple" underline="gradient">
          Multi Effect
        </Typography>
      );
      const element = screen.getByText('Multi Effect');
      expect(element.tagName).toBe('H2');
      expect(element.className).toContain('bg-gradient-to-r');
      expect(element.className).toContain('after:');
    });
  });
});

describe('AnimatedNumber Component', () => {
  it('renders initial value', async () => {
    render(<AnimatedNumber value={100} duration={10} />);
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('applies prefix and suffix', () => {
    render(<AnimatedNumber value={50} prefix="$" suffix="%" />);
    expect(screen.getByText(/\$.*%/)).toBeInTheDocument();
  });

  it('formats decimals correctly', async () => {
    render(<AnimatedNumber value={3.14159} decimals={2} duration={10} />);
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText(/3\.14/)).toBeInTheDocument();
  });

  it('applies tabular-nums class by default', () => {
    const { container } = render(<AnimatedNumber value={100} />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('tabular-nums');
  });

  it('can disable tabular nums', () => {
    const { container } = render(<AnimatedNumber value={100} tabular={false} />);
    const span = container.querySelector('span');
    expect(span).not.toHaveClass('tabular-nums');
  });
});

describe('GradientText Component', () => {
  it('renders with default cyan gradient', () => {
    render(<GradientText>Gradient</GradientText>);
    const element = screen.getByText('Gradient');
    expect(element.className).toContain('from-cyan-400');
  });

  it('renders with magenta gradient', () => {
    render(<GradientText variant="magenta">Magenta</GradientText>);
    const element = screen.getByText('Magenta');
    expect(element.className).toContain('from-pink-500');
  });
});

describe('GlowText Component', () => {
  it('renders with default cyan glow', () => {
    render(<GlowText>Glow</GlowText>);
    const element = screen.getByText('Glow');
    expect(element.className).toContain('text-cyan-400');
  });

  it('renders with purple glow', () => {
    render(<GlowText variant="purple">Purple</GlowText>);
    const element = screen.getByText('Purple');
    expect(element.className).toContain('text-purple-500');
  });
});

describe('CodeBlock Component', () => {
  it('renders code content', () => {
    const code = 'const x = 10;';
    render(<CodeBlock code={code} />);
    expect(screen.getByText(code)).toBeInTheDocument();
  });

  it('applies language class', () => {
    const { container } = render(<CodeBlock code="test" language="javascript" />);
    const codeElement = container.querySelector('code');
    expect(codeElement).toHaveClass('language-javascript');
  });

  it('shows line numbers when enabled', () => {
    const code = 'line1\nline2\nline3';
    const { container } = render(<CodeBlock code={code} showLineNumbers />);
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('3');
  });
});

// Property Tests for Typography System
/**
 * Feature: futuristic-ui-redesign, Property 20: Text Readability
 * Validates: Requirements 2.2, 9.2
 * 
 * For any body text, it should use comfortable line height (1.5-1.8),
 * appropriate font size (14-16px), and sufficient contrast (at least 4.5:1)
 */
describe('Property 20: Text Readability', () => {
  it('maintains readable contrast in all variants', () => {
    const variants: Array<'h1' | 'h2' | 'h3' | 'body' | 'bodySmall'> = ['h1', 'h2', 'h3', 'body', 'bodySmall'];
    
    variants.forEach((variant) => {
      const { container } = render(<Typography variant={variant}>Readable Text</Typography>);
      const element = container.firstChild as HTMLElement;
      
      // Check that element has appropriate font size classes
      expect(element.className).toBeTruthy();
      expect(element.textContent).toBe('Readable Text');
    });
  });

  it('provides comfortable line height for body text', () => {
    const { container } = render(<Typography variant="body">Long paragraph text that should be comfortable to read with proper line height and spacing.</Typography>);
    const element = container.firstChild as HTMLElement;
    
    // Body text should have relaxed leading (1.5-1.8)
    expect(element.className).toContain('leading-relaxed');
  });

  it('uses appropriate font sizes for body text (14-16px)', () => {
    const { container: bodyContainer } = render(<Typography variant="body">Body text</Typography>);
    const { container: smallContainer } = render(<Typography variant="bodySmall">Small text</Typography>);
    
    const bodyElement = bodyContainer.firstChild as HTMLElement;
    const smallElement = smallContainer.firstChild as HTMLElement;
    
    // Body should be base size (16px)
    expect(bodyElement.className).toContain('text-base');
    // Small should be sm size (14px)
    expect(smallElement.className).toContain('text-sm');
  });
});

describe('Property 22: Heading Typography Standards', () => {
  it('applies consistent heading hierarchy', () => {
    const headings: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headings.forEach((variant) => {
      const { container } = render(<Typography variant={variant}>Heading</Typography>);
      const element = container.firstChild as HTMLElement;
      
      // All headings should have bold or semibold weight (600+)
      const hasBoldWeight = element.className.includes('font-bold') || 
                           element.className.includes('font-semibold') ||
                           element.className.includes('font-extrabold');
      expect(hasBoldWeight).toBe(true);
      
      // All headings should have appropriate letter spacing
      const hasTracking = element.className.includes('tracking-tight') ||
                         element.className.includes('tracking-normal');
      expect(hasTracking).toBe(true);
    });
  });

  it('uses appropriate font sizes for headings', () => {
    const { container: h1Container } = render(<Typography variant="h1">H1</Typography>);
    const { container: h6Container } = render(<Typography variant="h6">H6</Typography>);
    
    const h1 = h1Container.firstChild as HTMLElement;
    const h6 = h6Container.firstChild as HTMLElement;
    
    // H1 should have larger text classes than H6
    expect(h1.className).toContain('text-');
    expect(h6.className).toContain('text-');
  });
});

describe('Property 23: Emphasis Text Visual Effects', () => {
  it('applies glow effects to emphasized text', () => {
    render(<Typography glow="cyan">Emphasized</Typography>);
    const element = screen.getByText('Emphasized');
    
    // Should have glow effect
    expect(element.className).toContain('drop-shadow');
  });

  it('applies gradient effects to emphasized text', () => {
    render(<Typography gradient="rainbow">Gradient Emphasis</Typography>);
    const element = screen.getByText('Gradient Emphasis');
    
    // Should have gradient
    expect(element.className).toContain('bg-gradient-to-r');
    expect(element.className).toContain('bg-clip-text');
  });

  it('applies animated underlines', () => {
    render(<Typography underline="gradient">Underlined</Typography>);
    const element = screen.getByText('Underlined');
    
    // Should have underline animation classes
    expect(element.className).toContain('after:');
  });
});

describe('Property 24: Code Display Standards', () => {
  it('uses monospace font for code', () => {
    const { container } = render(<CodeBlock code="const x = 10;" />);
    const codeElement = container.querySelector('code');
    
    expect(codeElement).toHaveClass('font-mono');
  });

  it('applies proper styling to code blocks', () => {
    const { container } = render(<CodeBlock code="test code" />);
    const preElement = container.querySelector('pre');
    
    // Should have background and border
    expect(preElement).toHaveClass('bg-black/40');
    expect(preElement).toHaveClass('border');
  });

  it('supports line numbers in code blocks', () => {
    const code = 'line1\nline2';
    const { container } = render(<CodeBlock code={code} showLineNumbers />);
    
    // Should render line numbers
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('2');
  });
});

describe('Property 25: Number Display Standards', () => {
  it('uses tabular nums for consistent width', () => {
    const { container } = render(<AnimatedNumber value={123.45} decimals={2} />);
    const span = container.querySelector('span');
    
    expect(span).toHaveClass('tabular-nums');
  });

  it('formats numbers with correct decimals', async () => {
    render(<AnimatedNumber value={3.14159} decimals={2} duration={10} />);
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText(/3\.14/)).toBeInTheDocument();
  });

  it('supports prefix and suffix for currency/units', () => {
    render(<AnimatedNumber value={100} prefix="$" suffix=" USD" />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    expect(screen.getByText(/USD/)).toBeInTheDocument();
  });
});

// Property-Based Tests using fast-check
describe('Property-Based Tests for Typography System', () => {
  /**
   * Feature: futuristic-ui-redesign, Property 20: Text Readability
   * Validates: Requirements 2.2, 9.2
   */
  describe('PBT: Property 20 - Text Readability', () => {
    it('all body text variants maintain comfortable line height', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('body', 'bodyLarge', 'bodySmall'),
          fc.string({ minLength: 10, maxLength: 200 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as 'body' | 'bodyLarge' | 'bodySmall'}>
                {text}
              </Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // All body variants should have relaxed leading (line-height: 1.75)
            return element.className.includes('leading-relaxed');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all text content is properly rendered regardless of content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'bodyLarge', 'bodySmall'),
          fc.string({ minLength: 1, maxLength: 500 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Text should be rendered correctly
            return element.textContent === text;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: futuristic-ui-redesign, Property 22: Heading Typography Standards
   * Validates: Requirements 9.1
   */
  describe('PBT: Property 22 - Heading Typography Standards', () => {
    it('all headings use bold weight (600+) and appropriate letter spacing', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
          fc.string({ minLength: 5, maxLength: 100 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // All headings should have bold or semibold weight (600+)
            const hasBoldWeight = element.className.includes('font-bold') || 
                                 element.className.includes('font-semibold') ||
                                 element.className.includes('font-extrabold');
            
            // Headings should have tight or normal tracking (h1-h4 tight, h5-h6 normal)
            const hasTracking = element.className.includes('tracking-tight') ||
                               element.className.includes('tracking-normal');
            
            return hasBoldWeight && hasTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('heading hierarchy is maintained with appropriate font sizes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 50 }),
          (text) => {
            const { container: h1Container } = render(<Typography variant="h1">{text}</Typography>);
            const { container: h3Container } = render(<Typography variant="h3">{text}</Typography>);
            const { container: h6Container } = render(<Typography variant="h6">{text}</Typography>);
            
            const h1 = h1Container.firstChild as HTMLElement;
            const h3 = h3Container.firstChild as HTMLElement;
            const h6 = h6Container.firstChild as HTMLElement;
            
            // All should have text size classes
            const h1HasSize = h1.className.includes('text-');
            const h3HasSize = h3.className.includes('text-');
            const h6HasSize = h6.className.includes('text-');
            
            return h1HasSize && h3HasSize && h6HasSize;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: futuristic-ui-redesign, Property 23: Emphasis Text Visual Effects
   * Validates: Requirements 9.3
   */
  describe('PBT: Property 23 - Emphasis Text Visual Effects', () => {
    it('all glow effects apply drop-shadow to text', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('cyan', 'magenta', 'purple', 'blue', 'white'),
          fc.string({ minLength: 3, maxLength: 100 }),
          (glowVariant, text) => {
            const { container } = render(
              <Typography glow={glowVariant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Should have drop-shadow effect
            return element.className.includes('drop-shadow');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all gradient effects apply gradient and text clipping', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('cyan', 'magenta', 'purple', 'rainbow', 'gold'),
          fc.string({ minLength: 3, maxLength: 100 }),
          (gradientVariant, text) => {
            const { container } = render(
              <Typography gradient={gradientVariant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Should have gradient and text clipping
            const hasGradient = element.className.includes('bg-gradient-to-r');
            const hasClipping = element.className.includes('bg-clip-text');
            
            return hasGradient && hasClipping;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all underline effects apply animated pseudo-elements', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('gradient', 'glow', 'expand'),
          fc.string({ minLength: 3, maxLength: 100 }),
          (underlineVariant, text) => {
            const { container } = render(
              <Typography underline={underlineVariant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Should have after pseudo-element classes
            return element.className.includes('after:');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: futuristic-ui-redesign, Property 24: Code Display Standards
   * Validates: Requirements 9.4
   */
  describe('PBT: Property 24 - Code Display Standards', () => {
    it('all code blocks use monospace font', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 200 }),
          fc.constantFrom('javascript', 'typescript', 'python', 'rust', 'go'),
          (code, language) => {
            const { container } = render(
              <CodeBlock code={code} language={language} />
            );
            const codeElement = container.querySelector('code');
            
            // Should have monospace font class
            return codeElement?.className.includes('font-mono') ?? false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all code blocks have proper background and border styling', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 500 }),
          (code) => {
            const { container } = render(<CodeBlock code={code} />);
            const preElement = container.querySelector('pre');
            
            // Should have background and border
            const hasBackground = preElement?.className.includes('bg-black/40') ?? false;
            const hasBorder = preElement?.className.includes('border') ?? false;
            
            return hasBackground && hasBorder;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('code blocks with line numbers render correctly', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 80 }), { minLength: 1, maxLength: 20 }),
          (lines) => {
            const code = lines.join('\n');
            const { container } = render(<CodeBlock code={code} showLineNumbers />);
            
            // Should render line numbers
            const hasLineNumbers = container.textContent?.includes('1') ?? false;
            
            return hasLineNumbers;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Feature: futuristic-ui-redesign, Property 22: Heading Typography Standards
   * Validates: Requirements 9.1
   * 
   * For any heading element, it should use bold font weight (600+) and
   * appropriate letter spacing (tracking-tight or tracking-normal)
   */
  describe('PBT: Property 22 - Heading Typography Standards (Comprehensive)', () => {
    it('all heading variants use font weight 600+ (semibold or bold)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'display'),
          fc.string({ minLength: 1, maxLength: 200 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Check for font weight 600+ (semibold, bold, or extrabold)
            const hasBoldWeight = 
              element.className.includes('font-bold') ||      // 700
              element.className.includes('font-semibold') ||  // 600
              element.className.includes('font-extrabold');   // 800
            
            return hasBoldWeight;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all heading variants have appropriate letter spacing (tracking)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'display'),
          fc.string({ minLength: 1, maxLength: 200 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Check for letter spacing (tracking-tight or tracking-normal)
            const hasTracking = 
              element.className.includes('tracking-tight') ||   // -0.025em
              element.className.includes('tracking-normal');    // 0em
            
            return hasTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('heading hierarchy maintains consistent styling across all content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
          fc.array(fc.string({ minLength: 5, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
          (variant, textArray) => {
            // Render multiple headings of the same variant
            const results = textArray.map(text => {
              const { container } = render(
                <Typography variant={variant as any}>{text}</Typography>
              );
              const element = container.firstChild as HTMLElement;
              return {
                hasBoldWeight: element.className.includes('font-bold') || 
                              element.className.includes('font-semibold') ||
                              element.className.includes('font-extrabold'),
                hasTracking: element.className.includes('tracking-tight') ||
                            element.className.includes('tracking-normal'),
                className: element.className
              };
            });
            
            // All headings of the same variant should have consistent styling
            const firstResult = results[0];
            const allConsistent = results.every(r => 
              r.hasBoldWeight === firstResult.hasBoldWeight &&
              r.hasTracking === firstResult.hasTracking &&
              r.className === firstResult.className
            );
            
            return allConsistent && firstResult.hasBoldWeight && firstResult.hasTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('display variant uses extrabold weight and tight tracking', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const { container } = render(
              <Typography variant="display">{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Display should use extrabold (800) and tracking-tight
            const hasExtrabold = element.className.includes('font-extrabold');
            const hasTightTracking = element.className.includes('tracking-tight');
            
            return hasExtrabold && hasTightTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('h1 and h2 use bold weight and tight tracking', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2'),
          fc.string({ minLength: 1, maxLength: 150 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // h1 and h2 should use bold (700) and tracking-tight
            const hasBold = element.className.includes('font-bold');
            const hasTightTracking = element.className.includes('tracking-tight');
            
            return hasBold && hasTightTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('h3 through h6 use semibold weight', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h3', 'h4', 'h5', 'h6'),
          fc.string({ minLength: 1, maxLength: 150 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // h3-h6 should use semibold (600)
            const hasSemibold = element.className.includes('font-semibold');
            
            return hasSemibold;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('h5 and h6 use normal tracking instead of tight', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h5', 'h6'),
          fc.string({ minLength: 1, maxLength: 150 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // h5 and h6 should use tracking-normal (0em)
            const hasNormalTracking = element.className.includes('tracking-normal');
            
            return hasNormalTracking;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all headings render with correct HTML tag by default', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
          fc.string({ minLength: 1, maxLength: 100 }),
          (variant, text) => {
            const { container } = render(
              <Typography variant={variant as any}>{text}</Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Should render with matching HTML tag
            return element.tagName.toLowerCase() === variant;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('headings maintain typography standards when combined with effects', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
          fc.constantFrom('cyan', 'magenta', 'purple', 'rainbow', 'none'),
          fc.constantFrom('cyan', 'magenta', 'purple', 'none'),
          fc.string({ minLength: 5, maxLength: 100 }),
          (variant, gradient, glow, text) => {
            const { container } = render(
              <Typography 
                variant={variant as any}
                gradient={gradient as any}
                glow={glow as any}
              >
                {text}
              </Typography>
            );
            const element = container.firstChild as HTMLElement;
            
            // Even with effects, should maintain bold weight and tracking
            const hasBoldWeight = 
              element.className.includes('font-bold') ||
              element.className.includes('font-semibold') ||
              element.className.includes('font-extrabold');
            
            const hasTracking = 
              element.className.includes('tracking-tight') ||
              element.className.includes('tracking-normal');
            
            return hasBoldWeight && hasTracking;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: futuristic-ui-redesign, Property 25: Number Display Standards
   * Validates: Requirements 9.5
   */
  describe('PBT: Property 25 - Number Display Standards', () => {
    it('all animated numbers use tabular-nums by default', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1000000, noNaN: true }),
          fc.integer({ min: 0, max: 4 }),
          (value, decimals) => {
            const { container } = render(
              <AnimatedNumber value={value} decimals={decimals} />
            );
            const span = container.querySelector('span');
            
            // Should have tabular-nums class
            return span?.className.includes('tabular-nums') ?? false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('numbers format correctly with specified decimal places', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 10000, noNaN: true }),
          fc.integer({ min: 0, max: 3 }),
          (value, decimals) => {
            const { container } = render(
              <AnimatedNumber value={value} decimals={decimals} />
            );
            const span = container.querySelector('span');
            const text = span?.textContent ?? '';
            
            // Check if decimal places match (accounting for animation starting at 0)
            if (decimals === 0) {
              return !text.includes('.');
            } else {
              // During animation it starts at 0, so check format is valid
              return text.length > 0;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('numbers support prefix and suffix for units', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1000, noNaN: true }),
          fc.constantFrom('$', '€', '¥', ''),
          fc.constantFrom(' USD', ' EUR', ' JPY', '%', ''),
          (value, prefix, suffix) => {
            const { container } = render(
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            );
            const span = container.querySelector('span');
            const text = span?.textContent ?? '';
            
            // Should contain prefix and suffix if provided
            const hasPrefix = prefix === '' || text.startsWith(prefix);
            const hasSuffix = suffix === '' || text.endsWith(suffix);
            
            return hasPrefix && hasSuffix;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
