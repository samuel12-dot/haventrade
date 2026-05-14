import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './src/config/db.js';
import authRoutes     from './src/routes/auth.js';
import listingRoutes  from './src/routes/listings.js';
import sellerRoutes   from './src/routes/sellers.js';
import orderRoutes    from './src/routes/orders.js';
import uploadRoutes   from './src/routes/upload.js';
import errorHandler   from './src/middleware/errorHandler.js';

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',     authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/sellers',  sellerRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/upload',   uploadRoutes);

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() })
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start accepting requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`HavenTrade API — http://localhost:${PORT}  [${process.env.NODE_ENV}]`);
  });
});
