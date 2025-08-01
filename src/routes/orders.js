import express from 'express';
const router = express.Router();
import orderController from '../controllers/orderController.js';

// Simple routes
router.get('/', orderController.getAllOrders);                    // GET all orders
router.get('/:id', orderController.getOrderById);                 // GET order by ID
router.post('/', orderController.createOrder);                    // CREATE new order
router.put('/:id/status', orderController.updateOrderStatus);     // UPDATE order status
router.get('/status/:status', orderController.getOrdersByStatus); // GET orders by status
router.get('/:id/items', orderController.getOrderItems);          // GET order items
router.post('/items', orderController.addOrderItem);              // ADD item to order

export default router;
