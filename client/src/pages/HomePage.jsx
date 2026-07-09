import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Button from '../components/Button';
import { testimonials } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { products, categories } = useApp();
  const featured = products.slice(0, 4);
  const bestSellers = products.filter((product) => ['Best Seller', 'Popular'].includes(product.badge));
  const newArrivals = products.filter((product) => ['New Arrival', 'Trending'].includes(product.badge));

  return (
    <>
      <PageHero
        kicker="Premium Furniture Store"
        title="Timeless furniture, elevated with a modern digital experience."
        description="Discover a premium collection of furniture that balances warm craftsmanship, clean lines, and a refined shopping journey built for today's homes."
        image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Premium Materials', 'Hand-finished details, durable construction, and elevated textures.'],
            ['Fast Delivery', 'Reliable order management, tracking, and smooth checkout flow.'],
            ['Curated Design', 'Collections styled to feel editorial, warm, and brand-led.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl bg-white p-6 shadow-card">
              <h3 className="text-xl font-semibold text-text">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-text/65">{description}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionTitle eyebrow="Featured" title="Featured Products" description="A polished selection of standout pieces for modern interiors." />
          <Link to="/shop" className="hidden text-sm font-semibold text-primary md:inline-flex">View all products</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product, index) => <ProductCard key={product.id} product={product} compact index={index} />)}
        </div>
      </PageSection>

      <PageSection>
        <SectionTitle eyebrow="Collections" title="Categories Showcase" description="Thoughtfully organized categories for faster discovery." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => <CategoryCard key={category.id} category={category} index={index} />)}
        </div>
      </PageSection>

      <PageSection>
        <SectionTitle eyebrow="Popular" title="Best Sellers" description="The pieces our customers return to again and again." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product, index) => <ProductCard key={product.id} product={product} compact index={index} />)}
        </div>
      </PageSection>

      <PageSection>
        <SectionTitle eyebrow="Fresh" title="New Arrivals" description="Newly added pieces with a refined, contemporary mood." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product, index) => <ProductCard key={product.id} product={product} compact index={index} />)}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-[#eadfd2] p-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Why Choose Us</p>
            <h3 className="mt-4 font-display text-4xl font-semibold text-text">A premium shopping journey from first click to final delivery.</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-text/70">We blend elegant visuals, structured navigation, secure checkout, and production-ready architecture to create a brand experience that feels luxurious and trustworthy.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button>Shop Now</Button>
              <Button to="/about" variant="ghost">Learn More</Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              ['100%', 'Responsive Design'],
              ['24/7', 'Customer Support'],
              ['4.9/5', 'Average Review'],
              ['Secure', 'JWT Checkout Flow'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl bg-white p-6 shadow-card">
                <p className="font-display text-4xl font-semibold text-text">{value}</p>
                <p className="mt-2 text-sm font-medium text-text/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <SectionTitle eyebrow="Testimonials" title="What Customers Say" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-sm leading-7 text-text/70">"{item.quote}"</p>
              <footer className="mt-5">
                <p className="font-semibold text-text">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-primary">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="rounded-[2rem] bg-primary px-6 py-10 text-center text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/70">Newsletter</p>
          <h3 className="mt-4 font-display text-4xl font-semibold">Stay updated on launches and exclusive offers.</h3>
          <form className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input className="flex-1 rounded-full border-0 px-5 py-3 text-text outline-none" placeholder="Enter your email address" />
            <Button variant="dark">Subscribe</Button>
          </form>
        </div>
      </PageSection>
    </>
  );
}
