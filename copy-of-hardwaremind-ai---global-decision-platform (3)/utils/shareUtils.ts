/**
 * Social Sharing Utilities
 * Share content to various social platforms
 */

interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

/**
 * Check if Web Share API is available
 */
export const isWebShareSupported = (): boolean => {
  return 'share' in navigator;
};

/**
 * Share using Web Share API
 */
export async function shareViaWebAPI(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    if ((error as Error).name !== 'AbortError') {
      console.error('Share failed:', error);
    }
    return false;
  }
}

/**
 * Share to Twitter/X
 */
export function shareToTwitter(data: ShareData): void {
  const text = encodeURIComponent(`${data.text} ${data.url}`);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank', 'width=550,height=420');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(data: ShareData): void {
  const url = encodeURIComponent(data.url);
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(shareUrl, '_blank', 'width=550,height=420');
}

/**
 * Share to LinkedIn
 */
export function shareToLinkedIn(data: ShareData): void {
  const url = encodeURIComponent(data.url);
  const title = encodeURIComponent(data.title);
  const summary = encodeURIComponent(data.text);
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
  window.open(shareUrl, '_blank', 'width=550,height=420');
}

/**
 * Share via Email
 */
export function shareViaEmail(data: ShareData): void {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
  const mailto = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailto;
}

/**
 * Copy link to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

/**
 * Generate shareable link with UTM parameters
 */
export function generateShareableLink(baseUrl: string, source: string): string {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'share');
  url.searchParams.set('utm_campaign', 'social');
  return url.toString();
}

/**
 * Share product
 */
export function shareProduct(product: { name: string; id: string; imageUrl?: string }): ShareData {
  return {
    title: product.name,
    text: `Check out ${product.name} on HardwareMind`,
    url: `${window.location.origin}/products/${product.id}`,
    image: product.imageUrl,
  };
}

/**
 * Share comparison
 */
export function shareComparison(productIds: string[]): ShareData {
  return {
    title: 'Product Comparison',
    text: `Compare ${productIds.length} products on HardwareMind`,
    url: `${window.location.origin}/compare?products=${productIds.join(',')}`,
  };
}

