import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Field, TextInput } from '../components/Field';

export default function LoginPage() {
  const { loginUser, authLoading, authError, authSuccess } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const signIn = async () => {
    try {
      setLocalError('');
      const result = await loginUser({ email, password });
      if (result.meta.requestStatus === 'fulfilled') {
        navigate(result.payload.user.role === 'admin' ? '/admin' : from, { replace: true });
      }
    } catch (error) {
      setLocalError(error?.message || 'Unable to sign in');
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
        <SectionTitle eyebrow="Login" title="Welcome back" description="Sign in to access your account or the admin dashboard." align="center" />
        <div className="mt-8 space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Field label="Email"><TextInput value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></Field>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Field label="Password"><TextInput value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" /></Field>
          </motion.div>
        </div>
        <AnimatePresence>
          {localError || authError ? (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {localError || authError}
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
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button onClick={signIn} disabled={authLoading}>{authLoading ? 'Signing In...' : 'Sign In'}</Button>
          </motion.div>
        </div>
      </motion.div>
    </PageSection>
  );
}
