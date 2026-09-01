import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { readListingPosition } from '../utils/listingPosition';
import heroImageMobile from '../assets/images/shop/shop-hero.jpeg';
import heroImageDesktop from '../assets/images/shop/deskshop-hero.jpeg';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { categories, products } = useApp();

  const railRef = useRef(null);
  const categoryRefs = useRef(new Map());
  const featuredRailRef = useRef(null);
  const bestSellersRailRef = useRef(null);
  const restoredPositionKeyRef = useRef('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [featuredCanScrollLeft, setFeaturedCanScrollLeft] = useState(false);
  const [featuredCanScrollRight, setFeaturedCanScrollRight] = useState(false);
  const [bestSellersCanScrollLeft, setBestSellersCanScrollLeft] = useState(false);
  const [bestSellersCanScrollRight, setBestSellersCanScrollRight] = useState(false);
  const dragStateRef = useRef({
    isDown: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    suppressClick: false,
  });

  const categorySlug = searchParams.get('category') || '';
  const activeCategoryQuery = categorySlug;
  const exploreCategoryFilter = categorySlug || 'all';
  const hasRestoreState = Boolean(location.key && readListingPosition(location.key));

  useLayoutEffect(() => {
    if (products.length === 0) return;
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
  }, [location.key, location.pathname, products.length]);

  useEffect(() => {
    if (!categorySlug || hasRestoreState) return undefined;

    const categoryButton = categoryRefs.current.get(categorySlug);
    if (categoryButton) {
      categoryButton.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [categorySlug, hasRestoreState]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    };

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [categories]);

  useEffect(() => {
    const rail = featuredRailRef.current;
    if (!rail) return undefined;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      setFeaturedCanScrollLeft(scrollLeft > 8);
      setFeaturedCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    };

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products, exploreCategoryFilter]);

  useEffect(() => {
    if (hasRestoreState || exploreCategoryFilter === 'all') return undefined;

    const rail = featuredRailRef.current;
    if (rail) {
      rail.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [exploreCategoryFilter, hasRestoreState]);

  useEffect(() => {
    const rail = bestSellersRailRef.current;
    if (!rail) return undefined;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      setBestSellersCanScrollLeft(scrollLeft > 8);
      setBestSellersCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    };

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products]);

  const handlePointerDown = useCallback((event) => {
    const state = dragStateRef.current;
    if (!railRef.current || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('button')) return;

    state.isDown = true;
    state.pointerId = event.pointerId;
    state.startX = event.pageX - railRef.current.scrollLeft;
    state.scrollLeft = railRef.current.scrollLeft;
    state.suppressClick = false;
    railRef.current.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event) => {
    const state = dragStateRef.current;
    if (!state.isDown || !railRef.current) return;

    const x = event.pageX - state.startX;
    const walk = x * 1.5;
    railRef.current.scrollLeft = state.scrollLeft - walk;

    if (Math.abs(x) > 5) {
      state.suppressClick = true;
    }
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

    const scrollAmount = 140;
    const amount = scrollAmount * direction;
    rail.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const scrollFeaturedRail = (direction) => {
    const rail = featuredRailRef.current;
    if (!rail) return;

    const width = window.innerWidth;
    let scrollAmount;
    if (width < 640) {
      scrollAmount = width * 0.85 + 16;
    } else if (width < 1024) {
      scrollAmount = 290;
    } else {
      scrollAmount = 300;
    }
    const amount = scrollAmount * direction;
    rail.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const scrollBestSellersRail = (direction) => {
    const rail = bestSellersRailRef.current;
    if (!rail) return;

    const width = window.innerWidth;
    let scrollAmount;
    if (width < 640) {
      scrollAmount = width * 0.85 + 16;
    } else if (width < 1024) {
      scrollAmount = 290;
    } else {
      scrollAmount = 300;
    }
    const amount = scrollAmount * direction;
    rail.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const clearCategoryFilter = useCallback(() => {
    setSearchParams({}, { replace: true, preventScrollReset: true });
  }, [setSearchParams]);

  const handleCategoryClick = (category) => {
    if (!category) {
      clearCategoryFilter();
      return;
    }

    setSearchParams({ category: category.slug }, { preventScrollReset: true });
  };

  return (
    <>
      <SEO
        title="Junaid Furniture | Quality Furniture in Pakistan"
        description="Discover premium bedroom furniture, bed sets, office chairs, dining furniture, and more at Junaid Furniture. Shop elegant, high-quality furniture pieces for your home in Pakistan."
        canonical="https://junaidfurniture.netlify.app/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Junaid Furniture',
          url: 'https://junaidfurniture.netlify.app/',
          description: 'Quality Furniture in Pakistan - Bedroom furniture, bed sets, office chairs, dining furniture',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://junaidfurniture.netlify.app/?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />
      <section className="home-hero relative isolate w-full overflow-hidden bg-[#1a120d]">
        <div className="absolute inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={heroImageDesktop} />
            <img
              src={heroImageMobile}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(72,46,26,0.35),transparent_34%),linear-gradient(90deg,rgba(18,12,9,0.55)_0%,rgba(18,12,9,0.35)_24%,rgba(18,12,9,0.18)_46%,rgba(18,12,9,0.08)_70%,rgba(18,12,9,0)_100%),linear-gradient(180deg,rgba(18,12,9,0.15)_0%,rgba(18,12,9,0.08)_58%,rgba(18,12,9,0.20)_100%)]" />
        </div>

        <div className="section-shell relative z-10 flex min-h-[70svh] items-end pb-14 pt-24 sm:min-h-[75svh] sm:pb-16 sm:pt-28 lg:h-[80vh] lg:pb-20 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-[42rem] pb-1 text-left hero-copy"
          >
            <p className="hero-eyebrow text-[10px] font-semibold uppercase tracking-[0.46em] text-white sm:text-[11px]" style={{ color: '#FFFFFF' }}>
              JUNAID FURNITURE
            </p>

            <h1 className="hero-title mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em] text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.16)] sm:mt-6 sm:leading-[1.05] sm:tracking-[-0.03em]" style={{ color: '#FFFFFF' }}>
              <span className="hidden sm:block">
                Timeless Furniture for
                <span className="block">Modern Living</span>
              </span>
              <span className="sm:hidden">
                Timeless Furniture for
                <span className="block">Modern Living</span>
              </span>
            </h1>

            <p className="hero-description mt-6 max-w-[31rem] text-sm leading-7 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.14)] sm:mt-7 sm:text-sm sm:leading-7" style={{ color: '#FFFFFF' }}>
              Handcrafted sofas, beds and tables designed to bring
              lasting elegance into every room of your home.
            </p>

            <div className="mt-10 flex max-w-[28rem] flex-row flex-nowrap gap-3 sm:mt-12 sm:gap-4">
              <Link
                to="/shop"
                className="hero-cta-primary inline-flex min-h-12 flex-1 min-w-0 items-center justify-center rounded-none border-0 bg-white px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-text transition duration-300 hover:-translate-y-0.5 hover:bg-[#f5efe8] sm:flex-none sm:min-w-[11.5rem] sm:px-5 sm:text-[11px]"
              >
                Shop Now
              </Link>
              <Link
                to="/shop?category=bed-set"
                className="hero-cta-secondary inline-flex min-h-12 flex-1 min-w-0 items-center justify-center rounded-none border border-white bg-transparent px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:flex-none sm:min-w-[11.5rem] sm:px-5 sm:text-[11px]"
              >
                Explore Beds
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="shop-by-category" className="scroll-mt-[120px] mx-auto w-full max-w-[1400px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 pb-0 mb-0 bg-white">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-display text-[1.25rem] font-light normal-case leading-normal tracking-[0.05em] text-text sm:text-[1.5rem] lg:text-[1.75rem]">
            Shop by Category
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${canScrollLeft ? 'opacity-100' : 'opacity-40'}`}
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${canScrollRight ? 'opacity-100' : 'opacity-40'}`}
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide sm:gap-5 sm:pb-8 lg:gap-6 lg:pb-10"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            ref={(el) => {
              if (el) categoryRefs.current.set('all', el);
            }}
            className={`flex-none w-[100px] sm:w-[116px] lg:w-[130px] rounded-[1.25rem] border transition duration-300 hover:-translate-y-1 hover:shadow-lg ${categorySlug === '' ? 'border-primary bg-[#f7efe7]' : 'border-[#eadfce] bg-[#fcfaf7]'}`}
          >
            <div className="flex aspect-square flex-col items-center justify-center p-3">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe8] text-[#a57a54]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text sm:text-[11px]">All</span>
            </div>
          </button>

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
      </section>

      {/* Explore What Everyone's Loving Section */}
      <section className="section-shell py-8 sm:py-10 lg:py-12" style={{ overflowAnchor: 'none' }}>
        <div className="rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85 px-4 py-6 shadow-[0_12px_30px_rgba(86,58,36,0.05)] sm:px-5 sm:py-8 lg:px-6 lg:py-10">
          <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8 lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start lg:text-left">
              <h2 className="font-display text-[1.25rem] font-light normal-case leading-normal tracking-[0.05em] text-text sm:text-[1.5rem] lg:text-[1.75rem]">
                Explore What Everyone&apos;s Loving
              </h2>
              {activeCategoryQuery ? (
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className="inline-flex items-center gap-1 rounded-full border border-[#eadfce] bg-[#fbf7f2] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-text/70 transition hover:border-[#caa782] hover:text-text sm:text-[11px]"
                >
                  Clear Filter
                </button>
              ) : null}
            </div>
            <Link
              to="/shop"
              className="font-display text-xs font-light normal-case tracking-[0.05em] text-primary/70 hover:text-primary transition flex items-center gap-1"
            >
              Explore More
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="relative">
            <div
              ref={featuredRailRef}
              data-scroll-restore-id="home-featured-rail"
              className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide sm:gap-5 sm:pb-8 lg:gap-6 lg:pb-10"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
              }}
            >
              {products
                .filter((product) => {
                  if (exploreCategoryFilter === 'all') return true;
                  return product.categorySlug === exploreCategoryFilter || product.category?.slug === exploreCategoryFilter;
                })
                .map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-none w-[85vw] sm:w-[280px] md:w-[290px] lg:w-[300px]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <ProductCard product={product} compact index={index} animateOnMount={false} />
                  </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6">
              <button
                type="button"
                onClick={() => scrollFeaturedRail(-1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${featuredCanScrollLeft ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll featured products left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeaturedRail(1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${featuredCanScrollRight ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll featured products right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-shell py-8 sm:py-10 lg:py-12">
        <div className="rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85 px-4 py-6 shadow-[0_12px_30px_rgba(86,58,36,0.05)] sm:px-5 sm:py-8 lg:px-6 lg:py-10">
          <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8 lg:flex-row lg:justify-between lg:text-left">
            <h2 className="font-display text-[1.25rem] font-light normal-case leading-normal tracking-[0.05em] text-text sm:text-[1.5rem] lg:text-[1.75rem]">
              Best Sellers
            </h2>
            <Link
              to="/shop"
              className="font-display text-xs font-light normal-case tracking-[0.05em] text-primary/70 hover:text-primary transition flex items-center gap-1"
            >
              Explore More
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="relative">
            <div
              ref={bestSellersRailRef}
              data-scroll-restore-id="home-best-sellers-rail"
              className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide sm:gap-5 sm:pb-8 lg:gap-6 lg:pb-10"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
              }}
            >
              {products
                .filter((product) => product.bestSeller)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-none w-[85vw] sm:w-[280px] md:w-[290px] lg:w-[300px]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <ProductCard product={product} compact index={index} animateOnMount={false} />
                  </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6">
              <button
                type="button"
                onClick={() => scrollBestSellersRail(-1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${bestSellersCanScrollLeft ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll best sellers left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBestSellersRail(1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#a57a54] transition hover:border-[#caa782] hover:text-text ${bestSellersCanScrollRight ? 'opacity-100' : 'opacity-40'}`}
                aria-label="Scroll best sellers right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
