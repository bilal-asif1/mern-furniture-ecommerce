import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Grid2x2, Star } from 'lucide-react';
import SEO from '../components/SEO';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { featuredLuxuryCards, premiumCategories } from '../data/siteContent';
import heroImage from '../assets/images/shop/shop-hero.jpg';

const trustPills = [
  { label: 'Curated collections', icon: Grid2x2 },
  { label: 'Premium materials', icon: Sparkles },
  { label: 'Delivery support', icon: Truck },
  { label: 'Secure shopping', icon: ShieldCheck },
];

function HeroStat({ label, value }) {
  return (
    <div className="rounded-[1.4rem] border border-white/75 bg-white/70 px-4 py-4 shadow-[0_14px_35px_rgba(35,31,27,0.08)] backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text/52">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-text sm:text-[2rem]">{value}</p>
    </div>
  );
}

export default function HomePage() {
  const { categories, products } = useApp();

  const displayCategories = categories.length ? categories.slice(0, 6) : premiumCategories.slice(0, 6);
  const featuredProducts = products.filter((product) => product.featured);
  const bestSellers = products.filter((product) => product.bestSeller);
  const newArrivals = products.filter((product) => product.newArrival);

  const heroStats = [
    { label: 'Collections', value: String(displayCategories.length).padStart(2, '0') },
    { label: 'Live products', value: String(products.length).padStart(2, '0') },
    { label: 'Shopping flow', value: 'WhatsApp' },
  ];

  return (
    <>
      <SEO
        title="Junaid Furniture | Premium Furniture for Modern Homes"
        description="Discover a premium furniture showroom experience at Junaid Furniture. Browse curated categories, featured products, and elegant home pieces for modern interiors."
        canonical="https://junaidfurniture.netlify.app/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Junaid Furniture',
          url: 'https://junaidfurniture.netlify.app/',
          description: 'Premium furniture showroom experience for modern homes.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://junaidfurniture.netlify.app/?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        <div className="section-shell relative grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="page-ribbon">Premium furniture showroom</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.94] tracking-tight text-text sm:text-6xl lg:text-[5rem] xl:text-[5.6rem]">
              Furniture that turns everyday rooms into calm, elevated spaces.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8">
              Explore a curated catalogue of bed sets, sofas, dining pieces, and office furniture presented with the quiet confidence of a premium showroom.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/shop">Shop Collection</Button>
              <Button to="/categories" variant="outline">
                View Categories
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <HeroStat key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {trustPills.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-[#e4d4c3] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text/70 shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
            className="relative"
          >
            <div className="absolute -left-4 top-8 hidden h-28 w-28 rounded-full bg-secondary/30 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-10 hidden h-36 w-36 rounded-full bg-[#caa782]/25 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/75 bg-white/75 shadow-editorial">
              <img
                src={heroImage}
                alt="Premium furniture display"
                className="h-[380px] w-full object-cover object-center sm:h-[460px] lg:h-[620px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,31,27,0.02),rgba(36,31,27,0.12))]" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-white/70 bg-white/80 p-4 backdrop-blur-md sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <Logo className="h-8 w-auto" />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-text/52">Junaid Furniture</p>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-text/70">
                      Crafted presentation, warm materials, and generous breathing room for a shopping experience that feels composed and inviting.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/70 bg-primary px-4 py-4 text-white shadow-[0_18px_40px_rgba(125,84,53,0.22)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">Explore</p>
                    <Link to="/shop" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                      Go to shop
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PageSection className="pt-2">
        <SectionTitle
          eyebrow="Featured collections"
          title="Browse the showroom by collection."
          description="Choose a direction that matches the room you are furnishing, then move deeper into the catalog with a cleaner visual path."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {displayCategories.map((category, index) => (
            <CategoryCard key={category.id || category.slug} category={category} index={index} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow="Featured products"
            title="Premium pieces from the current catalog."
            description="A refined selection from the live product feed, styled to feel editorial rather than crowded."
          />
          <Button to="/shop" variant="outline">
            View all products
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {(featuredProducts.length ? featuredProducts : products.slice(0, 4)).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </PageSection>

      {bestSellers.length > 0 ? (
        <PageSection>
          <SectionTitle
            eyebrow="Best sellers"
            title="Pieces customers return to most often."
            description="Use the live catalog flags to surface products that are already resonating with shoppers."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} compact index={index} />
            ))}
          </div>
        </PageSection>
      ) : null}

      {newArrivals.length > 0 ? (
        <PageSection>
          <SectionTitle
            eyebrow="New arrivals"
            title="Fresh additions with an updated showroom feel."
            description="Keep the layout calm while giving newly listed items a dedicated, premium presentation."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newArrivals.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} compact index={index} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="premium-panel p-6 sm:p-8">
            <p className="page-ribbon">Why Junaid Furniture</p>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              A calmer way to shop for furniture online.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8">
              The layout favors wide imagery, restrained spacing, and clear hierarchy so your catalog feels like a premium showroom rather than a crowded template.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {featuredLuxuryCards.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-[#eadfce] bg-[#faf5ef] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    {item.icon === 'spark' ? <Sparkles className="h-4 w-4" /> : null}
                    {item.icon === 'truck' ? <Truck className="h-4 w-4" /> : null}
                    {item.icon === 'grid' ? <Grid2x2 className="h-4 w-4" /> : null}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text/65">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-frame overflow-hidden">
            <div className="grid h-full gap-px bg-[#eadfce] md:grid-cols-2">
              <div className="bg-[linear-gradient(180deg,#fffdf9,#f5ede4)] p-6 sm:p-8">
                <p className="page-ribbon">Collection</p>
                <h3 className="mt-5 font-display text-3xl font-semibold text-text sm:text-[2.6rem]">Living room, bedroom, and dining pieces.</h3>
                <p className="mt-4 text-sm leading-7 text-text/70">A curated view of the catalog designed to make the browsing flow feel spacious and calm.</p>
                <Button to="/categories" variant="outline" className="mt-6">
                  Browse collections
                </Button>
              </div>
              <div className="bg-primary p-6 text-white sm:p-8">
                <p className="page-ribbon border-white/15 bg-white/10 text-white shadow-none">Support</p>
                <h3 className="mt-5 font-display text-3xl font-semibold sm:text-[2.6rem]">Want help choosing a piece?</h3>
                <p className="mt-4 text-sm leading-7 text-white/80">Continue to the shop, compare products, and use the existing WhatsApp ordering flow to ask questions when you are ready.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button to="/shop" variant="secondary">
                    Shop now
                  </Button>
                  <Button to="/contact" variant="ghost" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                    Contact us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
