import User from '../models/User.js';

const seedUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) return existing;

  const user = await User.create({ name, email, password, role });
  console.log(`Seeded ${role} user: ${user.email}`);
  return user;
};

const seedUsers = async () => {
  await seedUser({
    name: process.env.ADMIN_NAME || 'Admin Junaid',
    email: process.env.ADMIN_EMAIL || 'admin@junaidfurniture.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
  });

  await seedUser({
    name: process.env.DEMO_USER_NAME || 'Junaid Customer',
    email: process.env.DEMO_USER_EMAIL || 'customer@junaidfurniture.com',
    password: process.env.DEMO_USER_PASSWORD || 'Customer@12345',
    role: 'customer',
  });
};

export default seedUsers;
