import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import { useApp } from '../context/AppContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import { Heart, MessageCircle, Star, Sparkles } from 'lucide-react';

function ProductCard({ product, compact = false, index = 0 }) {
  const { toggleWishlist, wishlist } = useApp();
  const productId = product.id || product._id;
  const wishlisted = wishlist.some((item) => (item.id === productId || item._id === productId));
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: compact ? -6 : -10 }}
      className={`group overflow-hidden rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85 shadow-none transition duration-300 hover:border-[#e1d0bd] hover:shadow-[0_16px_35px_rgba(84,59,39,0.1)] ${compact ? 'max-w-none' : ''}`}
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
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${badge.color} text-[8px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(139,94,60,0.25)]`}
              >
                {badge.icon && <badge.icon className="h-2.5 w-2.5" />}
                {badge.label}
              </motion.div>
            ))}
          </div>
        )}

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: Math.min(index * 0.05 + 0.15, 0.7) }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-[0_10px_24px_rgba(84,59,39,0.1)] transition hover:border-primary ${wishlisted ? 'border-primary bg-primary' : 'border-black/10'}`}
          aria-label="Toggle wishlist"
        >
          <Heart 
            className={`h-4 w-4 ${wishlisted ? 'fill-primary text-primary' : 'text-text'}`}
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </motion.button>
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

      <div className={`space-y-3 ${compact ? 'p-3 sm:space-y-3 sm:p-4' : 'p-4 sm:space-y-4 sm:p-5'}`}>
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(index * 0.05 + 0.15, 0.7) }}
            className={`font-bold uppercase tracking-[0.15em] text-primary ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs sm:tracking-[0.2em]'}`}
          >
            {product.categoryName || product.category?.name || 'Furniture'}
          </motion.p>
          <Link to={`/product/${product.slug}`}>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.05 + 0.2, 0.75) }}
              className={`mt-1.5 truncate font-semibold text-text ${compact ? 'text-[0.95rem] leading-tight sm:mt-1 sm:text-[1.05rem]' : 'text-base sm:mt-2 sm:text-lg'}`}
            >
              {product.name}
            </motion.h3>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <RatingStars value={product.rating} size={compact ? 'text-xs' : 'text-sm'} />
            <p className={`mt-0.5 text-text/50 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:mt-1 sm:text-xs'}`}>{product.reviews} reviews</p>
          </div>
          {!compact && product.description ? (
            <p className="line-clamp-2 text-right text-xs leading-5 text-text/65 sm:text-sm sm:leading-6">
              {product.description}
            </p>
          ) : null}
        </div>

        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: Math.min(index * 0.05 + 0.3, 0.8) }}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#734d31] ${compact ? 'px-3 py-2 text-[11px] sm:text-xs' : 'px-4 py-3 text-xs sm:text-sm'}`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp to Order
        </motion.a>
      </div>
    </motion.article>
  );
}

export default ProductCard;
