import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-[72px] sm:pt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
