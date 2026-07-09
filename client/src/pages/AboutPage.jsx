import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Us"
        title="Crafting elevated interiors with a refined sense of comfort."
        description="Junaid Furniture brings together design-led selection, premium materials, and a modern shopping experience built for discerning customers."
        image="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
      />
      <PageSection>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="prose-tight rounded-[2rem] bg-white p-8 shadow-card">
            <SectionTitle eyebrow="Our Story" title="Built for premium homes and effortless shopping." />
            <p className="mt-5">We designed this furniture store experience to feel calm, editorial, and trustworthy. The brand language combines warm wood-inspired tones with a clean, modern layout that works beautifully on every device.</p>
            <p className="mt-4">The backend architecture is structured around reusable REST resources, authenticated user flows, and scalable MongoDB collections for products, orders, and customer data.</p>
          </div>
          <div className="grid gap-6">
            {[
              ['Modern Design', 'A premium visual language with elegant spacing and typography.'],
              ['Operational Ready', 'Admin tools for products, orders, customers, and inventory.'],
              ['Secure by Design', 'JWT authentication, protected routes, and role-aware pages.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl bg-[#eadfd2] p-6">
                <h3 className="text-xl font-semibold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}
