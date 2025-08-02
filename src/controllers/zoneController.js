import db from '../config/database.js';

class ZoneController {
    // 1. GET all delivery zones
    async getAllZones(req, res) {
        try {
            const query = `
                SELECT 
                    zone_id,
                    zone_name,
                    area_code,
                    base_delivery_fee,
                    max_delivery_distance_km,
                    is_active
                FROM delivery_zones 
                WHERE is_active = 1
                ORDER BY zone_name
            `;
            const zones = await db.query(query);
            
            res.json({
                success: true,
                data: zones
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2. GET zone by ID
    async getZoneById(req, res) {
        try {
            const { id } = req.params;
            const query = `SELECT * FROM delivery_zones WHERE zone_id = ?`;
            const zones = await db.query(query, [id]);
            
            if (zones.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Zone not found'
                });
            }
            
            res.json({
                success: true,
                data: zones[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 3. CREATE new zone
    async createZone(req, res) {
        try {
            const { zone_name, area_code, base_delivery_fee, max_delivery_distance_km } = req.body;
            
            const query = `
                INSERT INTO delivery_zones (zone_name, area_code, base_delivery_fee, max_delivery_distance_km) 
                VALUES (?, ?, ?, ?)
            `;
            const result = await db.query(query, [zone_name, area_code, base_delivery_fee, max_delivery_distance_km]);
            
            res.status(201).json({
                success: true,
                message: 'Zone created successfully',
                data: { zone_id: result.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4. GET zone orders (simple JOIN)
    async getZoneOrders(req, res) {
        try {
            const { id } = req.params;
            const query = `
                SELECT 
                    o.order_id,
                    c.name as customer_name,
                    r.name as restaurant_name,
                    o.final_amount,
                    o.order_status,
                    dz.zone_name
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                JOIN delivery_zones dz ON o.zone_id = dz.zone_id
                WHERE dz.zone_id = ?
                ORDER BY o.order_placed_at DESC
                LIMIT 20
            `;
            const orders = await db.query(query, [id]);
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // NEW: Simple view example - Zone performance summary
    async getZonePerformance(req, res) {
        try {
            const query = `
                SELECT 
                    dz.zone_id,
                    dz.zone_name,
                    dz.base_delivery_fee,
                    COUNT(o.order_id) as total_orders,
                    SUM(CASE WHEN o.order_status = 'delivered' THEN o.final_amount ELSE 0 END) as total_revenue,
                    COUNT(CASE WHEN o.order_status = 'delivered' THEN 1 END) as delivered_orders,
                    COUNT(CASE WHEN o.order_status = 'cancelled' THEN 1 END) as cancelled_orders,
                    ROUND((COUNT(CASE WHEN o.order_status = 'delivered' THEN 1 END) * 100.0 / COUNT(o.order_id)), 2) as success_rate
                FROM delivery_zones dz
                LEFT JOIN orders o ON dz.zone_id = o.zone_id
                WHERE dz.is_active = TRUE
                GROUP BY dz.zone_id, dz.zone_name, dz.base_delivery_fee
                ORDER BY total_revenue DESC
            `;
            const performance = await db.query(query);

            res.json({
                success: true,
                data: performance,
                message: 'Zone performance summary'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // NEW: Simple procedure example - Peak hours in zone
    async getZonePeakHours(req, res) {
        try {
            const { id } = req.params;
            const query = `
                SELECT 
                    HOUR(o.order_placed_at) as hour_of_day,
                    COUNT(o.order_id) as order_count,
                    AVG(o.final_amount) as avg_order_value,
                    CASE 
                        WHEN COUNT(o.order_id) > 50 THEN 'High Demand'
                        WHEN COUNT(o.order_id) > 20 THEN 'Medium Demand'
                        ELSE 'Low Demand'
                    END as demand_level
                FROM orders o
                WHERE o.zone_id = ?
                GROUP BY HOUR(o.order_placed_at)
                ORDER BY order_count DESC
            `;
            const peakHours = await db.query(query, [id]);

            res.json({
                success: true,
                data: peakHours,
                message: `Peak hours analysis for zone ${id}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new ZoneController();
