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
import { CheckCircle2, MessageCircle, Star, Sparkles } from 'lucide-react';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const {
    product,
    fetchProductBySlug,
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

  const image = product.thumbnailImage || product.image || product.images?.[0] || '/product-placeholder.svg';
  const productLink = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `/product/${product.slug}`;
  const whatsappLink = buildProductWhatsAppLink(product.name, productLink);
  const trustIndicators = [
    'Handcrafted Quality',
    'White-Glove Delivery',
    'Warranty Included',
  ];

  // Get badges from product data
  const badges = [];
  if (product.featured) badges.push({ label: 'Featured', icon: Star, color: 'bg-black/50' });
  if (product.bestSeller) badges.push({ label: 'Best Seller', icon: Sparkles, color: 'bg-black/50' });
  if (product.newArrival) badges.push({ label: 'New Arrival', icon: null, color: 'bg-black/50' });

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
            className="mt-7 rounded-[2rem] bg-transparent p-0 text-text shadow-none"
          >
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-white transition hover:bg-[#20c55f]"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Inquire for Price &amp; Details</span>
            </motion.a>

            <p className="mt-4 text-center text-sm leading-6 text-text/70 sm:text-left">
              Chat with us on WhatsApp for pricing, customization and delivery details.
            </p>

            <div className="mt-5 flex flex-row flex-nowrap gap-2 sm:gap-4">
              {trustIndicators.map((label) => (
                <div
                  key={label}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2 px-1 py-1 text-center"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-text/25 text-text/80 sm:h-11 sm:w-11">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" strokeWidth={1.8} />
                  </span>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-text/80 sm:text-[10px] sm:tracking-[0.24em]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-5 flex"
          >
            <Button to="/shop" variant="ghost" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PageSection>
    </>
  );
}
