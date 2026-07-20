import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8L19 3z" />
      <path d="M5 14l.9 2.4L8 17l-2.1.6L5 20l-.9-2.4L2 17l2.1-.6L5 14z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 5-3.1 8.4-7 10-3.9-1.6-7-5-7-10V6l7-3z" />
      <path d="m9.5 12.2 1.9 1.9 3.8-4.1" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <path d="M7 17a2 2 0 1 0 0 .1" />
      <path d="M17 17a2 2 0 1 0 0 .1" />
    </svg>
  );
}

export default function AboutPage() {
  const highlights = [
    {
      title: 'Thoughtful Design',
      description: 'A calm, editorial look that puts beautiful furniture front and center without feeling crowded or complicated.',
      Icon: SparklesIcon,
    },
    {
      title: 'Quality Craftsmanship',
      description: 'Carefully chosen materials, refined finishes, and attention to detail that help each piece feel dependable in daily use.',
      Icon: TruckIcon,
    },
    {
      title: 'Protected Shopping',
      description: 'Your personal details and payments are handled with industry-standard security, so the experience feels simple and reassuring.',
      Icon: ShieldCheckIcon,
    },
  ];

  return (
    <>
      <PageHero
        kicker="About Us"
        title="Crafting elevated interiors with a refined sense of comfort."
        description="Junaid Furniture brings together carefully selected materials, a warm design sensibility, and a shopping experience shaped around trust, ease, and attentive service."
        image="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#e7d8c7] bg-white/90 p-8 shadow-[0_18px_45px_rgba(77,52,34,0.08)] backdrop-blur-sm">
            <SectionTitle eyebrow="Our Story" title="Built for premium homes and effortless shopping." />
            <div className="prose-tight mt-5 text-sm leading-8 text-text/70">
              <p>We designed this furniture store experience to feel calm, editorial, and trustworthy. The warm wood-inspired palette, generous spacing, and clean layout are meant to make browsing feel relaxed and intuitive.</p>
              <p className="mt-4">From product discovery to checkout, we focus on quality materials, clear presentation, reliable delivery, and helpful support so customers can shop with confidence and ease.</p>
              <p className="mt-4">Every part of the experience is shaped to feel polished, personal, and dependable, with the goal of making beautiful furniture easier to discover and bring home.</p>
            </div>
          </div>
          <div className="grid gap-6">
            {highlights.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="group rounded-[1.75rem] border border-[#eadfce] bg-[#eadfd2] p-6 shadow-[0_12px_28px_rgba(77,52,34,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(77,52,34,0.14)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text/70">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}
