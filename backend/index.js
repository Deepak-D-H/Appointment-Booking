import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import doctorRoute from './Routes/doctor.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV records across all network environments
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {}

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration supporting production frontend and local development
const allowedOrigins = [
  process.env.CLIENT_SITE_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin === allowed || origin.replace(/\/+$/, '') === allowed.replace(/\/+$/, ''))) {
      return callback(null, true);
    }
    // In non-production, permit all origins for ease of testing
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Medicare API is working',
    version: '1.0.0'
  });
});

app.get('/api/v1/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'healthy' : 'unhealthy',
    database: isDbConnected ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
  const primary = process.env.MONGO_URL;
  const fallback = 'mongodb://127.0.0.1:27017/doctor-app';

  if (!primary) {
    console.warn('MONGO_URL not set in env; attempting local fallback');
  }

  try {
    const uriToUse = primary || fallback;
    await mongoose.connect(uriToUse, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected successfully');
    return;
  } catch (error) {
    console.error('Primary MongoDB connection FAILED:', error && error.message ? error.message : error);
  }

  // If primary failed and we're in dev, try local fallback
  if (process.env.NODE_ENV !== 'production' && primary) {
    try {
      await mongoose.connect(fallback, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected successfully (fallback local)');
      return;
    } catch (err) {
      console.error('Fallback local MongoDB connection FAILED:', err && err.message ? err.message : err);
    }
  }

  console.error('All MongoDB connection attempts failed. Please check network, DNS, and MONGO_URL.');
};

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/doctors/:doctorId/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

// 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});