import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import { Star, Sparkles } from 'lucide-react';

function ProductCard({ product, compact = false, index = 0 }) {
  const image = product.thumbnailImage || product.image || product.images?.[0] || '/product-placeholder.svg';
  const productLink = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `/product/${product.slug}`;
  const whatsappLink = buildProductWhatsAppLink(product.name, productLink);

  // Get badges from product data
  const badges = [];
  if (product.featured) badges.push({ label: 'Featured', icon: Star, color: 'bg-black/50' });
  if (product.bestSeller) badges.push({ label: 'Best Seller', icon: Sparkles, color: 'bg-black/50' });
  if (product.newArrival) badges.push({ label: 'New Arrival', icon: null, color: 'bg-black/50' });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: compact ? -4 : -6 }}
      className={`group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-gray-300 hover:shadow-md ${compact ? 'max-w-none' : ''}`}
    >
      <div className="relative">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-3rem)]">
            {badges.slice(0, 3).map((badge, badgeIndex) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05 + 0.1 + badgeIndex * 0.03, 0.6) }}
                className={`inline-flex items-center gap-1 rounded-full border border-white/30 px-2 py-0.5 ${badge.color} text-[8px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm`}
              >
                {badge.icon && <badge.icon className="h-2.5 w-2.5" />}
                {badge.label}
              </motion.div>
            ))}
          </div>
        )}
        <Link to={`/product/${product.slug}`} className="block overflow-hidden">
          <div className={`overflow-hidden bg-[#fbf7f2] ${compact ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={500}
              className="h-full w-full object-cover object-center"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/product-placeholder.svg';
              }}
            />
          </div>
        </Link>
      </div>

      <div className={`space-y-3 ${compact ? 'p-4 sm:space-y-3 sm:p-5' : 'p-5 sm:space-y-4 sm:p-6'}`}>
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(index * 0.05 + 0.15, 0.7) }}
            className={`font-bold uppercase tracking-[0.15em] text-gray-600 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs sm:tracking-[0.2em]'}`}
          >
            {product.categoryName || product.category?.name || 'Furniture'}
          </motion.p>
          <Link to={`/product/${product.slug}`}>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.05 + 0.2, 0.75) }}
              className={`mt-1.5 truncate font-semibold text-gray-900 ${compact ? 'text-[0.95rem] leading-tight sm:mt-1 sm:text-[1.05rem]' : 'text-base sm:mt-2 sm:text-lg'}`}
            >
              {product.name}
            </motion.h3>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm">
              Rating
            </span>
            <span className={`text-gray-700 ${compact ? 'text-[10px]' : 'text-xs'}`}>{product.rating || '4.5'}/5</span>
          </div>
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(index * 0.05 + 0.25, 0.8) }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:bg-[#20bd5a] hover:shadow-md"
            aria-label="Order via WhatsApp"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </motion.a>
        </div>
        <p className={`text-gray-500 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'}`}>{product.reviews} reviews</p>
        {!compact && product.description ? (
          <p className="line-clamp-2 text-xs leading-5 text-gray-400 sm:text-sm sm:leading-6">
            {product.description}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
