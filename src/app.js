import 'express-async-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import env from './config/env.config.js';
import { morganLogger } from './utils/logger.util.js';
import sanitize from './middlewares/sanitize.middleware.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import notFound from './middlewares/notFound.middleware.js';
import apiRouter from './routes/index.routes.js';

const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,       // Required for HTTP-only cookie sharing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Request Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Sanitization ────────────────────────────────────────────
app.use(sanitize);

// ─── Compression & Logging ───────────────────────────────────
app.use(compression());
app.use(morganLogger);

// ─── Rate Limiting ────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ─── Error Handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
