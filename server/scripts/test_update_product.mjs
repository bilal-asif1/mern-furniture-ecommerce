import fs from 'fs';
import path from 'path';

const base = 'http://localhost:5000';
const adminEmail = 'admin@junaidfurniture.com';
const adminPassword = 'Admin@12345';

(async () => {
  try {
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // fetch admin products and pick one created by file upload test (by slug prefix 'file-upload-test')
    const adminRes = await fetch(`${base}/api/admin/products?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
    const adminData = await adminRes.json();
    const product = (adminData.products || []).find((p) => p.slug && p.slug.startsWith('file-upload-test')) || adminData.products?.[0];
    if (!product) throw new Error('No product found to update');

    console.log('Updating product', product._id || product.id);
    const id = product._id || product.id;

    const form = new FormData();
    form.append('name', product.name + ' (updated)');
    form.append('description', (product.description || '') + ' updated');
    form.append('shortDescription', (product.shortDescription || '') + ' updated');
    form.append('price', String((Number(product.price || 0) + 100)));

    // attach one existing file
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    const files = fs.readdirSync(uploadsDir).slice(0, 1);
    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase().replace('.', '');
      const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
      const mime = mimeMap[ext] || 'application/octet-stream';
      const blob = new Blob([buffer], { type: mime });
      form.append('images', blob, fileName);
    }

    const res = await fetch(`${base}/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    console.log('Status', res.status);
    console.log(data);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
