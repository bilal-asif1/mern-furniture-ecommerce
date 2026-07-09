import { useState } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import { faqs } from '../data/mock';

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHero
        kicker="FAQ"
        title="Helpful answers for a smooth buying experience."
        description="Find quick support details about shipping, returns, payment, and custom furniture options."
        image="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80"
      />
      <PageSection>
        <SectionTitle eyebrow="Support" title="Frequently Asked Questions" />
        <div className="mt-8 space-y-4">
          {faqs.map((item, index) => (
            <button
              key={item.question}
              type="button"
              onClick={() => setOpen(index)}
              className="w-full rounded-3xl bg-white p-6 text-left shadow-card"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-text">{item.question}</h3>
                <span className="text-primary">{open === index ? '-' : '+'}</span>
              </div>
              {open === index ? <p className="mt-4 max-w-4xl text-sm leading-7 text-text/70">{item.answer}</p> : null}
            </button>
          ))}
        </div>
      </PageSection>
    </>
  );
}
