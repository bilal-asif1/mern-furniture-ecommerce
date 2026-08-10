import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = '/category-placeholder.svg';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/shop?category=${encodeURIComponent(category.slug)}`}
        className="group block rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_16px_45px_rgba(86,58,36,0.08)] transition hover:shadow-[0_22px_60px_rgba(86,58,36,0.12)] sm:p-5"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="relative h-28 w-28 overflow-hidden rounded-full border border-[#eadfce] bg-[#f7efe6] shadow-[0_14px_35px_rgba(86,58,36,0.12)] sm:h-32 sm:w-32"
          >
            <img
              src={category.image || PLACEHOLDER_IMAGE}
              alt={category.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </motion.div>
          <h3 className="mt-4 text-lg font-display font-semibold text-text sm:text-2xl">{category.name}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-text/65 sm:text-sm">{category.description}</p>
          <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Browse
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
