import { motion, AnimatePresence } from 'framer-motion';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import QuantityStepper from '../components/QuantityStepper';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartPage() {
  const { cart, cartSubtotal, removeFromCart, updateCartQty, clearCart, cartLoading, cartError, cartSuccess } = useApp();
  const shipping = cartSubtotal > 0 ? 1000 : 0;
  const total = cartSubtotal + shipping;

  return (
    <PageSection className="py-10">
      <SectionTitle eyebrow="Cart" title="Shopping Cart" description="Review selected products and proceed to a secure checkout flow." />
      {cartError ? <div className="mt-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{cartError}</div> : null}
      {cartSuccess ? <div className="mt-6 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{cartSuccess}</div> : null}
      {cartLoading ? <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">Updating cart...</div> : null}
      {cart.length ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" onClick={clearCart}>Clear Cart</Button>
              </motion.div>
            </div>
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <motion.img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      whileHover={{ scale: 1.05 }}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-text">{item.name}</h3>
                      <p className="text-sm text-text/60">{item.categoryName || item.category || 'Furniture'}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <QuantityStepper value={item.quantity} onChange={(value) => updateCartQty({ id: item.id, quantity: value })} />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-semibold text-[#8a4939]"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[2rem] bg-white p-6 shadow-card"
          >
            <h3 className="font-display text-3xl font-semibold text-text">Order Summary</h3>
            <div className="mt-6 space-y-3 text-sm text-text/70">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between"
              >
                <span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between"
              >
                <span>Shipping</span><span>{formatCurrency(shipping)}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between border-t border-black/5 pt-3 text-base font-semibold text-text"
              >
                <span>Total</span><span>{formatCurrency(total)}</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button to="/checkout" className="mt-6 w-full">Proceed to Checkout</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button to="/shop" variant="ghost" className="mt-3 w-full">Continue Shopping</Button>
            </motion.div>
          </motion.aside>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <EmptyState title="Cart is empty" description="Your selected furniture pieces will appear here." actionLabel="Shop Now" actionTo="/shop" />
        </motion.div>
      )}
    </PageSection>
  );
}
