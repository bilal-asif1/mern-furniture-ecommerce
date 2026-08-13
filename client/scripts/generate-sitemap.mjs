import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://junaidfurniture.netlify.app';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=1000`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const data = await response.json();
    return data.products || data || [];
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
}

function generateSitemap(products) {
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.9' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '/faq', changefreq: 'monthly', priority: '0.6' },
  ];

  const productPages = products
    .filter(product => product.slug && !product.deleted)
    .map(product => ({
      loc: `/product/${product.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    }));

  const allPages = [...staticPages, ...productPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  return xml;
}

async function main() {
  console.log('Fetching products from API...');
  const products = await fetchProducts();
  console.log(`Found ${products.length} active products`);

  console.log('Generating sitemap.xml...');
  const sitemap = generateSitemap(products);

  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`Sitemap written to ${outputPath}`);
  console.log(`Total URLs in sitemap: ${products.length + 5}`);
}

main().catch(console.error);
