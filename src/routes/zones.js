import express from 'express';
const router = express.Router();
import zoneController from '../controllers/zoneController.js';

// Simple routes
router.get('/', zoneController.getAllZones);
router.get('/:id', zoneController.getZoneById);
router.post('/', zoneController.createZone);
router.get('/:id/orders', zoneController.getZoneOrders);

export default router;
