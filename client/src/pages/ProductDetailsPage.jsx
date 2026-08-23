import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, PackageCheck, ShoppingBag, Star, Sparkles, Truck } from 'lucide-react';
import Button from '../components/Button';
import PageSection from '../components/PageSection';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import { formatCurrency, getEffectivePrice, calculateDiscountPercentage } from '../utils/formatCurrency';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const {
    product,
    fetchProductBySlug,
    toggleWishlist,
    isWishlisted,
    addToCart,
    products,
    catalogDetailLoading,
    catalogError,
  } = useApp();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (slug) fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const isProductMatch = product && product.slug === slug;
  const shouldShowLoading = catalogDetailLoading || !isProductMatch;

  const productImages = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set([
        product.thumbnailImage,
        product.image,
        ...(Array.isArray(product.images) ? product.images : []),
      ].filter(Boolean)),
    );
  }, [product]);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const categoryKey = product.categorySlug || product.categoryName || product.category || '';
    return products
      .filter((item) => item.id !== product.id)
      .filter((item) => {
        const itemCategory = item.categorySlug || item.categoryName || item.category || '';
        return categoryKey && itemCategory === categoryKey;
      })
      .slice(0, 4);
  }, [products, product]);

  if (shouldShowLoading) {
    return (
      <PageSection className="py-16">
        <div className="editorial-frame p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-[#f2e8dc]" />
            <div className="space-y-4">
              <div className="h-3 w-28 animate-pulse rounded-full bg-[#eadfce]" />
              <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-[#eadfce]" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#eadfce]" />
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-[#f2e8dc]" />
            </div>
          </div>
        </div>
      </PageSection>
    );
  }

  if (!product) {
    return (
      <PageSection className="py-16">
        <EmptyState
          title="Product not found"
          description={catalogError || "The item you're looking for may have been removed or renamed."}
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </PageSection>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const image = productImages[activeImage] || product.thumbnailImage || product.image || '/product-placeholder.svg';
  const productLink = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `/product/${product.slug}`;
  const whatsappLink = buildProductWhatsAppLink(product.name, productLink);
  const originalPrice = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const effectivePrice = getEffectivePrice(product);
  const hasDiscount = discountPrice > 0 && discountPrice < originalPrice;
  const discountPercentage = calculateDiscountPercentage(originalPrice, discountPrice);

  const badges = [];
  if (product.featured) badges.push({ label: 'Featured', icon: Star });
  if (product.bestSeller) badges.push({ label: 'Best Seller', icon: Sparkles });
  if (product.newArrival) badges.push({ label: 'New Arrival', icon: PackageCheck });

  const seoTitle = `${product.name} | Junaid Furniture`;
  const seoDescription = product.description
    ? `${product.description.substring(0, 160)}${product.description.length > 160 ? '...' : ''}`
    : `Shop ${product.name} at Junaid Furniture. Quality furniture in Pakistan.`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://junaidfurniture.netlify.app/product/${product.slug}`}
        ogType="product"
        ogImage={image}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image,
          brand: {
            '@type': 'Brand',
            name: 'Junaid Furniture',
          },
          category: product.categoryName || product.category?.name || 'Furniture',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'PKR',
            url: `https://junaidfurniture.netlify.app/product/${product.slug}`,
          },
        }}
      />

      <PageSection className="py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start xl:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <div className="editorial-frame overflow-hidden">
              <div className="relative bg-[linear-gradient(180deg,#fcf8f3,#f1e4d5)]">
                <motion.img
                  src={image}
                  alt={product.name}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-[360px] w-full object-cover object-center sm:h-[470px] lg:h-[620px]"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/product-placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(35,31,27,0.08))]" />
              </div>

              {productImages.length > 1 ? (
                <div className="grid grid-cols-4 gap-2 border-t border-[#eadfce] bg-white p-3 sm:p-4">
                  {productImages.slice(0, 4).map((thumb, index) => (
                    <button
                      key={`${thumb}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-[1rem] border transition ${activeImage === index ? 'border-primary ring-2 ring-primary/15' : 'border-[#eadfce]'}`}
                    >
                      <img src={thumb} alt={`${product.name} view ${index + 1}`} className="h-24 w-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map(({ label, icon: Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5ebdf] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.32em] text-primary sm:text-xs">
              {product.categoryName || product.category?.name || 'Furniture'}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-tight text-text sm:text-5xl lg:text-[4.4rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RatingStars value={product.rating} />
              <span className="text-sm text-text/50">{product.reviews} reviews</span>
              {product.stock > 0 ? (
                <span className="rounded-full bg-[#edf4eb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#41734d]">
                  In stock
                </span>
              ) : null}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-[#eadfce] bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text/50">Price</p>
                  {hasDiscount ? (
                    <div className="mt-1">
                      <p className="text-sm text-text/45 line-through">{formatCurrency(originalPrice)}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-4xl font-semibold text-text">{formatCurrency(effectivePrice)}</p>
                        <span className="rounded-full bg-[#f5ebdf] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                          -{discountPercentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 font-display text-4xl font-semibold text-text">
                      {effectivePrice ? formatCurrency(effectivePrice) : 'Price on request'}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.material ? (
                    <span className="rounded-full border border-[#eadfce] px-3 py-1.5 text-xs text-text/65">{product.material}</span>
                  ) : null}
                  {product.color ? (
                    <span className="rounded-full border border-[#eadfce] px-3 py-1.5 text-xs text-text/65">{product.color}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8">
              {product.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-[#eadfce] bg-[#fcf8f3] p-4">
                <Truck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-text">Fast support</p>
                <p className="mt-1 text-xs leading-6 text-text/60">Use WhatsApp for quick ordering help.</p>
              </div>
              <div className="rounded-[1.3rem] border border-[#eadfce] bg-[#fcf8f3] p-4">
                <PackageCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-text">Product detail</p>
                <p className="mt-1 text-xs leading-6 text-text/60">Live API data keeps the catalog current.</p>
              </div>
              <div className="rounded-[1.3rem] border border-[#eadfce] bg-[#fcf8f3] p-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-text">Premium feel</p>
                <p className="mt-1 text-xs leading-6 text-text/60">A calm presentation with elevated spacing.</p>
              </div>
            </div>

            <div className="mt-7 rounded-[1.6rem] border border-[#eadfce] bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product, 1)}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#68462d]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to cart
                </motion.button>
                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-[#d9cab8] bg-white px-5 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp to order
                </motion.a>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleWishlist(product)}
                  className={`inline-flex items-center justify-center gap-2 rounded-[1.1rem] border px-5 py-3 text-sm font-semibold transition ${wishlisted ? 'border-primary bg-[#f5ebdf] text-primary' : 'border-[#d9cab8] bg-white text-text hover:border-primary hover:text-primary'}`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </motion.button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button to="/shop" variant="ghost">
                Continue shopping
              </Button>
              {product.brand ? (
                <span className="inline-flex items-center rounded-[1.1rem] border border-[#eadfce] bg-white px-4 py-3 text-sm text-text/65">
                  Brand: {product.brand}
                </span>
              ) : null}
            </div>
          </motion.div>
        </div>
      </PageSection>

      {relatedProducts.length > 0 ? (
        <PageSection>
          <SectionTitle
            eyebrow="Related products"
            title="Keep exploring similar pieces."
            description="Products from the same live catalog, presented with the same premium card styling."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {relatedProducts.map((related, index) => (
                <ProductCard key={related.id} product={related} compact index={index} />
              ))}
            </AnimatePresence>
          </div>
        </PageSection>
      ) : null}
    </>
  );
}
