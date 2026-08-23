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
        className="group block overflow-hidden rounded-[2rem] border border-[#eadfce]/80 bg-white/90 shadow-[0_16px_45px_rgba(86,58,36,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(86,58,36,0.13)]"
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-[4/4.4] overflow-hidden bg-[linear-gradient(180deg,#f8f2ea,#eadfce)]"
          >
            <img
              src={category.image || PLACEHOLDER_IMAGE}
              alt={category.name}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,31,27,0.04),rgba(36,31,27,0.34))]" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="page-ribbon mb-2 w-fit border-white/20 bg-white/18 text-white shadow-none backdrop-blur-sm">
                Collection
              </p>
              <h3 className="font-display text-3xl font-semibold text-white sm:text-[2.2rem]">{category.name}</h3>
              <p className="mt-2 max-w-md text-xs leading-6 text-white/80 sm:text-sm">
                {category.description}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary/75">Browse</p>
            <p className="mt-1 text-sm leading-6 text-text/65">{category.backendCategory || 'Furniture'}</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfce] bg-white text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-white">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
