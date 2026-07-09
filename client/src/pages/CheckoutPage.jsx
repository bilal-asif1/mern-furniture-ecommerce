import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Field, SelectField, TextArea, TextInput } from '../components/Field';
import { useApp } from '../context/AppContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, createOrder, clearCart, orderSaving, orderError, orderSuccess } = useApp();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'Card',
    notes: '',
  });

  const shippingPrice = cart.length ? 45 : 0;
  const taxPrice = Number((cartSubtotal * 0.08).toFixed(2));
  const totalPrice = Number((cartSubtotal + shippingPrice + taxPrice).toFixed(2));

  const placeOrder = async (event) => {
    event.preventDefault();

    const orderItems = cart.map((item) => ({
      product: item.id,
      name: item.name,
      qty: item.quantity,
      price: item.price,
      image: item.image || item.images?.[0] || '',
    }));

    const payload = {
      orderItems,
      shippingAddress: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes,
      },
      paymentMethod: form.paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    const result = await createOrder(payload);
    if (result.meta.requestStatus === 'fulfilled') {
      clearCart();
      navigate('/track-order', { replace: true, state: { orderId: result.payload.id || result.payload._id } });
    }
  };

  return (
    <PageSection className="py-10">
      <SectionTitle eyebrow="Checkout" title="Secure Checkout" description="Collect shipping information and place an order with confidence." />
      <AnimatePresence>
        {orderError ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {orderError}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {orderSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700"
          >
            {orderSuccess}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={placeOrder}
          className="space-y-5 rounded-[2rem] bg-white p-6 shadow-card"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-5 md:grid-cols-2"
          >
            <Field label="Full Name"><TextInput value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Junaid Khan" /></Field>
            <Field label="City"><TextInput value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Karachi" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Field label="Email"><TextInput value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="you@example.com" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Field label="Phone"><TextInput value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+92 300 1234567" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Field label="Address"><TextInput value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} placeholder="House no, street, area" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid gap-5 md:grid-cols-2"
          >
            <Field label="Payment Method">
              <SelectField value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}>
                <option>Card</option>
                <option>Cash on Delivery</option>
                <option>Bank Transfer</option>
              </SelectField>
            </Field>
            <Field label="Shipping Fee">
              <TextInput value={`$${shippingPrice.toFixed(2)}`} disabled />
            </Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Field label="Order Notes"><TextArea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Any delivery instructions or notes..." /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" disabled={orderSaving || !cart.length}>{orderSaving ? 'Placing Order...' : 'Place Order'}</Button>
          </motion.div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-[2rem] bg-[#eadfd2] p-6"
        >
          <h3 className="font-display text-3xl font-semibold text-text">Your Order</h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between text-sm text-text/70"
                >
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="border-t border-black/10 pt-4 flex items-center justify-between font-semibold text-text"
            >
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-sm leading-7 text-text/70"
          >
            Secure checkout flow prepared for JWT-authenticated orders, inventory validation, and future payment integration.
          </motion.p>
        </motion.aside>
      </div>
    </PageSection>
  );
}
