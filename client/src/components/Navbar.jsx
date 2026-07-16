import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist, auth } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="section-shell flex items-center justify-between py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft"
            >
              JF
            </motion.div>
            <div>
              <p className="font-display text-lg sm:text-2xl font-semibold leading-none text-text">Junaid Furniture</p>
              <p className="hidden text-[10px] sm:text-xs uppercase tracking-[0.3em] text-text/50 sm:block">Premium Living</p>
            </div>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-text/70 hover:text-text'}`
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Link to="/wishlist" className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text/70 transition hover:border-primary hover:text-primary sm:inline-flex">
              Wishlist ({wishlist.length})
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft">
              Cart ({cartCount})
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Link to={auth?.user ? '/dashboard' : '/login'} className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text sm:inline-flex">
              {auth?.user ? auth.user.name.split(' ')[0] : 'Sign in'}
            </Link>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-11 min-w-20 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-sm font-semibold text-text lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            Menu
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-black/5 bg-white lg:hidden"
          >
            <div className="section-shell flex flex-col gap-4 py-5">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <NavLink to={item.to} onClick={() => setOpen(false)} className="text-sm font-semibold text-text/70">
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <NavLink to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold text-text/70">
                  Dashboard
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
