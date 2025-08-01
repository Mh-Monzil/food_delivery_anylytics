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
}

export default new ZoneController();
