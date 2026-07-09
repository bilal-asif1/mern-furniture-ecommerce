const base = 'http://localhost:5000';
const adminEmail = 'admin@junaidfurniture.com';
const adminPassword = 'Admin@12345';

(async () => {
  try {
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      process.exit(1);
    }
    const token = loginData.token;
    console.log('Got token');

    const catsRes = await fetch(`${base}/api/categories`, { headers: { Authorization: `Bearer ${token}` } });
    const cats = await catsRes.json();
    if (!catsRes.ok) {
      console.error('Fetching categories failed:', cats);
      process.exit(1);
    }
    const catId = cats[0]?.id || cats[0]?._id;
    console.log('Using category:', catId);

    const product = {
      name: `Test Product ${Date.now()}`,
      category: catId,
      brand: 'Junaid Furniture',
      price: 1000,
      description: 'Automated test product',
      shortDescription: 'Test product',
      stock: 10,
    };

    const createRes = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    });
    const createData = await createRes.json();
    console.log('Create status:', createRes.status);
    console.log(createData);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
