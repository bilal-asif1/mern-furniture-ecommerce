import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import registerRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Force Railway redeploy to pick up guest checkout changes

const app = express();

console.log('Starting with CLIENT_URL:', process.env.CLIENT_URL);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.CLIENT_URL) {
  // Remove trailing slash if present to avoid mismatch
  const clientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(clientUrl)) {
    allowedOrigins.push(clientUrl);
  }
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Junaid Furniture API' });
});

registerRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;
