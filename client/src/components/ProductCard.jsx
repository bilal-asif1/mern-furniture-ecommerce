import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import RatingStars from './RatingStars';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, compact = false, index = 0 }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const wishlisted = wishlist.some((item) => item.id === product.id);
  const image = product.thumbnailImage || product.image || product.images?.[0] || '/product-placeholder.svg';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-3xl bg-white shadow-card"
    >
      <Link to={`/product/${product.slug}`} className="block overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={image}
              alt={product.name}
              className={`w-full object-cover ${compact ? 'h-56' : 'h-72'}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/product-placeholder.svg';
              }}
            />
          </motion.div>
        </Link>
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary sm:text-xs sm:tracking-[0.2em]"
            >
              {product.badge}
            </motion.p>
            <Link to={`/product/${product.slug}`}>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="mt-1.5 truncate text-base font-semibold text-text sm:mt-2 sm:text-lg"
              >
                {product.name}
              </motion.h3>
            </Link>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleWishlist(product)}
            className={`inline-flex h-9 min-w-14 shrink-0 items-center justify-center rounded-full border px-2.5 text-[10px] font-semibold transition sm:h-10 sm:min-w-16 sm:px-3 sm:text-xs ${wishlisted ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white text-text/70 hover:border-primary'}`}
            aria-label="Toggle wishlist"
          >
            Save
          </motion.button>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="line-clamp-2 text-xs leading-5 text-text/65 sm:text-sm sm:leading-6"
        >
          {product.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.6 }}
          className="flex items-center justify-between gap-2"
        >
          <div className="min-w-0">
            <RatingStars value={product.rating} />
            <p className="mt-0.5 text-[10px] text-text/50 sm:mt-1 sm:text-xs">{product.reviews} reviews</p>
          </div>
          <p className="shrink-0 text-base font-bold text-text sm:text-xl">PKR {Number(product.price || 0).toLocaleString()}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.7 }}
          className="flex gap-2 sm:gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button className="w-full text-xs sm:text-sm" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </motion.div>
          <Link to={`/product/${product.slug}`} className="inline-flex shrink-0">
            <Button variant="ghost" className="text-xs sm:text-sm">View</Button>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
