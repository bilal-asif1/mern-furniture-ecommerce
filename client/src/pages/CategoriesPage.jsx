import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { readListingPosition } from '../utils/listingPosition';
import categoriesHero from '../assets/images/categories/categories-hero.jpg';


export default function CategoriesPage() {
  const { products } = useApp();
  const location = useLocation();
  const restoredPositionKeyRef = useRef('');

  useLayoutEffect(() => {
    if (products.length === 0) return;
    if (!location.key || restoredPositionKeyRef.current === location.key) return;

    const restoreState = readListingPosition(location.key);
    if (!restoreState || restoreState.pathname !== location.pathname) return;

    const target = restoreState.productSlug
      ? document.querySelector(`[data-product-slug="${restoreState.productSlug}"]`)
      : null;

    const raf = window.requestAnimationFrame(() => {
      if (target && typeof restoreState.cardTop === 'number') {
        const nextTop = Math.max(
          0,
          window.scrollY + (target.getBoundingClientRect().top - restoreState.cardTop),
        );
        window.scrollTo({ top: nextTop, behavior: 'auto' });
      } else if (typeof restoreState.pageScrollY === 'number') {
        window.scrollTo({ top: restoreState.pageScrollY, behavior: 'auto' });
      }

      restoredPositionKeyRef.current = location.key;
    });

    return () => window.cancelAnimationFrame(raf);
  }, [location.key, location.pathname, products.length]);

  return (
    <>
      <SEO
        title="Categories | Junaid Furniture"
        description="Browse luxury furniture by curated category at Junaid Furniture. Discover dressing tables, bed sets, sofa sets, dining sets, and more premium furniture in Pakistan."
        canonical="https://junaidfurniture.netlify.app/categories"
      />
      <PageHero
        kicker="Categories"
        title="Browse luxury furniture by curated category."
        description="A richer, more visual discovery experience for dressing, bed sets, sofa sets, dining sets, and more."
        image={categoriesHero}
      />

      <PageSection>
        <SectionTitle eyebrow="Featured by Category" title="Popular Pieces" description="A few current products styled to match the premium category experience." />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} compact index={index} />
          ))}
        </div>
      </PageSection>
    </>
  );
}
