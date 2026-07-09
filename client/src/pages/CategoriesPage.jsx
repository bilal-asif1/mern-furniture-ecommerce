import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export default function CategoriesPage() {
  const { categories, products } = useApp();

  return (
    <>
      <PageHero
        kicker="Categories"
        title="Browse collections by room and lifestyle."
        description="Elegant category navigation helps customers move quickly through living room, bedroom, dining, and office selections."
        image="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80"
      />
      <PageSection>
        <SectionTitle eyebrow="Collections" title="Category Showcase" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </PageSection>
      <PageSection>
        <SectionTitle eyebrow="Featured by Category" title="Popular Pieces" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} compact />)}
        </div>
      </PageSection>
    </>
  );
}
