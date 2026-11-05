import React from 'react';
import { Typography, AnimatedNumber, GradientText, GlowText, CodeBlock } from './Typography';

/**
 * Typography Examples
 * 
 * Demonstrates all typography variants and effects available in the system.
 */
export function TypographyExamples() {
  return (
    <div className="space-y-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      {/* Heading Hierarchy */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Heading Hierarchy</Typography>
        <Typography variant="display">Display Text - Hero Headlines</Typography>
        <Typography variant="h1">H1 - Main Page Title</Typography>
        <Typography variant="h2">H2 - Section Headers</Typography>
        <Typography variant="h3">H3 - Subsection Headers</Typography>
        <Typography variant="h4">H4 - Card Titles</Typography>
        <Typography variant="h5">H5 - Small Headings</Typography>
        <Typography variant="h6">H6 - Micro Headings</Typography>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Body Text Variants</Typography>
        <Typography variant="bodyLarge">
          Large body text for introductions and important paragraphs. This size is perfect for lead text.
        </Typography>
        <Typography variant="body">
          Regular body text for standard content. This is the most common text size used throughout the application.
          It provides comfortable reading with proper line height and letter spacing.
        </Typography>
        <Typography variant="bodySmall">
          Small body text for secondary information, captions, and metadata.
        </Typography>
        <Typography variant="caption">
          Caption Text - Labels and Tags
        </Typography>
      </section>

      {/* Gradient Text */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Gradient Text Effects</Typography>
        <Typography variant="h1" gradient="cyan">Cyan Gradient</Typography>
        <Typography variant="h1" gradient="magenta">Magenta Gradient</Typography>
        <Typography variant="h1" gradient="purple">Purple Gradient</Typography>
        <Typography variant="h1" gradient="rainbow">Rainbow Gradient</Typography>
        <Typography variant="h1" gradient="gold">Gold Gradient</Typography>
      </section>

      {/* Glow Text */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Glowing Text Effects</Typography>
        <Typography variant="h1" glow="cyan">Cyan Glow</Typography>
        <Typography variant="h1" glow="magenta">Magenta Glow</Typography>
        <Typography variant="h1" glow="purple">Purple Glow</Typography>
        <Typography variant="h1" glow="blue">Blue Glow</Typography>
        <Typography variant="h1" glow="white">White Glow</Typography>
      </section>

      {/* Animated Underlines */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Animated Underlines</Typography>
        <Typography variant="h3" underline="gradient">
          Gradient Underline (Hover Me)
        </Typography>
        <Typography variant="h3" underline="glow">
          Glowing Underline (Hover Me)
        </Typography>
        <Typography variant="h3" underline="expand">
          Expanding Underline (Hover Me)
        </Typography>
      </section>

      {/* Combined Effects */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Combined Effects</Typography>
        <Typography variant="h1" gradient="rainbow" underline="gradient">
          Gradient Text with Underline
        </Typography>
        <Typography variant="h2" glow="magenta" underline="glow">
          Glowing Text with Glowing Underline
        </Typography>
      </section>

      {/* Animated Numbers */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Animated Numbers</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <AnimatedNumber 
              value={1234} 
              className="text-4xl font-bold text-cyan-400"
            />
            <Typography variant="bodySmall" className="text-white/60 mt-2">
              Total Users
            </Typography>
          </div>
          <div className="text-center">
            <AnimatedNumber 
              value={98.5} 
              decimals={1}
              suffix="%"
              className="text-4xl font-bold text-pink-500"
            />
            <Typography variant="bodySmall" className="text-white/60 mt-2">
              Success Rate
            </Typography>
          </div>
          <div className="text-center">
            <AnimatedNumber 
              value={42000} 
              prefix="$"
              className="text-4xl font-bold text-purple-500"
            />
            <Typography variant="bodySmall" className="text-white/60 mt-2">
              Revenue
            </Typography>
          </div>
          <div className="text-center">
            <AnimatedNumber 
              value={3.14159} 
              decimals={5}
              className="text-4xl font-bold text-blue-400"
            />
            <Typography variant="bodySmall" className="text-white/60 mt-2">
              Pi Value
            </Typography>
          </div>
        </div>
      </section>

      {/* Gradient and Glow Components */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Inline Text Effects</Typography>
        <Typography variant="body">
          This is a paragraph with <GradientText variant="cyan">gradient text</GradientText> and{' '}
          <GlowText variant="magenta">glowing text</GlowText> inline. You can mix and match{' '}
          <GradientText variant="rainbow">different effects</GradientText> within the same paragraph.
        </Typography>
      </section>

      {/* Code Display */}
      <section className="space-y-4">
        <Typography variant="h2" glow="cyan">Code Display</Typography>
        
        <Typography variant="body">
          Inline code: <code>const x = 10;</code>
        </Typography>

        <CodeBlock
          language="typescript"
          code={`// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};`}
        />

        <CodeBlock
          language="javascript"
          showLineNumbers
          code={`// JavaScript with Line Numbers
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`}
        />
      </section>

      {/* Real-world Usage Examples */}
      <section className="space-y-6">
        <Typography variant="h2" glow="cyan">Real-world Usage Examples</Typography>
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <Typography variant="display" gradient="rainbow">
            Welcome to AIVA
          </Typography>
          <Typography variant="bodyLarge" className="text-white/80 max-w-2xl mx-auto">
            The future of AI-powered platforms. Experience cutting-edge technology
            with a beautiful, intuitive interface.
          </Typography>
        </div>

        {/* Feature Card */}
        <div className="glass-card p-6 space-y-3">
          <Typography variant="h3" glow="cyan">
            Neural Network Visualization
          </Typography>
          <Typography variant="body" className="text-white/70">
            Watch as our AI processes your data in real-time with stunning
            visual feedback and <GlowText variant="purple">intelligent insights</GlowText>.
          </Typography>
          <div className="flex gap-4 items-center">
            <AnimatedNumber value={99.9} decimals={1} suffix="%" className="text-2xl font-bold text-cyan-400" />
            <Typography variant="bodySmall" className="text-white/60">
              Accuracy Rate
            </Typography>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 10000, label: 'Active Users', color: 'text-cyan-400' },
            { value: 500, label: 'AI Models', color: 'text-pink-500' },
            { value: 99.99, decimals: 2, suffix: '%', label: 'Uptime', color: 'text-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <AnimatedNumber 
                value={stat.value} 
                decimals={stat.decimals}
                suffix={stat.suffix}
                className={`text-3xl font-bold ${stat.color}`}
              />
              <Typography variant="bodySmall" className="text-white/60 mt-2">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TypographyExamples;
