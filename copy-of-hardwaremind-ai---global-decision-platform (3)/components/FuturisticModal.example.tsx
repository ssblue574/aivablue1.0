import React, { useState } from 'react';
import { FuturisticModal } from './FuturisticModal';
import { HolographicButton } from './HolographicButton';
import { DynamicInput } from './DynamicInput';
import { ThemeProvider } from '../ThemeContext';

/**
 * FuturisticModal Component Examples
 * 
 * This file demonstrates various use cases of the FuturisticModal component.
 */

// Example 1: Basic Modal
export const BasicModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="p-8">
        <HolographicButton onClick={() => setIsOpen(true)}>
          Open Basic Modal
        </HolographicButton>

        <FuturisticModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Welcome to AIVA"
          subtitle="Your AI-powered intelligence platform"
        >
          <div className="p-6">
            <p className="text-white/80 leading-relaxed">
              This is a basic modal with glassmorphic effects, holographic borders,
              and smooth animations. The modal features backdrop blur, edge glow,
              and an animated gradient border.
            </p>
          </div>
        </FuturisticModal>
      </div>
    </ThemeProvider>
  );
};

// Example 2: Form Modal
export const FormModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, message });
    setIsOpen(false);
    setEmail('');
    setMessage('');
  };

  return (
    <ThemeProvider>
      <div className="p-8">
        <HolographicButton onClick={() => setIsOpen(true)}>
          Open Form Modal
        </HolographicButton>

        <FuturisticModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Contact Us"
          subtitle="Send us a message and we'll get back to you"
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <DynamicInput
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              label="Email Address"
              type="email"
              glowOnFocus={true}
              floatingLabel={true}
            />

            <div className="space-y-2">
              <label className="text-sm text-white/70">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you're thinking..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00FFC6] transition-colors resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <HolographicButton
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </HolographicButton>
              <HolographicButton
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Send Message
              </HolographicButton>
            </div>
          </form>
        </FuturisticModal>
      </div>
    </ThemeProvider>
  );
};

// Example 3: Confirmation Modal
export const ConfirmationModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Action confirmed');
    setIsOpen(false);
  };

  return (
    <ThemeProvider>
      <div className="p-8">
        <HolographicButton onClick={() => setIsOpen(true)} variant="secondary">
          Delete Item
        </HolographicButton>

        <FuturisticModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Deletion"
          subtitle="This action cannot be undone"
          maxWidth="sm"
          closeOnBackdropClick={false}
        >
          <div className="p-6 space-y-6">
            <p className="text-white/80 leading-relaxed">
              Are you sure you want to delete this item? All associated data will be
              permanently removed from our servers.
            </p>

            <div className="flex gap-3">
              <HolographicButton
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </HolographicButton>
              <HolographicButton
                variant="secondary"
                onClick={handleConfirm}
                className="flex-1"
              >
                Delete
              </HolographicButton>
            </div>
          </div>
        </FuturisticModal>
      </div>
    </ThemeProvider>
  );
};

// Example 4: Large Content Modal
export const LargeContentModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="p-8">
        <HolographicButton onClick={() => setIsOpen(true)}>
          Open Large Modal
        </HolographicButton>

        <FuturisticModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Product Details"
          subtitle="Complete specifications and features"
          maxWidth="4xl"
        >
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Features</h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Advanced AI processing</li>
                  <li>• Real-time data analysis</li>
                  <li>• Cloud synchronization</li>
                  <li>• Multi-device support</li>
                  <li>• End-to-end encryption</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Specifications</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Processor</span>
                    <span className="text-white">Neural Engine X1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Memory</span>
                    <span className="text-white">16GB LPDDR5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Storage</span>
                    <span className="text-white">512GB SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Battery</span>
                    <span className="text-white">24 hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Description</h3>
              <p className="text-white/80 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <HolographicButton onClick={() => setIsOpen(false)} className="w-full">
                Close
              </HolographicButton>
            </div>
          </div>
        </FuturisticModal>
      </div>
    </ThemeProvider>
  );
};

// Example 5: No Header Modal
export const NoHeaderModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="p-8">
        <HolographicButton onClick={() => setIsOpen(true)}>
          Open Minimal Modal
        </HolographicButton>

        <FuturisticModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showCloseButton={false}
          maxWidth="md"
        >
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00FFC6] to-[#6AA8FF] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Success!</h3>
              <p className="text-white/70">
                Your action has been completed successfully.
              </p>
            </div>

            <HolographicButton onClick={() => setIsOpen(false)} className="w-full">
              Continue
            </HolographicButton>
          </div>
        </FuturisticModal>
      </div>
    </ThemeProvider>
  );
};

// Combined demo component
export const FuturisticModalDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">FuturisticModal Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Basic Modal</h2>
          <BasicModalExample />
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Form Modal</h2>
          <FormModalExample />
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Confirmation</h2>
          <ConfirmationModalExample />
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Large Content</h2>
          <LargeContentModalExample />
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Minimal</h2>
          <NoHeaderModalExample />
        </div>
      </div>
    </div>
  );
};
