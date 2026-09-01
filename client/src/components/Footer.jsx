import { Heart, Leaf, Gem, Sparkles, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contactLinks } from '../data/siteContent';

const logo = new URL('../assets/images/shop/logo.PNG', import.meta.url).href;

const trustBadges = [
  { label: 'Customer Satisfaction', Icon: Heart },
  { label: 'Sustainability', Icon: Leaf },
  { label: 'Peace of Mind', Icon: ShieldCheck },
  { label: 'Value for Money', Icon: Gem },
  { label: 'Performance & Quality', Icon: Sparkles },
];

const shopCategoryLabels = ['Dressing', 'Bed Set', 'Dining Set', 'Coffee & Table', 'Sofa & Couches'];
const collectionCategoryLabels = ['Chairs Bed Room', 'L-Shape Sofa', 'Office Chairs', 'Computer Table', 'Wardrobe'];

function SocialIconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9b07c]/30 bg-white/5 text-[#f5eadb] transition duration-300 hover:border-[#d9b07c]/70 hover:bg-white/10 hover:text-[#f6dfb8]"
    >
      {children}
    </a>
  );
}

function SocialGlyphInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.8" cy="7.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SocialGlyphFacebook() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 8.5h2.5V5.8H14c-2.2 0-3.5 1.4-3.5 3.6V11H8v2.9h2.5V19h3v-5.1h2.8L16.7 11h-3.2V9.2c0-.5.4-.7.5-.7Z" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="currentColor"
    >
      <path d="M12.04 2.001c-5.514 0-10 4.462-10 9.955 0 1.758.466 3.48 1.35 4.992L2 22l5.189-1.353a10.02 10.02 0 0 0 4.852 1.247h.004c5.514 0 10-4.462 10-9.955 0-2.66-1.046-5.16-2.946-7.04A9.97 9.97 0 0 0 12.04 2Zm5.847 14.108c-.245.686-1.45 1.317-2.013 1.394-.518.071-1.183.1-1.912-.13-.442-.14-1.01-.325-1.744-.641-3.068-1.324-5.071-4.417-5.226-4.625-.155-.208-1.245-1.66-1.245-3.17s.79-2.251 1.071-2.557c.245-.267.654-.388 1.041-.388.127 0 .242.006.345.01.31.013.467.032.673.526.245.59.839 2.037.912 2.186.073.15.122.323.024.53-.097.206-.146.324-.292.498-.146.174-.307.388-.439.522-.146.15-.298.313-.128.605.17.292.755 1.25 1.62 2.023 1.112.995 2.048 1.304 2.34 1.46.292.156.463.13.636-.078.174-.208.752-.874.953-1.174.2-.3.403-.25.678-.15.275.1 1.744.822 2.045.97.302.15.502.223.575.349.074.125.074.724-.172 1.41Z" />
    </svg>
  );
}

function TrustBadge({ label, Icon }) {
  return (
    <div className="flex min-h-[7.75rem] flex-col items-center justify-center gap-3 px-4 py-5 text-center sm:px-5 lg:min-h-[8.75rem] lg:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d9b07c]/50 bg-[#120f0c]/60 text-[#e7c28a] shadow-[0_12px_24px_rgba(0,0,0,0.28)]">
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.85} />
      </div>
      <p className="max-w-[8.75rem] text-[10px] font-semibold uppercase leading-4 tracking-[0.24em] text-[#f4e7d6] sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative mt-10 overflow-hidden text-[#f6eadb]"
      style={{
        background: 'linear-gradient(180deg, #18110d 0%, #0f0c0a 46%, #070605 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(201, 163, 108, 0.16), transparent 58%)',
        }}
      />

      <div className="relative section-shell py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:overflow-hidden lg:rounded-[1.75rem] lg:border lg:border-white/10 lg:bg-white/[0.02] lg:divide-x lg:divide-white/10">
            {trustBadges.map(({ label, Icon }) => (
              <div key={label}>
                <TrustBadge label={label} Icon={Icon} />
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-10 flex flex-col items-center text-center">
            <img
              src={logo}
              alt="Junaid Furniture Logo"
              className="h-12 w-auto object-contain sm:h-14"
            />
            <p className="font-display mt-5 max-w-2xl text-lg italic leading-relaxed text-[#f4e6d6] sm:text-xl lg:text-2xl">
              Timeless pieces, crafted for the way you live.
            </p>
            <div className="mt-6 h-px w-32 bg-gradient-to-r from-transparent via-[#d9b07c] to-transparent" />
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-10">
            <div className="max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d9b07c]">
                About
              </p>
              <p className="mt-4 text-sm leading-7 text-[#f5eadb]/78">
               Thoughtfully designed furniture for the modern home. Every piece is made to order — message us on WhatsApp for pricing and customization.
              </p>
             
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d9b07c]">
                Shop
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[#f5eadb]/80">
                {shopCategoryLabels.map((label) => (
                  <Link
                    key={label}
                    to={`/shop?category=${encodeURIComponent(label)}`}
                    className="w-fit transition duration-300 hover:text-[#f6dfb8]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d9b07c]">
                Collections
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[#f5eadb]/80">
                {collectionCategoryLabels.map((label) => (
                  <Link
                    key={label}
                    to={`/shop?category=${encodeURIComponent(label)}`}
                    className="w-fit transition duration-300 hover:text-[#f6dfb8]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d9b07c]">
                Contact
              </p>
              <p className="mt-4 text-sm leading-7 text-[#f5eadb]/78">
                All inquiries — pricing, customization, and delivery — are handled directly over WhatsApp for the fastest response.
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#f5eadb]/84">
                <a
                  href={contactLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-fit self-start items-center justify-center gap-2 rounded-full bg-[#25d366] px-3.5 sm:px-5 font-bold whitespace-nowrap text-white shadow-[0_10px_24px_rgba(37,211,102,0.22)] transition duration-300 hover:bg-[#20c55f] hover:shadow-[0_12px_28px_rgba(37,211,102,0.3)]"
                >
                  <WhatsAppGlyph />
                  WhatsApp to Custom Order
                </a>
                <a
                  href="tel:+923063400146"
                  className="inline-flex items-center gap-2 transition duration-300 hover:text-[#f6dfb8]"
                >
                  <Phone className="h-4 w-4 text-[#d9b07c]" />
                  +92 306 3400146
                </a>
                <a
                  href={contactLinks.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 transition duration-300 hover:text-[#f6dfb8]"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d9b07c]" />
                  <span>14 Narwala Rd, Jinnah Colony, Faisalabad</span>
                </a>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <SocialIconLink href={contactLinks.instagram} label="Instagram">
                  <SocialGlyphInstagram />
                </SocialIconLink>
                <SocialIconLink href={contactLinks.facebook} label="Facebook">
                  <SocialGlyphFacebook />
                </SocialIconLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell py-4">
          <div className="flex flex-col gap-2 text-xs text-[#f5eadb]/60 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Junaid Furniture. All rights reserved.</p>
            <p className="text-[#d9b07c]">Crafted for Modern Living</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
