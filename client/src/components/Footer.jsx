import { Link } from 'react-router-dom';
import Logo from './Logo';
import { contactLinks } from '../data/siteContent';
import { MapPin, MessageCircle, Phone } from 'lucide-react';

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M13.5 8.5V7.2c0-.9.6-1.2 1.3-1.2H16V3h-2.1c-2.6 0-3.8 1.8-3.8 3.9v1.6H8v3h2.1V21h3.4v-9.5h2.4l.4-3h-2.8Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#e7dacb] bg-[linear-gradient(180deg,#f4ede4_0%,#eadfce_100%)]">
      <div className="section-shell grid gap-8 py-10 sm:py-12 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:gap-10 lg:py-14">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-7 text-text/70 sm:text-base">
            A premium furniture destination shaped by warm neutrals, generous spacing, and a calm shopping flow that keeps the catalog and the craftsmanship front and center.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a href={contactLinks.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={contactLinks.maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-text">
              <MapPin className="h-4 w-4" />
              Google Maps
            </a>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/80">Explore</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-text/70">
            <Link to="/" className="transition hover:text-text">Home</Link>
            <Link to="/shop" className="transition hover:text-text">Shop</Link>
            <Link to="/categories" className="transition hover:text-text">Collections</Link>
            <Link to="/about" className="transition hover:text-text">About Us</Link>
            <Link to="/contact" className="transition hover:text-text">Contact</Link>
            <Link to="/faq" className="transition hover:text-text">FAQ</Link>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/80">Contact</p>
          <div className="mt-4 space-y-2.5 text-sm text-text/70">
            <a href="tel:+923063400146" className="flex items-center gap-2 transition hover:text-text">
              <Phone className="h-4 w-4" />
              +92 306 3400146
            </a>
            <a href={contactLinks.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-text">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={contactLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-text">
              <FacebookMark />
              Facebook
            </a>
            <a href={contactLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-text">
              <InstagramMark />
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/50">
        <div className="section-shell flex flex-col gap-2 py-4 text-[11px] text-text/60 md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 Junaid Furniture. All rights reserved.</p>
          <p>Luxury furniture for modern homes.</p>
        </div>
      </div>
    </footer>
  );
}
