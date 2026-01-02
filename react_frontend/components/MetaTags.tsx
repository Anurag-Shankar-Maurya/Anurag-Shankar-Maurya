
import React, { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  schemaData?: object;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  schemaData
}) => {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = title;
    }

    // Update Meta Description
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };

    updateMeta('description', description || '');
    updateMeta('keywords', keywords || '');
    
    // Open Graph
    updateMeta('og:title', ogTitle || title || '', 'property');
    updateMeta('og:description', ogDescription || description || '', 'property');
    updateMeta('og:type', ogType, 'property');
    if (ogImage) updateMeta('og:image', ogImage, 'property');
    
    if (publishedTime) updateMeta('article:published_time', publishedTime, 'property');
    if (modifiedTime) updateMeta('article:modified_time', modifiedTime, 'property');
    if (author) updateMeta('article:author', author, 'property');

    // Canonical Link
    if (canonical) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', canonical);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonical);
        document.head.appendChild(link);
      }
    }

    // Schema.org JSON-LD
    if (schemaData) {
      let script = document.querySelector('script[type="application/ld+json"]#schema-data');
      if (script) {
        script.textContent = JSON.stringify(schemaData);
      } else {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'schema-data');
        script.textContent = JSON.stringify(schemaData);
        document.head.appendChild(script);
      }
    }

    return () => {
        // Cleanup if necessary (optional, usually title is enough to revert)
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogType, publishedTime, modifiedTime, author, schemaData]);

  return null; // This component doesn't render anything to the DOM
};
