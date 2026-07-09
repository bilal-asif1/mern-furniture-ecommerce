import fs from 'fs';
import path from 'path';

const base = 'http://localhost:5000';
const adminEmail = 'admin@junaidfurniture.com';
const adminPassword = 'Admin@12345';

const uploadTest = async () => {
  try {
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed', loginData);
      process.exit(1);
    }
    const token = loginData.token;

    const form = new FormData();
    form.append('name', `File Upload Test ${Date.now()}`);
    form.append('description', 'Testing multipart upload with images');
    form.append('shortDescription', 'Test');
    form.append('price', '1500');

    // pick a category id from existing categories
    const catsRes = await fetch(`${base}/api/categories`);
    const cats = await catsRes.json();
    const catId = cats[0]?.id || cats[0]?._id;
    if (!catId) throw new Error('No category found');
    form.append('category', catId);

    // attach two existing files from public/uploads/products
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    const files = fs.readdirSync(uploadsDir).slice(0, 2);
    // For Node's global FormData, use Blob from fs.readFile and Buffer
    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase().replace('.', '');
      const mimeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
      };
      const mime = mimeMap[ext] || 'application/octet-stream';
      const blob = new Blob([buffer], { type: mime });
      form.append('images', blob, fileName);
    }

    const res = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    console.log('Status', res.status);
    console.log('Response', data);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

uploadTest();
