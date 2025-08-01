import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Simple Food Delivery API running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}/api`);
  console.log('🔗 Available endpoints:');
  console.log('   👥 Customers: /api/customers');
  console.log('   🚗 Drivers: /api/drivers');
  console.log('   📦 Orders: /api/orders');
  console.log('   🏪 Restaurants: /api/restaurants');
});
