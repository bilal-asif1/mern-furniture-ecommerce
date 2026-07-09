import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(process.cwd(), '..', '.env'),
  path.resolve(process.cwd(), '..', 'server/.env'),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

process.env.JWT_SECRET ||= 'junaid-furniture-dev-secret';
process.env.CLIENT_URL ||= 'http://localhost:5173';
process.env.PORT ||= '5000';

const PORT = process.env.PORT || 5000;

const [{ default: connectDB }, { default: app }, { default: seedUsers }, { default: seedData }] = await Promise.all([
  import('./config/db.js'),
  import('./app.js'),
  import('./utils/seedUsers.js'),
  import('./utils/seedData.js'),
]);

const connected = await connectDB();
if (connected) {
  await seedUsers();
  await seedData();
}

const server = app.listen(PORT, () => {
  console.log(`Junaid Furniture API running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or change PORT.`);
    process.exit(1);
  }

  throw error;
});
