import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const PER_PAGE = 12;
const PLACEHOLDER_IMAGE = '/category-placeholder.svg';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [sortBy, setSortBy] = useState('featured');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const { categories, products, fetchProducts, catalogListLoading, catalogError, catalogPages, catalogCount } = useApp();

  const railRef = useRef(null);
  const categoryRefs = useRef(new Map());
  const filterMenuRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dragStateRef = useRef({
    isDown: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    suppressClick: false,
  });

  const activeCategory = useMemo(
    () => categories.find((item) => item.slug === categorySlug) || null,
    [categories, categorySlug],
  );

  useEffect(() => {
    const params = { limit: PER_PAGE, page };
    if (activeCategory?.id) {
      params.categoryId = activeCategory.id;
    }
    fetchProducts(params);
  }, [fetchProducts, activeCategory, page]);

  useEffect(() => {
    const key = categorySlug || 'all';
    const categoryButton = categoryRefs.current.get(key);
    if (categoryButton) {
      categoryButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [categorySlug]);

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
    const rail = railRef.current;
    if (!rail) return undefined;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
      setScrollProgress(scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0);
    };

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const onNativeWheel = (event) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      rail.scrollBy({ left: delta, behavior: 'smooth' });
    };

    rail.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      rail.removeEventListener('wheel', onNativeWheel);
    };
  }, [categories]);

  const totalPages = Math.max(1, catalogPages || 1);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
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

    return sorted;
  }, [products, activeFilter, sortBy]);

  const syncParams = useCallback((next = {}) => {
    const params = new URLSearchParams();
    const merged = {
      category: categorySlug,
      page,
      ...next,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (!value || value === 1) return;
      params.set(key, String(value));
    });

    setSearchParams(params);
  }, [categorySlug, page, setSearchParams]);

  const handleSelectCategory = useCallback((category) => {
    setCategorySlug(category.slug);
    setPage(1);
    syncParams({ category: category.slug, page: 1 });
  }, [syncParams]);

  const clearFilters = useCallback(() => {
    setCategorySlug('');
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  const filterOptions = [
    { value: 'all', label: 'All products' },
    { value: 'featured', label: 'Featured' },
    { value: 'best-seller', label: 'Best Sellers' },
    { value: 'new-arrival', label: 'New Arrivals' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'best-seller', label: 'Best Sellers' },
    { value: 'top-rated', label: 'Top Rated' },
  ];

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;

    // Don't start drag if clicking on a button or its children
    // This allows the button's onClick to fire normally
    if (event.target.closest('button')) {
      return;
    }

    dragStateRef.current = {
      isDown: true,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      suppressClick: false,
      startTime: Date.now(),
    };
  };

  const handlePointerMove = useCallback((event) => {
    const state = dragStateRef.current;
    const rail = railRef.current;
    if (!state.isDown || !rail) return;

    const deltaX = event.clientX - state.startX;
    const deltaTime = Date.now() - state.startTime;
    
    // Only suppress click if there's significant movement AND it's been held long enough
    // This distinguishes between click jitter and intentional dragging
    if (Math.abs(deltaX) > 15 && deltaTime > 150) {
      state.suppressClick = true;
    }

    rail.scrollLeft = state.scrollLeft - deltaX;
  }, []);

  const handlePointerUp = useCallback(() => {
    const state = dragStateRef.current;
    if (!state.isDown) return;

    state.isDown = false;
    window.setTimeout(() => {
      state.suppressClick = false;
    }, 0);
  }, []);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.round(rail.clientWidth * 0.72) * direction;
    rail.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleCategoryClick = (category, event) => {
    if (!category) {
      clearFilters();
      return;
    }

    handleSelectCategory(category);
  };

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10 lg:pt-12 pb-0 mb-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
          <div className="flex shrink-0 flex-col items-center text-center lg:w-[200px] lg:items-start lg:text-left xl:w-[220px]">
            <p className="font-display text-[2rem] font-medium uppercase leading-[0.82] tracking-[0.12em] text-primary sm:text-[2.35rem] lg:text-[2.75rem]">
              <span className="block">Shop</span>
              <span className="block">Furniture</span>
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <div
              ref={railRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                willChange: 'transform',
              }}
              className="scrollbar-hide flex w-full flex-nowrap items-start gap-6 overflow-x-auto overflow-y-hidden pb-2 pr-1 [scroll-behavior:smooth] [scroll-snap-type:x_mandatory] [scrollbar-width:none] cursor-grab active:cursor-grabbing sm:gap-7 sm:pr-2 lg:gap-8 lg:pb-3 lg:pt-1"
            >
              <motion.button
                type="button"
                ref={(node) => {
                  if (node) categoryRefs.current.set('all', node);
                  else categoryRefs.current.delete('all');
                }}
                onClick={(event) => handleCategoryClick(null, event)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex w-[96px] flex-none shrink-0 flex-col items-center snap-start text-center transition sm:w-[104px] lg:mt-[2px] lg:w-[110px] ${!categorySlug ? 'text-primary' : 'text-text/70'}`}
              >
                <span className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border text-[10px] font-semibold uppercase tracking-[0.24em] transition sm:h-20 sm:w-20 sm:text-[11px] ${!categorySlug ? 'border-[#8b5e3c] bg-[#f7efe7] shadow-[0_14px_32px_rgba(139,94,60,0.16)]' : 'border-[#ebdccb] bg-[#fcfaf7] group-hover:border-[#b88967]'}`}>
                  All
                </span>
                <span className="mt-3 block w-full whitespace-normal text-center text-[10px] font-medium uppercase leading-snug tracking-[0.22em] sm:text-[11px]">
                  Categories
                </span>
              </motion.button>

              {categories.map((category, index) => {
                const isActive = categorySlug === category.slug;
                const image = category.image || PLACEHOLDER_IMAGE;

                return (
                  <motion.button
                    key={category.id || category.slug}
                    type="button"
                    ref={(node) => {
                      if (node) categoryRefs.current.set(category.slug, node);
                      else categoryRefs.current.delete(category.slug);
                    }}
                    onClick={(event) => handleCategoryClick(category, event)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex w-[100px] flex-none shrink-0 flex-col items-center snap-start text-center transition sm:w-[110px] lg:w-[116px] ${isActive ? 'text-primary' : 'text-text/75'}`}
                  >
                    <span
                      className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full border transition sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${isActive ? 'border-[#8b5e3c] bg-[#faf1e5] shadow-[0_16px_36px_rgba(139,94,60,0.18)] ring-2 ring-[#8b5e3c]/15' : 'border-[#ebdccb] bg-white shadow-[0_12px_30px_rgba(86,58,36,0.05)] group-hover:border-[#b88967]'}`}
                    >
                      <img
                        src={image}
                        alt={category.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </span>
                    <span className="mt-3 block w-full whitespace-normal text-center text-[10px] font-medium uppercase leading-snug tracking-[0.22em] sm:text-[11px] lg:text-[12px]">
                      {category.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                className={`hidden h-7 w-7 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text lg:inline-flex ${canScrollLeft ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ece1d4]">
                <div
                  className="h-full rounded-full bg-[#a57a54] transition-[width] duration-300"
                  style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                className={`hidden h-7 w-7 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text lg:inline-flex ${canScrollRight ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll categories right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-2 sm:pt-3 lg:pt-4">
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
                Showing {visibleProducts.length} products
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
            className="rounded-[1.75rem] border border-[#eadfce]/70 bg-white/90 px-6 py-8 text-sm text-text/60 shadow-[0_16px_40px_rgba(86,58,36,0.06)]"
          >
            Loading products...
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
                  <ProductCard key={product.id} product={product} compact index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text/60">
                Showing {visibleProducts.length} of {catalogCount} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => {
                    const next = Math.max(1, page - 1);
                    setPage(next);
                    syncParams({ page: next });
                  }}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const next = Math.min(totalPages, page + 1);
                    setPage(next);
                    syncParams({ page: next });
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
