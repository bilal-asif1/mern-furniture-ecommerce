import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { auth, wishlist, cart, orders, fetchMyOrders, ordersLoading } = useApp();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <PageSection className="py-10">
      <SectionTitle eyebrow="Dashboard" title={`Welcome back, ${auth.user?.name?.split(' ')[0] || 'Customer'}`} description="View your account summary, orders, wishlist, and quick actions." />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {[
          ['Cart Items', cart.length],
          ['Wishlist Items', wishlist.length],
          ['Past Orders', orders.length],
          ['Saved Products', wishlist.length],
        ].map(([label, value], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="rounded-3xl bg-white p-6 shadow-card"
          >
            <p className="text-sm text-text/60">{label}</p>
            <p className="mt-3 font-display text-4xl font-semibold text-text">{value}</p>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-[2rem] bg-white p-6 shadow-card"
        >
          <h3 className="font-display text-3xl font-semibold text-text">Recent Orders</h3>
          {ordersLoading ? <div className="mt-6 text-sm text-text/60">Loading orders...</div> : null}
          <div className="mt-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between rounded-2xl bg-[#f6efe8] p-4"
                >
                  <div>
                    <p className="font-semibold text-text">{order.id || order._id}</p>
                    <p className="text-sm text-text/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{order.status}</p>
                    <p className="text-sm text-text/60">${Number(order.totalPrice || 0).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!orders.length && !ordersLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-[#f6efe8] p-4 text-sm text-text/60"
              >
                No orders yet.
              </motion.div>
            ) : null}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-[2rem] bg-[#eadfd2] p-6"
        >
          <h3 className="font-display text-3xl font-semibold text-text">Quick Actions</h3>
          <div className="mt-6 flex flex-col gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button to="/shop" className="w-full">Shop More Furniture</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button to="/wishlist" variant="ghost" className="w-full">Open Wishlist</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button to="/track-order" variant="ghost" className="w-full">Track an Order</Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageSection>
  );
}
