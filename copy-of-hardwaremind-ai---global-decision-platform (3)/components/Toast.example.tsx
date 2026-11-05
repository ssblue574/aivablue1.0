import React from 'react';
import { useToast, ToastContainer } from './Toast';
import { HolographicButton } from './HolographicButton';
import { Heart, ShoppingCart, Star, Check, AlertCircle, Info } from 'lucide-react';

/**
 * Toast Component Examples
 * 
 * Demonstrates various toast notifications for user actions
 */
export const ToastExamples: React.FC = () => {
  const toast = useToast();

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Toast Notifications</h1>
          <p className="text-white/60">
            Futuristic completion animations for user actions
          </p>
        </div>

        {/* Basic Types */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Basic Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <HolographicButton
              onClick={() => toast.success('Operation completed successfully!')}
              variant="primary"
            >
              <Check size={16} />
              Success
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.error('Something went wrong. Please try again.')}
              variant="secondary"
            >
              <AlertCircle size={16} />
              Error
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.info('New features are now available!')}
              variant="ghost"
            >
              <Info size={16} />
              Info
            </HolographicButton>
          </div>
        </section>

        {/* Action-Specific */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Action-Specific</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <HolographicButton
              onClick={() => toast.favorite('Added to your favorites!')}
              variant="primary"
            >
              <Heart size={16} />
              Favorite
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.cart('Added to cart successfully!')}
              variant="primary"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.rating('Thank you for your rating!')}
              variant="primary"
            >
              <Star size={16} />
              Rate
            </HolographicButton>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Real-World Examples</h2>
          <div className="space-y-3">
            <HolographicButton
              onClick={() => {
                // Simulate favorite toggle
                const isFavorited = Math.random() > 0.5;
                if (isFavorited) {
                  toast.favorite('Humane AI Pin added to favorites');
                } else {
                  toast.info('Humane AI Pin removed from favorites');
                }
              }}
              variant="ghost"
              className="w-full"
            >
              Toggle Favorite (Random)
            </HolographicButton>

            <HolographicButton
              onClick={() => {
                // Simulate purchase
                setTimeout(() => {
                  toast.cart('Rabbit R1 added to cart - $199');
                }, 500);
              }}
              variant="primary"
              className="w-full"
            >
              Purchase Product
            </HolographicButton>

            <HolographicButton
              onClick={() => {
                // Simulate form submission
                toast.info('Processing your request...');
                setTimeout(() => {
                  toast.success('Form submitted successfully!');
                }, 2000);
              }}
              variant="secondary"
              className="w-full"
            >
              Submit Form (Delayed)
            </HolographicButton>

            <HolographicButton
              onClick={() => {
                // Simulate error
                toast.error('Network error. Please check your connection.');
              }}
              variant="ghost"
              className="w-full"
            >
              Trigger Error
            </HolographicButton>
          </div>
        </section>

        {/* Custom Durations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Custom Durations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <HolographicButton
              onClick={() => toast.success('Quick message (1s)', 1000)}
              variant="ghost"
            >
              1 Second
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.info('Normal message (3s)', 3000)}
              variant="ghost"
            >
              3 Seconds
            </HolographicButton>

            <HolographicButton
              onClick={() => toast.success('Long message (5s)', 5000)}
              variant="ghost"
            >
              5 Seconds
            </HolographicButton>
          </div>
        </section>

        {/* Multiple Toasts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Multiple Toasts</h2>
          <HolographicButton
            onClick={() => {
              toast.info('Processing step 1...');
              setTimeout(() => toast.info('Processing step 2...'), 500);
              setTimeout(() => toast.info('Processing step 3...'), 1000);
              setTimeout(() => toast.success('All steps completed!'), 1500);
            }}
            variant="primary"
            className="w-full"
          >
            Show Multiple Toasts
          </HolographicButton>
        </section>

        {/* E-commerce Flow */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">E-commerce Flow</h2>
          <HolographicButton
            onClick={() => {
              toast.cart('Meta Quest 3 added to cart');
              setTimeout(() => {
                toast.favorite('Also added to favorites for later');
              }, 1000);
              setTimeout(() => {
                toast.success('Checkout ready! 2 items in cart.');
              }, 2000);
            }}
            variant="primary"
            className="w-full"
          >
            Simulate Purchase Flow
          </HolographicButton>
        </section>
      </div>

      {/* Toast Container - positioned at top-right */}
      <ToastContainer 
        toasts={toast.toasts} 
        onClose={toast.removeToast}
        position="top-right"
      />
    </div>
  );
};

export default ToastExamples;
