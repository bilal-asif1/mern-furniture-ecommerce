export const categories = [
  { id: 'c1', name: 'Living Room', slug: 'living-room', description: 'Sofas, coffee tables, and statement seating.' },
  { id: 'c2', name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, and restful essentials.' },
  { id: 'c3', name: 'Dining', slug: 'dining', description: 'Dining tables and chairs designed to host.' },
  { id: 'c4', name: 'Office', slug: 'office', description: 'Elegant workspaces with premium craftsmanship.' },
];

export const products = [
  {
    id: 'p1',
    name: 'Aurelia Sectional Sofa',
    slug: 'aurelia-sectional-sofa',
    category: 'Living Room',
    price: 1890,
    rating: 4.9,
    reviews: 132,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep comfort, tailored lines, and performance upholstery for modern family spaces.',
  },
  {
    id: 'p2',
    name: 'Nolan Walnut Bed',
    slug: 'nolan-walnut-bed',
    category: 'Bedroom',
    price: 1540,
    rating: 4.8,
    reviews: 84,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'A sculpted walnut frame with a calm, luxurious profile.',
  },
  {
    id: 'p3',
    name: 'Haven Dining Set',
    slug: 'haven-dining-set',
    category: 'Dining',
    price: 2210,
    rating: 4.9,
    reviews: 76,
    badge: 'Curated',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'A warm dining arrangement designed for everyday elegance and long conversations.',
  },
  {
    id: 'p4',
    name: 'Arcadia Desk',
    slug: 'arcadia-desk',
    category: 'Office',
    price: 920,
    rating: 4.7,
    reviews: 58,
    badge: 'Editor Pick',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    description: 'A refined workstation with integrated storage and a premium tactile finish.',
  },
  {
    id: 'p5',
    name: 'Mira Accent Chair',
    slug: 'mira-accent-chair',
    category: 'Living Room',
    price: 680,
    rating: 4.8,
    reviews: 99,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
    description: 'Soft curves and elevated texture for a welcoming reading nook.',
  },
  {
    id: 'p6',
    name: 'Serene Wardrobe',
    slug: 'serene-wardrobe',
    category: 'Bedroom',
    price: 1985,
    rating: 4.7,
    reviews: 61,
    badge: 'Storage Pro',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'Generous storage, mirrored detail, and a polished modern silhouette.',
  },
  {
    id: 'p7',
    name: 'Form Oak Coffee Table',
    slug: 'form-oak-coffee-table',
    category: 'Living Room',
    price: 540,
    rating: 4.6,
    reviews: 42,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    description: 'Solid oak craftsmanship with a generous surface and architectural legs.',
  },
  {
    id: 'p8',
    name: 'Noir Dining Chair',
    slug: 'noir-dining-chair',
    category: 'Dining',
    price: 210,
    rating: 4.8,
    reviews: 141,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Comfortable seating with a sleek profile that styles easily in sets.',
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Ayesha Khan',
    role: 'Interior Designer',
    quote: 'The craftsmanship feels genuinely premium, and the UI makes the shopping journey effortless.',
  },
  {
    id: 't2',
    name: 'Omar Ali',
    role: 'Homeowner',
    quote: 'Elegant, fast, and beautifully organized. It feels like shopping from a luxury furniture brand.',
  },
  {
    id: 't3',
    name: 'Sara Ahmed',
    role: 'Studio Founder',
    quote: 'The design language is polished and the admin dashboard looks ready for real operations.',
  },
];

export const faqs = [
  {
    question: 'How does delivery work?',
    answer: 'We provide scheduled delivery with careful packaging and white-glove setup options where available.',
  },
  {
    question: 'Can I customize a product?',
    answer: 'Selected products can be customized by fabric, finish, or size. Our team confirms availability after inquiry.',
  },
  {
    question: 'What payment methods are supported?',
    answer: 'The checkout flow is built to support cards, wallets, and local payment gateways in production.',
  },
  {
    question: 'How do returns work?',
    answer: 'Returns are handled within a clearly defined window for eligible products according to store policy.',
  },
];

export const orders = [
  { id: 'ORD-2048', date: '2026-06-18', status: 'In Transit', total: 2530 },
  { id: 'ORD-2050', date: '2026-06-12', status: 'Delivered', total: 920 },
];

export const adminMetrics = [
  { label: 'Revenue', value: '$48.2K', delta: '+12.4%' },
  { label: 'Orders', value: '318', delta: '+8.1%' },
  { label: 'Customers', value: '1,248', delta: '+6.8%' },
  { label: 'Low Stock', value: '14', delta: '-3 items' },
];
