import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Field, TextInput } from '../components/Field';

export default function RegisterPage() {
  const { registerUser, authLoading, authError, authSuccess } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = async () => {
    const result = await registerUser(form);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <PageSection className="py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-card"
      >
        <SectionTitle eyebrow="Register" title="Create your account" description="Join the premium shopping experience in just a few steps." align="center" />
        <div className="mt-8 space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Field label="Full Name"><TextInput value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Field label="Email"><TextInput value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" placeholder="you@example.com" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Field label="Password"><TextInput value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" placeholder="Create a password" /></Field>
          </motion.div>
        </div>
        <AnimatePresence>
          {authError ? (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {authError}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {authSuccess ? (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {authSuccess}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="mt-6 w-full" onClick={handleRegister} disabled={authLoading}>{authLoading ? 'Creating...' : 'Create Account'}</Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-sm text-text/60"
        >
          Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link>
        </motion.p>
      </motion.div>
    </PageSection>
  );
}
