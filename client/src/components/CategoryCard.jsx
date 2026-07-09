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
        className="group block rounded-3xl border border-white/70 bg-white p-6 shadow-card"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="text-xs font-bold uppercase tracking-[0.2em] text-primary"
        >
          Category
        </motion.p>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="mt-3 text-2xl font-display font-semibold text-text"
        >
          {category.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="mt-3 text-sm leading-6 text-text/65"
        >
          {category.description}
        </motion.p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="mt-6 inline-flex text-sm font-semibold text-primary"
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
