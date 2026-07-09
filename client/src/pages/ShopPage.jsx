import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { SelectField, TextInput } from '../components/Field';
import { useApp } from '../context/AppContext';

const PER_PAGE = 6;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const { categories, products, fetchProducts, catalogListLoading, catalogError, catalogPages, catalogCount } = useApp();
  const categoryAlias = searchParams.get('category') || '';

  useEffect(() => {
    if (!categoryId && categoryAlias && categories.length) {
      const matchedCategory = categories.find(
        (item) =>
          item.id === categoryAlias ||
          item.slug === categoryAlias ||
          item.name === categoryAlias,
      );

      if (matchedCategory) {
        setCategoryId(matchedCategory.id);
      }
    }
  }, [categoryAlias, categoryId, categories]);

  useEffect(() => {
    const params = {
      limit: PER_PAGE,
      page,
      sort: sort === 'featured' ? '' : sort,
    };

    if (query.trim()) params.keyword = query.trim();
    if (categoryId) params.categoryId = categoryId;
    if (sort === 'featured') params.sort = '';

    fetchProducts(params);
  }, [fetchProducts, query, categoryId, sort, page]);

  const totalPages = Math.max(1, catalogPages || 1);
  const visibleProducts = useMemo(() => products, [products]);

  const updateFilters = (next = {}) => {
    const params = new URLSearchParams(searchParams);
    const merged = { q: query, categoryId, sort, page, ...next };

    Object.entries(merged).forEach(([key, value]) => {
      if (!value || value === 'featured' || value === 1) params.delete(key);
      else params.set(key, String(value));
    });

    setSearchParams(params);
  };

  return (
    <>
      <PageHero
        kicker="Shop"
        title="Discover curated furniture for every room."
        description="Use smart search, filters, and pagination to explore premium furniture products with ease."
        image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
      />
      <PageSection>
        <SectionTitle eyebrow="Catalog" title="Search and Filter Products" description="Find the right piece by room, style, rating, or price." />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid gap-4 rounded-[2rem] bg-white p-5 shadow-card lg:grid-cols-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TextInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
                updateFilters({ q: event.target.value, page: 1 });
              }}
              placeholder="Search furniture..."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <SelectField
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(1);
                updateFilters({ categoryId: event.target.value, page: 1 });
              }}
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </SelectField>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <SelectField
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                updateFilters({ sort: event.target.value });
              }}
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </SelectField>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setCategoryId('');
                setSort('featured');
                setPage(1);
                setSearchParams({});
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {catalogError ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {catalogError}
            </motion.div>
          ) : null}
        </AnimatePresence>
        {catalogListLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-3xl bg-white p-6 shadow-card"
          >
            Loading products...
          </motion.div>
        ) : null}
        <motion.div
          layout
          className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-text/60">
            Showing {visibleProducts.length} of {catalogCount} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                updateFilters({ page: next });
              }}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                setPage(next);
                updateFilters({ page: next });
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
