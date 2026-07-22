import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

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
          <Link to="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo />
            </motion.div>
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

        <div className="flex items-center gap-1 sm:gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/wishlist" className="relative inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-black/10 bg-white px-2 text-xs font-semibold transition sm:h-11 sm:min-w-16 sm:px-4 sm:text-sm" aria-label="Wishlist" style={{ color: wishlist.length > 0 ? '#8b5e3c' : '', borderColor: wishlist.length > 0 ? '#8b5e3c' : '' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={wishlist.length > 0 ? '#8b5e3c' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span className="hidden sm:inline" style={{ color: wishlist.length > 0 ? '#8b5e3c' : '' }}>Wishlist ({wishlist.length})</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white sm:-top-0.5 sm:-right-0.5 sm:h-5 sm:w-5 sm:text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/cart" className="relative inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-2 text-xs font-semibold transition shadow-soft sm:h-11 sm:min-w-16 sm:px-4 sm:text-sm" aria-label="Cart" style={{ backgroundColor: cartCount > 0 ? '#8b5e3c' : 'white', borderColor: cartCount > 0 ? '#8b5e3c' : 'rgba(0,0,0,0.1)', color: cartCount > 0 ? 'white' : 'rgba(44,44,44,0.7)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span className="hidden sm:inline">Cart ({cartCount})</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary sm:-top-0.5 sm:-right-0.5 sm:h-5 sm:w-5 sm:text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={auth?.user ? '/dashboard' : '/login'} className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text sm:inline-flex hover:border-primary hover:text-primary">
              {auth?.user ? auth.user.name.split(' ')[0] : 'Sign in'}
            </Link>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-black/10 bg-white px-2 text-xs font-semibold text-text lg:hidden sm:h-11 sm:min-w-20 sm:px-3 sm:text-sm"
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
