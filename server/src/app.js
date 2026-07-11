import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import registerRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// In development allow the dev client origins by reflecting the incoming Origin header.
// This simplifies local E2E and dev server setups.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Junaid Furniture API' });
});

registerRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;
