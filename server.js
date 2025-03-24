import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { authenticate } from './middleware/authMiddleware.js';

dotenv.config();

// Initialize Express
const app = express();

// Connect to Database
(async () => {
  try {
    await connectDB();
    console.log('✅ Database Connected Successfully');
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    process.exit(1); // Exit on DB connection failure
  }
})();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (Replace '*' with frontend URL in production)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings',  bookingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Handle Uncaught Errors
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
});