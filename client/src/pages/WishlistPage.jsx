import { Link } from 'react-router-dom';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

export default function WishlistPage() {
  const { wishlist, wishlistLoading, wishlistError, clearWishlist } = useApp();

  return (
    <PageSection className="py-10">
      <SectionTitle eyebrow="Wishlist" title="Your Saved Pieces" description="Return to products you want to compare, share, or purchase later." />
      {wishlistError ? <div className="mt-6 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{wishlistError}</div> : null}
      {wishlistLoading ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[1.5rem] border border-[#eadfce]/70 bg-white/85">
              <div className="aspect-[4/3] bg-[#fbf7f2] animate-pulse" />
              <div className="p-3 space-y-3">
                <div className="h-3 bg-[#eadfce]/50 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-[#eadfce]/50 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {wishlist.length ? (
        <>
          <div className="mt-8 flex justify-end">
            <Button variant="ghost" onClick={clearWishlist}>Clear Wishlist</Button>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((product) => <ProductCard key={product.id} product={product} compact />)}
          </div>
        </>
      ) : (
        <div className="mt-8">
          <EmptyState title="Wishlist is empty" description="Save products you love and return to them anytime." actionLabel="Browse Shop" actionTo="/shop" />
        </div>
      )}
      <div className="mt-6 text-sm text-text/60">
        <Link className="font-semibold text-primary" to="/shop">Continue shopping</Link>
      </div>
    </PageSection>
  );
}
