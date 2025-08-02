import express from 'express';
const router = express.Router();
import customerController from '../controllers/customerController.js';

// Simple routes - no complex validation
router.get('/', customerController.getAllCustomers);           // GET all customers
router.get('/summary', customerController.getCustomerSummary); // NEW: Customer summary view
router.get('/:id', customerController.getCustomerById);        // GET customer by ID  
router.get('/:id/history', customerController.getCustomerOrderHistory); // NEW: Order history
router.post('/', customerController.createCustomer);           // CREATE new customer  
router.get('/:id/orders', customerController.getCustomerOrders); // GET customer orders

export default router;
