import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LayoutGrid, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wishlist, cartCount, auth } = useApp();

  const prevWishlistRef = useRef(wishlist.length);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);

  useEffect(() => {
    if (wishlist.length > prevWishlistRef.current) {
      setWishlistAnimating(true);
      const timer = window.setTimeout(() => setWishlistAnimating(false), 400);
      return () => window.clearTimeout(timer);
    }

    prevWishlistRef.current = wishlist.length;
    return undefined;
  }, [wishlist.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const actionBase = 'inline-flex h-11 items-center justify-center rounded-[1rem] border text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';
  const desktopTextAction = `${actionBase} gap-2 px-4 lg:px-5`;
  const iconAction = `${actionBase} w-11`;
  const accountTarget = auth?.user ? '/dashboard' : '/login';

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-[#eadfce]/75 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? 'shadow-[0_12px_36px_rgba(79,56,36,0.10)]' : 'shadow-none'}`}>
      <div className="section-shell relative flex items-center justify-between py-4 sm:py-5 lg:py-5">
        <div className="flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            whileTap={{ scale: 0.96 }}
            className={`${iconAction} border-[#e1d3c4] bg-white text-text/80 md:hidden`}
            onClick={() => setOpen((value) => !value)}
            aria-label="Open menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
          <Link to="/" aria-label="Junaid Furniture home" className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center">
              <Logo />
            </motion.div>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text/55">Premium Furniture</span>
              <span className="font-display text-lg font-semibold text-text">Junaid Furniture</span>
            </div>
          </Link>
        </div>

        <motion.nav
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden items-center gap-2 xl:flex"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) => (
                  `group relative rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition ${isActive ? 'bg-[#f2e8dc] text-primary' : 'text-text/65 hover:bg-white hover:text-text'}`
                )}
              >
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/wishlist"
              className={`${desktopTextAction} relative hidden border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text md:inline-flex`}
            >
              <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'fill-current text-primary' : ''}`} />
              <span>Wishlist</span>
              {wishlist.length > 0 ? (
                <motion.span
                  animate={wishlistAnimating ? { scale: [1, 1.35, 1] } : {}}
                  transition={{ duration: 0.4 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                >
                  {wishlist.length}
                </motion.span>
              ) : null}
            </Link>
            <Link
              to="/wishlist"
              className={`${iconAction} relative border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text md:hidden`}
              aria-label="Wishlist"
            >
              <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'fill-current text-primary' : ''}`} />
              {wishlist.length > 0 ? (
                <motion.span
                  animate={wishlistAnimating ? { scale: [1, 1.35, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white"
                >
                  {wishlist.length}
                </motion.span>
              ) : null}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.16 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/shop"
              className={`${desktopTextAction} border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text`}
              aria-label="Shop furniture"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden md:inline">Shop</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.18 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/cart"
              className={`${iconAction} relative border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text md:hidden`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <Link
              to="/cart"
              className={`${desktopTextAction} relative hidden border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text md:inline-flex`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={accountTarget}
              className={`${iconAction} border-[#e1d3c4] bg-white text-text/75 hover:border-primary/40 hover:text-text`}
              aria-label={auth?.user ? 'Open dashboard' : 'Login'}
            >
              <User className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-black/5 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="section-shell flex flex-col gap-4 py-5">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-[#eadfce] bg-[#fcfaf7] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-text/70 transition hover:border-primary hover:text-primary"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link to="/wishlist" onClick={() => setOpen(false)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text/70">
                  Wishlist
                </Link>
                <Link to={accountTarget} onClick={() => setOpen(false)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text/70">
                  Account
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
