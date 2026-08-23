import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import categoriesHero from '../assets/images/categories/categories-hero.jpg';

export default function CategoriesPage() {
  const { categories, products } = useApp();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

  return (
    <>
      <SEO
        title="Categories | Junaid Furniture"
        description="Browse Junaid Furniture collections in a premium showroom layout. Discover bedroom, sofa, dining, office, and living room furniture categories."
        canonical="https://junaidfurniture.netlify.app/categories"
      />
      <PageHero
        kicker="Collections"
        title="Browse furniture by curated collection."
        description="A refined category experience for bedrooms, sofas, dining sets, office furniture, and more."
        image={categoriesHero}
      />

      <PageSection>
        <SectionTitle
          eyebrow="Featured collections"
          title="A showroom-style view of the catalog."
          description="Each category card uses generous imagery and clear hierarchy so browsing feels elevated and easy to scan."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.id || category.slug} category={category} index={index} />
          ))}
        </div>
      </PageSection>

      {featuredProducts.length ? (
        <PageSection>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Featured products"
              title="A few pieces worth exploring now."
              description="The current live catalog stays fully connected to the backend while the presentation remains premium and calm."
            />
            <Button to="/shop" variant="outline">
              Shop all products
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} compact index={index} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageSection>
        <div className="editorial-frame overflow-hidden">
          <div className="grid gap-px bg-[#eadfce] lg:grid-cols-[1fr_0.9fr]">
            <div className="bg-white p-6 sm:p-8">
              <p className="page-ribbon">Need more detail?</p>
              <h2 className="mt-5 font-display text-4xl font-semibold text-text sm:text-5xl">
                Go deeper into the shop or open a product page.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8">
                Every category leads into the same live product data, so you can continue browsing without losing the premium visual presentation.
              </p>
            </div>
            <div className="bg-primary p-6 text-white sm:p-8">
              <p className="page-ribbon border-white/15 bg-white/10 text-white shadow-none">Next step</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button to="/shop" variant="secondary">
                  Browse shop
                </Button>
                <Link to="/" className="inline-flex items-center justify-center rounded-[1.1rem] border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
