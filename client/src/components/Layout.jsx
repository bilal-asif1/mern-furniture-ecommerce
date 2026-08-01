import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-[88px] sm:pt-[98px] lg:pt-[104px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
