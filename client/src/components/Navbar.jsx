import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, MessageCircle, UserRound, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { buildWhatsAppLink } from '../utils/whatsapp';

const navItems = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wishlist, auth } = useApp();

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

  const signInLabel = auth?.user ? auth.user.name.split(' ')[0] : 'Sign In';
  const whatsappLink = buildWhatsAppLink('Hi, I have a general inquiry about your furniture collection.');
  const actionBase = 'inline-flex h-11 items-center justify-center rounded-full border text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';
  const desktopTextAction = `${actionBase} gap-2 px-4 lg:px-5`;
  const iconAction = `${actionBase} w-11`;

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-[#eadfce]/80 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? 'shadow-[0_12px_36px_rgba(79,56,36,0.10)]' : 'shadow-none'}`}>
      <div className="section-shell relative flex items-center justify-between py-4 sm:py-5 lg:py-5">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-text/70 transition hover:border-primary hover:text-text md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto sm:h-10 lg:h-11" />
          </Link>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="hidden lg:flex items-center gap-8"
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
                  `group relative text-[12px] font-medium uppercase tracking-[0.26em] transition ${isActive ? 'text-primary' : 'text-text/70 hover:text-text'}`
                )}
              >
                <span>{item.label}</span>
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/wishlist"
              className={`${desktopTextAction} relative border-black/10 bg-white text-text/75 hover:border-primary/40 hover:text-text hidden md:inline-flex`}
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
              className={`${iconAction} relative border-black/10 bg-white text-text/75 hover:border-primary/40 hover:text-text md:hidden`}
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
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className={`${desktopTextAction} border-black/10 bg-white text-text/75 hover:border-primary/40 hover:text-text`}
              aria-label="WhatsApp Us"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp Us</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block"
          >
            <Link
              to={auth?.user ? '/dashboard' : '/login'}
              className={`${desktopTextAction} border-black/10 bg-white text-text/75 hover:border-primary/40 hover:text-primary`}
            >
              <UserRound className="h-4 w-4" />
              <span>{signInLabel}</span>
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
                    className="text-sm font-medium uppercase tracking-[0.22em] text-text/70 transition hover:text-primary"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-text/75"
                >
                  Wishlist
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-text/75"
                >
                  WhatsApp
                </a>
              </div>

              <Link
                to={auth?.user ? '/dashboard' : '/login'}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
              >
                {signInLabel}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
