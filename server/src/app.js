import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import healthRoutes from './routes/healthRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// 1. Standard HTTP Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 2. CORS Configuration
const allowedOrigins = [
  config.clientOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (e.g. server-to-server or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// 3. Body Parsing & Payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// 4. Rate Limiting to prevent denial of service and upstream abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429,
    },
  },
});

app.use('/api', apiLimiter);

// 5. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/pages', pageRoutes);

// 6. 404 Catch-all
app.use(notFoundHandler);

// 7. Centralized Error Handler
app.use(errorHandler);

export default app;
