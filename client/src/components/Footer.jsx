import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const groups = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'FAQ', to: '/faq' },
      ],
    },
    {
      title: 'Shop',
      links: [
        { label: 'Living Room', to: '/shop?category=Living%20Room' },
        { label: 'Bedroom', to: '/shop?category=Bedroom' },
        { label: 'Dining', to: '/shop?category=Dining' },
        { label: 'Office', to: '/shop?category=Office' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Order Tracking', to: '/track-order' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Cart', to: '/cart' },
      ],
    },
  ];

  return (
    <footer className="mt-10 border-t border-black/5 bg-[#efe7df]">
      <div className="section-shell grid gap-8 p-6 sm:gap-10 sm:p-8 md:grid-cols-2 md:p-10 xl:grid-cols-4 xl:p-12">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-xs leading-6 text-text/70 sm:mt-4 sm:text-sm sm:leading-7">
            Premium furniture crafted for elegant interiors, modern homes, and a polished shopping experience.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.28em]">{group.title}</p>
            <div className="mt-3 flex flex-col gap-2.5 text-xs text-text/70 sm:mt-4 sm:gap-3 sm:text-sm">
              {group.links.map((link) => (
                <Link key={link.label} to={link.to} className="hover:text-text transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-black/5">
        <div className="section-shell flex flex-col gap-3 p-6 text-xs text-text/60 sm:p-8 sm:text-sm md:flex-row md:items-center md:justify-between md:p-10 xl:p-12">
          <p>(c) 2026 Junaid Furniture. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/junaid_furnitures"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text"
            >
              Instagram
            </a>
            <span>|</span>
            <a
              href="https://www.facebook.com/junaidfurniturefsd?mibextid=wwXIfr&mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text"
            >
              Facebook
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
