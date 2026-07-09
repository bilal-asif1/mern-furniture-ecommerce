import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import registerRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In development allow the dev client origins by reflecting the incoming Origin header.
// This simplifies local E2E and dev server setups.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// Serve static files from public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Junaid Furniture API' });
});

registerRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;
