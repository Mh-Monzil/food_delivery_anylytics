import express from 'express';
const router = express.Router();
import driverController from '../controllers/driverController.js';

// Simple routes
router.get('/', driverController.getAllDrivers);              // GET all drivers
router.get('/:id', driverController.getDriverById);           // GET driver by ID
router.post('/', driverController.createDriver);              // CREATE new driver
router.get('/:id/deliveries', driverController.getDriverDeliveries); // GET driver deliveries
router.get('/:id/shifts', driverController.getDriverShifts);  // GET driver shifts
router.post('/shifts', driverController.startShift);          // START new shift

export default router;
