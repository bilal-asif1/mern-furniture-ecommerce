import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { readListingPosition } from '../utils/listingPosition';
import { productMatchesShopCategory, resolveShopCategoryQuery } from '../utils/shopCategories';

const PLACEHOLDER_IMAGE = '/category-placeholder.svg';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('default');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const { products, catalogListLoading, catalogError, fetchProducts } = useApp();

  const filterMenuRef = useRef(null);
  const productSectionRef = useRef(null);
  const restoredPositionKeyRef = useRef('');
  const categorySlug = searchParams.get('category') || '';
  const resolvedCategory = useMemo(() => resolveShopCategoryQuery(categorySlug), [categorySlug]);
  const hasRestoreState = Boolean(location.key && readListingPosition(location.key));

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (hasRestoreState) return undefined;

    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [categorySlug, hasRestoreState]);

  useEffect(() => {
    fetchProducts({
      all: true,
      ...(resolvedCategory.query ? { category: resolvedCategory.query } : {}),
    });
    return undefined;
  }, [fetchProducts, resolvedCategory.query]);

  const visibleProducts = useMemo(() => {
    const categoryFiltered = products.filter((product) => productMatchesShopCategory(product, resolvedCategory.query));

    const filtered = categoryFiltered.filter((product) => {
      if (activeFilter === 'featured') return Boolean(product.featured || product.badge === 'Featured');
      if (activeFilter === 'best-seller') return Boolean(product.bestSeller);
      if (activeFilter === 'new-arrival') return Boolean(product.newArrival);
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === 'featured') {
      sorted.sort((a, b) => Number(Boolean(b.featured || b.badge === 'Featured')) - Number(Boolean(a.featured || a.badge === 'Featured')));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'best-seller') {
      sorted.sort((a, b) => Number(Boolean(b.bestSeller)) - Number(Boolean(a.bestSeller)));
    } else if (sortBy === 'top-rated') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sortBy === 'default' ? filtered : sorted;
  }, [products, activeFilter, resolvedCategory.query, sortBy]);

  useLayoutEffect(() => {
    if (catalogListLoading || visibleProducts.length === 0) return;
    if (!location.key || restoredPositionKeyRef.current === location.key) return;

    const restoreState = readListingPosition(location.key);
    if (!restoreState || restoreState.pathname !== location.pathname) return;

    const scope = restoreState.containerId
      ? document.querySelector(`[data-scroll-restore-id="${restoreState.containerId}"]`)
      : document;
    const target = restoreState.productSlug && scope?.querySelector
      ? scope.querySelector(`[data-product-slug="${restoreState.productSlug}"]`)
      : null;

    const raf = window.requestAnimationFrame(() => {
      if (scope instanceof HTMLElement && typeof restoreState.containerScrollLeft === 'number') {
        scope.scrollLeft = restoreState.containerScrollLeft;
      }

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
  }, [catalogListLoading, location.key, location.pathname, visibleProducts.length]);

  const filterOptions = [
    { value: 'all', label: 'All products' },
    { value: 'featured', label: 'Featured' },
    { value: 'best-seller', label: 'Best Sellers' },
    { value: 'new-arrival', label: 'New Arrivals' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'best-seller', label: 'Best Sellers' },
    { value: 'top-rated', label: 'Top Rated' },
  ];


  return (
    <>
      <SEO
        title="Shop | Junaid Furniture"
        description="Browse our complete collection of premium furniture. Filter by category, sort by featured or newest, and find the perfect pieces for your home."
        canonical="https://junaidfurniture.netlify.app/shop"
      />

      <section ref={productSectionRef} className="section-shell pt-2 sm:pt-3 lg:pt-4">
        <div className="rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85 px-4 py-4 shadow-[0_12px_30px_rgba(86,58,36,0.05)] sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div ref={filterMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4d5c4] bg-[#fbf7f2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text/70 transition hover:border-[#caa782] hover:text-text"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  <ChevronDown className={`h-3.5 w-3.5 transition ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {filterOpen ? (
                  <div className="absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-[1.25rem] border border-[#eadfce] bg-white p-3 shadow-[0_18px_45px_rgba(84,59,39,0.12)]">
                    <div className="flex items-center justify-between gap-3 pb-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-primary/80">Quick filters</p>
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-text/60 transition hover:border-primary hover:text-text"
                        aria-label="Close filters"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-2">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setActiveFilter(option.value);
                            setFilterOpen(false);
                          }}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${activeFilter === option.value ? 'border-primary bg-[#f7efe7] text-primary' : 'border-[#eadfce] bg-[#fcfaf7] text-text/70 hover:border-[#caa782]'}`}
                        >
                          <span>{option.label}</span>
                          {activeFilter === option.value ? <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active</span> : null}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveFilter('all');
                          setFilterOpen(false);
                        }}
                        className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80 transition hover:text-primary"
                      >
                        Clear filter
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="text-sm text-text/60">
                Showing {visibleProducts.length}{resolvedCategory.label ? ` ${resolvedCategory.label} products` : ' products'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="shop-sort" className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/80">
                Sort by
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-0 rounded-full border border-[#e4d5c4] bg-[#fbf7f2] px-4 py-2 text-sm text-text/75 outline-none transition focus:border-[#b88967]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {catalogError ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-[1.5rem] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {catalogError}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {catalogListLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-5 2xl:gap-6"
          >
            {[...Array(8)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85">
                <div className="aspect-[4/5] bg-[#fbf7f2] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#eadfce]/50 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-[#eadfce]/50 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-[#eadfce]/50 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : null}

        {!catalogListLoading && visibleProducts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-[#eadfce]/70 bg-white/90 px-6 py-10 text-sm text-text/60 shadow-[0_16px_40px_rgba(86,58,36,0.06)]">
            No products found for this selection.
          </div>
        ) : null}

        {visibleProducts.length > 0 ? (
          <>
            <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-5 2xl:gap-6">
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} compact index={index} animateOnMount={false} />
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text/60">
                Showing {visibleProducts.length} products after filters
              </p>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
