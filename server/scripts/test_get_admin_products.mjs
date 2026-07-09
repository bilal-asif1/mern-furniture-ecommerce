const base = 'http://localhost:5000';

(async () => {
  try {
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: 'admin@junaidfurniture.com', password: 'Admin@12345' }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const res = await fetch(`${base}/api/admin/products?limit=200`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status', res.status);
    const data = await res.json();
    console.log('Count', data.length || data.count || (data.products && data.products.length));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
