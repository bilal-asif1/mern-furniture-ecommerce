import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://junaidfurniture.netlify.app';
const SITE_NAME = 'Junaid Furniture';

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogType = 'website',
  ogImage,
  schema 
}) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update or create canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || `${SITE_URL}${location.pathname}`);

    // Update Open Graph tags
    const updateOgMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOgMeta('og:title', title);
    updateOgMeta('og:description', description);
    updateOgMeta('og:type', ogType);
    updateOgMeta('og:url', canonical || `${SITE_URL}${location.pathname}`);
    if (ogImage) {
      updateOgMeta('og:image', ogImage);
    }

    // Update Twitter tags
    const updateTwitterMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateTwitterMeta('twitter:title', title);
    updateTwitterMeta('twitter:description', description);

    // Update JSON-LD structured data
    if (schema) {
      let scriptTag = document.getElementById('json-ld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup is optional since we're updating the same elements
    };
  }, [title, description, canonical, ogType, ogImage, schema, location.pathname]);

  return null;
}
