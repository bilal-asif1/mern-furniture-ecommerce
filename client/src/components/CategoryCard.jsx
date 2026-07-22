import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/shop?categoryId=${encodeURIComponent(category.id)}`}
        className="group block rounded-3xl border border-white/70 bg-white p-4 shadow-card sm:p-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary sm:text-xs sm:tracking-[0.2em]"
        >
          Category
        </motion.p>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="mt-2 text-xl font-display font-semibold text-text sm:mt-3 sm:text-2xl"
        >
          {category.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="mt-2 line-clamp-2 text-xs leading-5 text-text/65 sm:mt-3 sm:text-sm sm:leading-6"
        >
          {category.description}
        </motion.p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="mt-4 inline-flex text-xs font-semibold text-primary sm:mt-6 sm:text-sm"
        >
          <motion.span
            className="group-hover:translate-x-1 transition-transform"
          >
            Browse collection
          </motion.span>
        </motion.span>
      </Link>
    </motion.div>
  );
}
