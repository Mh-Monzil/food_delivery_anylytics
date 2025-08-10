import express from 'express';
const router = express.Router();
import restaurantController from '../controllers/restaurantController.js';

// Simple routes
router.get('/', restaurantController.getAllRestaurants);          // GET all restaurants
router.get('/performance', restaurantController.getRestaurantPerformance); // NEW: Restaurant performance view
router.get('/deleted', restaurantController.getDeletedRestaurants); // GET deleted restaurants
router.get('/:id', restaurantController.getRestaurantById);       // GET restaurant by ID
router.post('/', restaurantController.createRestaurant);          // CREATE new restaurant
router.get('/:id/orders', restaurantController.getRestaurantOrders); // GET restaurant orders
router.delete('/:id', restaurantController.deleteRestaurant);     // DELETE restaurant by ID

export default router;
