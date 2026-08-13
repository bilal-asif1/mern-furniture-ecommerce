import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import PageSection from '../components/PageSection';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import { MessageCircle, Star, Sparkles } from 'lucide-react';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const {
    product,
    fetchProductBySlug,
    toggleWishlist,
    isWishlisted,
    catalogDetailLoading,
    catalogError,
  } = useApp();

  useEffect(() => {
    if (slug) fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Only render if product exists and matches current slug
  // This prevents showing stale product data during navigation
  const isProductMatch = product && product.slug === slug;
  const shouldShowLoading = catalogDetailLoading || !isProductMatch;

  if (shouldShowLoading) {
    return (
      <PageSection className="py-16">
        <div className="rounded-[2rem] bg-white p-6 shadow-card">Loading product...</div>
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
  const image = product.thumbnailImage || product.image || product.images?.[0] || '/product-placeholder.svg';
  const productLink = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `/product/${product.slug}`;
  const whatsappLink = buildProductWhatsAppLink(product.name, productLink);

  // Get badges from product data
  const badges = [];
  if (product.featured) badges.push({ label: 'Featured', icon: Star, color: 'bg-[#8b5e3c]' });
  if (product.bestSeller) badges.push({ label: 'Best Seller', icon: Sparkles, color: 'bg-[#c58d57]' });
  if (product.newArrival) badges.push({ label: 'New Arrival', icon: null, color: 'bg-[#a67c52]' });

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
          image: image,
          brand: {
            '@type': 'Brand',
            name: 'Junaid Furniture'
          },
          category: product.categoryName || product.category?.name || 'Furniture',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'PKR',
            url: `https://junaidfurniture.netlify.app/product/${product.slug}`
          }
        }}
      />
      <PageSection className="py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start xl:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-28"
        >
          <div className="overflow-hidden rounded-[2rem] border border-[#eadfce]/70 bg-[#fbf7f2] shadow-soft">
            <motion.img
              src={image}
              alt={product.name}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="block h-[320px] w-full object-contain object-center p-4 sm:h-[420px] sm:p-6 lg:h-[520px] lg:p-8"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/product-placeholder.svg';
              }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2"
            >
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${badge.color} text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(139,94,60,0.25)]`}
                >
                  {badge.icon && <badge.icon className="h-3.5 w-3.5" />}
                  {badge.label}
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] font-bold uppercase tracking-[0.32em] text-primary sm:text-xs"
          >
            {product.categoryName || product.category?.name || 'Furniture'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 font-display text-3xl font-semibold leading-tight text-text sm:text-4xl lg:text-5xl"
          >
            {product.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 flex flex-wrap items-center gap-3 sm:mt-4"
          >
            <RatingStars value={product.rating} />
            <span className="text-sm text-text/50">{product.reviews} reviews</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8"
          >
            {product.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-7 rounded-3xl bg-white p-5 shadow-card sm:p-6"
          >
            <p className="text-sm font-medium text-text/60">Order this piece</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#734d31]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp to Order
              </motion.a>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant={wishlisted ? 'secondary' : 'ghost'} onClick={() => toggleWishlist(product)}>
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-5 flex gap-3 sm:mt-6"
          >
            <Button to="/shop" variant="ghost">Continue Shopping</Button>
          </motion.div>
        </motion.div>
      </div>
    </PageSection>
    </>
  );
}
