import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Button from '../components/Button';
import { testimonials } from '../data/mock';
import { useApp } from '../context/AppContext';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const whyChooseItems = [
  {
    title: 'Tailored Craftsmanship',
    description: 'Hand-finished details and durable construction that feel warm, refined, and built to last.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="M3 17l9 5 9-5" />
        <path d="M3 12l9 5 9-5" />
      </svg>
    ),
  },
  {
    title: 'Reliable Fulfillment',
    description: 'A smooth delivery experience backed by clear order flow, transparent updates, and dependable handling.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h13v10H3z" />
        <path d="M16 10h3l2 3v4h-5z" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="17.5" cy="17.5" r="1.5" />
      </svg>
    ),
  },
  {
    title: 'Curated Selection',
    description: 'A focused collection designed to feel editorial, cohesive, and easy to explore on any device.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16" />
        <path d="M6 20V8l6-4 6 4v12" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    title: 'Trustworthy Experience',
    description: 'Clear product presentation, polished interactions, and a calm interface that inspires confidence.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const testimonialStars = Array.from({ length: 5 });

export default function HomePage() {
  const { products, categories } = useApp();
  const featured = products.slice(0, 4);
  const bestSellers = products.filter((product) => ['Best Seller', 'Popular'].includes(product.badge));
  const newArrivals = products.filter((product) => ['New Arrival', 'Trending'].includes(product.badge));
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const carouselRef = useRef(null);
  const [activeWhyChoose, setActiveWhyChoose] = useState(0);
  const whyChooseRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveTestimonial(newIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carousel = whyChooseRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveWhyChoose(newIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PageHero
        kicker="Premium Furniture Store"
        title="Timeless furniture, elevated with a modern digital experience."
        description="Discover a premium collection of furniture that balances warm craftsmanship, clean lines, and a refined shopping journey built for today's homes."
        image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
      />

      <PageSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ['Premium Materials', 'Hand-finished details, durable construction, and elevated textures.'],
            ['Fast Delivery', 'Reliable order management, tracking, and smooth checkout flow.'],
            ['Curated Design', 'Collections styled to feel editorial, warm, and brand-led.'],
          ].map(([title, description], index) => (
            <motion.div
              key={title}
              variants={reveal}
              custom={index * 0.08}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(63,39,17,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(63,39,17,0.12)] sm:p-7"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7efe3] text-primary shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 3 7l9 5 9-5-9-5Z" />
                  <path d="M3 17l9 5 9-5" />
                  <path d="M3 12l9 5 9-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text sm:text-[1.45rem]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-text/65 sm:text-[15px]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-6 lg:grid lg:grid-cols-[0.94fr_1.06fr]"
        >
          <motion.div
            variants={reveal}
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,#f6ece1_0%,#e7d6c1_100%)] p-7 shadow-[0_22px_60px_rgba(63,39,17,0.12)] sm:p-8 lg:p-10"
          >
            <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Why Choose Us</p>
            <h3 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl lg:text-[2.85rem]">
              A premium shopping journey from first click to final delivery.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-text/72 sm:text-[15px]">
              We blend elegant visuals, structured navigation, secure checkout, and production-ready architecture to create a brand experience that feels luxurious and trustworthy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop" className="min-w-32">Shop Now</Button>
              <Button to="/about" variant="ghost" className="min-w-32">Learn More</Button>
            </div>
          </motion.div>
          
          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <div
              ref={whyChooseRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {whyChooseItems.map((item, index) => (
                <motion.article
                  key={item.title}
                  variants={reveal}
                  custom={index * 0.08 + 0.04}
                  whileHover={{ y: -6 }}
                  className="group flex-shrink-0 w-[calc(100%-15px)] rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_16px_45px_rgba(63,39,17,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(63,39,17,0.12)] sm:p-6"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7efe3] text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text sm:text-xl">{item.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-text/65 sm:text-[15px]">{item.description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {whyChooseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const carousel = whyChooseRef.current;
                    if (carousel) {
                      const cardWidth = carousel.offsetWidth;
                      carousel.scrollTo({
                        left: index * cardWidth,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeWhyChoose
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-primary/30'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop/Tablet Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
            {whyChooseItems.map((item, index) => (
              <motion.article
                key={item.title}
                variants={reveal}
                custom={index * 0.08 + 0.04}
                whileHover={{ y: -6 }}
                className="group rounded-[1.8rem] border border-white/70 bg-white/88 p-5 shadow-[0_16px_45px_rgba(63,39,17,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(63,39,17,0.12)] sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f7efe3] text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text sm:text-xl">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-text/65 sm:text-[15px]">{item.description}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </PageSection>

      <PageSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2.25rem] border border-white/70 bg-[linear-gradient(180deg,#fbf7f1_0%,#f4eadc_100%)] px-5 py-8 shadow-[0_20px_60px_rgba(63,39,17,0.08)] sm:px-7 sm:py-10 lg:px-9 lg:py-12"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionTitle eyebrow="Testimonials" title="What Our Customers Say" description="A few words from customers who value craftsmanship, clarity, and a polished buying experience." />
            <div className="hidden rounded-full border border-[#e0d2c1] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-text/55 md:inline-flex">
              Trusted reviews
            </div>
          </div>
          <motion.div variants={reveal} className="mt-8">
            {/* Mobile Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide lg:hidden"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {testimonials.map((item, index) => (
                <motion.blockquote
                  key={item.id}
                  variants={reveal}
                  custom={index * 0.08}
                  whileHover={{ y: -7 }}
                  className="group relative flex-shrink-0 w-[calc(100%-15px)] overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(63,39,17,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(63,39,17,0.12)] sm:p-7"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="absolute right-5 top-5 text-primary/15 transition-colors duration-300 group-hover:text-primary/25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.17 6A4.17 4.17 0 0 0 3 10.17V14h4.17v-3.83H4.83a2.34 2.34 0 0 1 2.34-2.34V6ZM18.17 6A4.17 4.17 0 0 0 14 10.17V14h4.17v-3.83h-2.34a2.34 2.34 0 0 1 2.34-2.34V6Z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 text-[#c58d57]">
                    {testimonialStars.map((_, starIndex) => (
                      <svg key={`${item.id}-star-${starIndex}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m12 2 2.9 6.5 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.1l7.1-.6L12 2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-text/72 sm:text-[15px] sm:leading-8">"{item.quote}"</p>
                  <footer className="mt-6 border-t border-black/5 pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7efe3] text-xs font-bold tracking-[0.25em] text-primary shadow-sm">
                        {item.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-text">{item.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary/90">{item.role}</p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-text/50">{item.city}</p>
                      </div>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4 lg:hidden">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const carousel = carouselRef.current;
                    if (carousel) {
                      const cardWidth = carousel.offsetWidth;
                      carousel.scrollTo({
                        left: index * cardWidth,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-primary/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Desktop/Tablet Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
              {testimonials.map((item, index) => (
                <motion.blockquote
                  key={item.id}
                  variants={reveal}
                  custom={index * 0.08}
                  whileHover={{ y: -7 }}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-[0_16px_45px_rgba(63,39,17,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(63,39,17,0.12)] sm:p-7"
                >
                  <div className="absolute right-5 top-5 text-primary/15 transition-colors duration-300 group-hover:text-primary/25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.17 6A4.17 4.17 0 0 0 3 10.17V14h4.17v-3.83H4.83a2.34 2.34 0 0 1 2.34-2.34V6ZM18.17 6A4.17 4.17 0 0 0 14 10.17V14h4.17v-3.83h-2.34a2.34 2.34 0 0 1 2.34-2.34V6Z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 text-[#c58d57]">
                    {testimonialStars.map((_, starIndex) => (
                      <svg key={`${item.id}-star-${starIndex}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m12 2 2.9 6.5 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.1l7.1-.6L12 2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-text/72 sm:text-[15px] sm:leading-8">"{item.quote}"</p>
                  <footer className="mt-6 border-t border-black/5 pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7efe3] text-xs font-bold tracking-[0.25em] text-primary shadow-sm">
                        {item.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-text">{item.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary/90">{item.role}</p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-text/50">{item.city}</p>
                      </div>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </PageSection>
    </>
  );
}

