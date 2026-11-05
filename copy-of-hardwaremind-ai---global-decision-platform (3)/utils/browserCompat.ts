/**
 * Browser Compatibility Utilities
 * Provides feature detection and fallback strategies for modern CSS features
 */

export interface BrowserFeatures {
  backdropFilter: boolean;
  transforms3d: boolean;
  webp: boolean;
  cssGrid: boolean;
  customProperties: boolean;
  intersectionObserver: boolean;
  webAnimations: boolean;
}

/**
 * Detect if backdrop-filter is supported
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  testElement.style.backdropFilter = 'blur(10px)';
  testElement.style.webkitBackdropFilter = 'blur(10px)';
  
  return !!(
    testElement.style.backdropFilter ||
    testElement.style.webkitBackdropFilter
  );
};

/**
 * Detect if CSS 3D transforms are supported
 */
export const supports3DTransforms = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  const transforms = [
    'transform',
    'WebkitTransform',
    'MozTransform',
    'msTransform',
    'OTransform'
  ];
  
  for (const transform of transforms) {
    if (testElement.style[transform as any] !== undefined) {
      testElement.style[transform as any] = 'translate3d(1px, 1px, 1px)';
      const has3d = testElement.style[transform as any];
      return has3d !== undefined && has3d.length > 0 && has3d !== 'none';
    }
  }
  
  return false;
};

/**
 * Detect if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Detect if CSS Grid is supported
 */
export const supportsCSSGrid = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof CSS === 'undefined' || !CSS.supports) return true; // Assume support in test env
  
  return CSS.supports('display', 'grid');
};

/**
 * Detect if CSS Custom Properties are supported
 */
export const supportsCustomProperties = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (typeof CSS === 'undefined' || !CSS.supports) return true; // Assume support in test env
  
  return CSS.supports('--test', '0');
};

/**
 * Detect if Intersection Observer is supported
 */
export const supportsIntersectionObserver = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'IntersectionObserver' in window;
};

/**
 * Detect if Web Animations API is supported
 */
export const supportsWebAnimations = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'animate' in document.createElement('div');
};

/**
 * Get all browser features at once
 */
export const detectBrowserFeatures = async (): Promise<BrowserFeatures> => {
  const webpSupport = await supportsWebP();
  
  return {
    backdropFilter: supportsBackdropFilter(),
    transforms3d: supports3DTransforms(),
    webp: webpSupport,
    cssGrid: supportsCSSGrid(),
    customProperties: supportsCustomProperties(),
    intersectionObserver: supportsIntersectionObserver(),
    webAnimations: supportsWebAnimations(),
  };
};

/**
 * Add feature detection classes to document element
 * This allows CSS to apply fallbacks using feature classes
 */
export const addFeatureClasses = async (): Promise<void> => {
  if (typeof document === 'undefined') return;
  
  const features = await detectBrowserFeatures();
  const html = document.documentElement;
  
  // Add or remove classes based on feature support
  Object.entries(features).forEach(([feature, supported]) => {
    if (supported) {
      html.classList.add(`supports-${feature}`);
      html.classList.remove(`no-${feature}`);
    } else {
      html.classList.add(`no-${feature}`);
      html.classList.remove(`supports-${feature}`);
    }
  });
};

/**
 * Get browser info
 */
export const getBrowserInfo = () => {
  if (typeof navigator === 'undefined') return null;
  
  const ua = navigator.userAgent;
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
  const isSafari = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  
  return {
    isChrome,
    isSafari,
    isFirefox,
    isEdge,
    isIOS,
    isAndroid,
    isMobile: isIOS || isAndroid,
  };
};

/**
 * Log browser compatibility report to console
 */
export const logCompatibilityReport = async (): Promise<void> => {
  const features = await detectBrowserFeatures();
  const browserInfo = getBrowserInfo();
  
  console.group('🔍 Browser Compatibility Report');
  console.log('Browser:', browserInfo);
  console.log('Features:', features);
  
  const unsupportedFeatures = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);
  
  if (unsupportedFeatures.length > 0) {
    console.warn('⚠️ Unsupported features:', unsupportedFeatures);
    console.log('Fallbacks will be applied automatically');
  } else {
    console.log('✅ All features supported!');
  }
  
  console.groupEnd();
};
