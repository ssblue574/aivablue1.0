/**
 * SEO Utilities
 * Manage meta tags, structured data, and SEO optimization
 */

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

/**
 * Update page title and meta tags
 */
export function updateSEO(data: SEOData): void {
  // Update title
  document.title = `${data.title} | HardwareMind`;

  // Update or create meta tags
  updateMetaTag('description', data.description);
  if (data.keywords && data.keywords.length > 0) {
    updateMetaTag('keywords', data.keywords.join(', '));
  }

  // Open Graph tags
  updateMetaTag('og:title', data.title, 'property');
  updateMetaTag('og:description', data.description, 'property');
  updateMetaTag('og:type', data.type || 'website', 'property');
  if (data.url) {
    updateMetaTag('og:url', data.url, 'property');
  }
  if (data.image) {
    updateMetaTag('og:image', data.image, 'property');
  }

  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', data.title);
  updateMetaTag('twitter:description', data.description);
  if (data.image) {
    updateMetaTag('twitter:image', data.image);
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

/**
 * Generate structured data for product
 */
export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  brand: string;
  priceEstimate?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    image: product.imageUrl,
    offers: product.priceEstimate ? {
      '@type': 'Offer',
      price: product.priceEstimate,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    } : undefined,
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  };
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HardwareMind',
    url: window.location.origin,
    logo: `${window.location.origin}/icon-512.png`,
    description: 'AI-powered global decision platform for hardware products',
  };
}

/**
 * Add structured data to page
 */
export function addStructuredData(data: object): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  script.id = 'structured-data';
  
  // Remove existing structured data
  const existing = document.getElementById('structured-data');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(url: string, priority: number = 0.5, changefreq: string = 'weekly'): string {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

