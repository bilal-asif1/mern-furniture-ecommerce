import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import categoriesHero from '../assets/images/categories/categories-hero.jpg';


export default function CategoriesPage() {
  const { products } = useApp();

  return (
    <>
      <PageHero
        kicker="Categories"
        title="Browse luxury furniture by curated category."
        description="A richer, more visual discovery experience for dressing, bed sets, sofa sets, dining sets, and more."
        image={categoriesHero}
      />

      <PageSection>
        <SectionTitle eyebrow="Featured by Category" title="Popular Pieces" description="A few current products styled to match the premium category experience." />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} compact index={index} />
          ))}
        </div>
      </PageSection>
    </>
  );
}
