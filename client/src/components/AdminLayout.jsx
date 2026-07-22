import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from './Button';
import Logo from './Logo';

const items = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/brands', label: 'Brands' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/profile', label: 'Profile' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { auth, logout } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] transform border-r border-black/5 bg-[#efe7df] transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <Logo className="h-8 w-auto" />
                <p className="mt-2 text-sm font-semibold text-text">Admin Panel</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{auth?.user?.name || 'Admin'}</p>
              </div>
              <button className="lg:hidden rounded-full bg-white px-3 py-2 text-sm font-semibold text-text shadow-card" onClick={() => setMobileOpen(false)} type="button">
                Close
              </button>
            </div>
            <nav className="px-3 pb-6">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mb-2 block rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary text-white shadow-soft' : 'text-text/70 hover:bg-white/60'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            </nav>
            <div className="mt-auto p-6">
              <Button variant="ghost" className="w-full" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        {mobileOpen ? <button type="button" aria-label="Close sidebar backdrop" className="fixed inset-0 z-30 bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
        <main className="min-h-screen lg:col-start-2">
          <div className="sticky top-0 z-50 flex items-center justify-between border-b border-black/5 bg-white/85 backdrop-blur-md px-4 py-4 lg:hidden">
            <button type="button" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-text" onClick={() => setMobileOpen(true)}>
              Menu
            </button>
            <p className="text-sm font-semibold text-text/60">Admin Dashboard</p>
          </div>
          <div className="pt-[64px] lg:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
