
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  structuredData
}: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && canonicalUrl) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Update Open Graph image
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta && ogImage) {
      ogImageMeta.setAttribute('content', ogImage);
    }

    // Add structured data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null;
};
