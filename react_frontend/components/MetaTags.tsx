import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  const ownerName = "Anurag Shankar Maurya";
  const defaultSkills = ["Django", "Python", "AI", "Generative AI", "React", "Django REST Framework"];
  const currentTitle = title || ownerName;
  const currentDescription = description || `${ownerName} — ${defaultSkills.join(', ')}. Professional portfolio showcasing projects, projects, and expertise.`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": ownerName,
    "jobTitle": author || undefined,
    "description": currentDescription,
    "skills": defaultSkills,
    "url": canonical || (typeof window !== 'undefined' ? window.location.origin : undefined),
    "sameAs": []
  };

  // Merge any provided schemaData (e.g., pages can pass sameAs/social links)
  const finalSchema = { ...defaultSchema, ...(schemaData || {}) };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || currentTitle} />
      <meta property="og:description" content={ogDescription || currentDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || currentTitle} />
      <meta name="twitter:description" content={ogDescription || currentDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Article Specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script> 
    </Helmet>
  );
};
