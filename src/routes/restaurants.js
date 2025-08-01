import express from 'express';
const router = express.Router();
import restaurantController from '../controllers/restaurantController.js';

// Simple routes
router.get('/', restaurantController.getAllRestaurants);          // GET all restaurants
router.get('/:id', restaurantController.getRestaurantById);       // GET restaurant by ID
router.post('/', restaurantController.createRestaurant);          // CREATE new restaurant
router.get('/:id/orders', restaurantController.getRestaurantOrders); // GET restaurant orders

export default router;
