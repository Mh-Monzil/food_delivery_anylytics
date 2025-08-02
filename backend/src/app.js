import express from 'express';
import cors from 'cors';

// Import simple routes
import customerRoutes from './routes/customers.js';
import driverRoutes from './routes/drivers.js';
import orderRoutes from './routes/orders.js';
import restaurantRoutes from './routes/restaurants.js';
import zoneRoutes from './routes/zones.js';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple routes
app.use('/api/customers', customerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/zones', zoneRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple Food Delivery API is running'
  });
});

// Welcome message
app.get('/api', (req, res) => {
  res.json({
    message: '🍕 Simple Food Delivery API',
    endpoints: {
      customers: '/api/customers',
      drivers: '/api/drivers',
      orders: '/api/orders',
      restaurants: '/api/restaurants',
      zones: '/api/zones'
    }
  });
});

export default app;
