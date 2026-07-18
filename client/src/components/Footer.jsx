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
      <div className="section-shell grid gap-10 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-7 text-text/70">
            Premium furniture crafted for elegant interiors, modern homes, and a polished shopping experience.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">{group.title}</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-text/70">
              {group.links.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-black/5">
        <div className="section-shell flex flex-col gap-3 text-sm text-text/60 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 Junaid Furniture. All rights reserved.</p>
          <p>Instagram | Facebook | Pinterest | LinkedIn</p>
        </div>
      </div>
    </footer>
  );
}
