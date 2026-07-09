import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import PageSection from '../components/PageSection';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';
import QuantityStepper from '../components/QuantityStepper';
import { useApp } from '../context/AppContext';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const {
    product,
    fetchProductBySlug,
    addToCart,
    toggleWishlist,
    isWishlisted,
    catalogDetailLoading,
    catalogError,
  } = useApp();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (slug) fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  if (catalogDetailLoading && !product) {
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

  return (
    <PageSection className="py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={image}
            alt={product.name}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="h-[520px] w-full rounded-[2rem] object-cover shadow-soft"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/product-placeholder.svg';
            }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold uppercase tracking-[0.35em] text-primary"
          >
            {product.categoryName || product.category?.name || 'Furniture'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-display text-5xl font-semibold text-text"
          >
            {product.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex items-center gap-3"
          >
            <RatingStars value={product.rating} />
            <span className="text-sm text-text/50">{product.reviews} reviews</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 max-w-2xl text-base leading-8 text-text/70"
          >
            {product.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 rounded-3xl bg-white p-6 shadow-card"
          >
            <p className="text-sm font-medium text-text/60">Price</p>
            <p className="mt-1 text-4xl font-bold text-text">PKR {Number(product.price || 0).toLocaleString()}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={() => addToCart(product, qty)}>Add to Cart</Button>
              </motion.div>
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
            transition={{ delay: 0.7 }}
            className="mt-8 rounded-3xl border border-black/5 bg-[#eadfd2] p-6"
          >
            <p className="text-sm font-semibold text-text">Why it stands out</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-text/70">
              <li>- Premium silhouette with a clean, editorial profile.</li>
              <li>- Responsive, modern shopping flow across all devices.</li>
              <li>- Designed for the polished brand feel of luxury furniture stores.</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex gap-3"
          >
            <Button to="/shop" variant="ghost">Continue Shopping</Button>
            <Button to="/checkout" variant="primary">Checkout</Button>
          </motion.div>
        </motion.div>
      </div>
    </PageSection>
  );
}
