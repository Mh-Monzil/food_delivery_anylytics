import db from '../config/database.js';

class DriverController {
  // 1. GET all drivers
  async getAllDrivers(req, res) {
    try {
      const query = `
                SELECT driver_id, name, email, phone, vehicle_type, total_deliveries 
                FROM delivery_drivers 
                ORDER BY driver_id DESC
                LIMIT 50
            `;
      const drivers = await db.query(query);

      res.json({
        success: true,
        data: drivers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 2. GET driver by ID
  async getDriverById(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT * FROM delivery_drivers 
                WHERE driver_id = ?
            `;
      const driver = await db.query(query, [id]);

      if (driver.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      res.json({
        success: true,
        data: driver[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 3. CREATE new driver
  async createDriver(req, res) {
    try {
      const { name, email, phone, license_number, vehicle_type } = req.body;
      const query = `
                INSERT INTO delivery_drivers (name, email, phone, license_number, vehicle_type) 
                VALUES (?, ?, ?, ?, ?)
            `;
      const result = await db.query(query, [name, email, phone, license_number, vehicle_type]);

      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        data: { driver_id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 4. Driver deliveries - Simple JOIN
  async getDriverDeliveries(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    o.order_id,
                    o.final_amount,
                    o.order_placed_at,
                    o.actual_delivery_time,
                    r.name as restaurant_name,
                    c.name as customer_name
                FROM orders o
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                JOIN customers c ON o.customer_id = c.customer_id
                WHERE o.driver_id = ?
                ORDER BY o.order_placed_at DESC
                LIMIT 20
            `;
      const deliveries = await db.query(query, [id]);

      res.json({
        success: true,
        data: deliveries
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 5. GET driver shifts (uses driver_shifts and delivery_zones tables)
  async getDriverShifts(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    ds.shift_id,
                    ds.shift_start,
                    ds.shift_end,
                    ds.deliveries_completed,
                    ds.total_earnings,
                    ds.status,
                    dz.zone_name,
                    dz.area_code
                FROM driver_shifts ds
                JOIN delivery_zones dz ON ds.zone_id = dz.zone_id
                WHERE ds.driver_id = ?
                ORDER BY ds.shift_start DESC
                LIMIT 10
            `;
      const shifts = await db.query(query, [id]);

      res.json({
        success: true,
        data: shifts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 6. START new shift
  async startShift(req, res) {
    try {
      const { driver_id, zone_id } = req.body;

      const query = `
                INSERT INTO driver_shifts (driver_id, zone_id, shift_start, status) 
                VALUES (?, ?, NOW(), 'active')
            `;
      const result = await db.query(query, [driver_id, zone_id]);

      res.status(201).json({
        success: true,
        message: 'Shift started successfully',
        data: { shift_id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: Simple view example - Driver performance summary  
  async getDriverPerformance(req, res) {
    try {
      const query = `
        SELECT 
          dd.driver_id,
          dd.name,
          dd.vehicle_type,
          dd.rating,
          COUNT(o.order_id) as total_deliveries,
          AVG(o.customer_rating) as avg_customer_rating,
          SUM(o.delivery_fee) * 0.8 as estimated_earnings
        FROM delivery_drivers dd
        LEFT JOIN orders o ON dd.driver_id = o.driver_id AND o.order_status = 'delivered'
        GROUP BY dd.driver_id, dd.name, dd.vehicle_type, dd.rating
        ORDER BY total_deliveries DESC
      `;
      const performance = await db.query(query);

      res.json({
        success: true,
        data: performance,
        message: 'Driver performance summary'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: Simple procedure example - Find best drivers for zone
  async getBestDriversForZone(req, res) {
    try {
      const { zoneId } = req.params;
      const query = `
        SELECT 
          dd.driver_id,
          dd.name,
          dd.rating,
          COUNT(o.order_id) as zone_deliveries,
          AVG(o.customer_rating) as avg_customer_rating
        FROM delivery_drivers dd
        LEFT JOIN orders o ON dd.driver_id = o.driver_id 
          AND o.zone_id = ? 
          AND o.order_status = 'delivered'
        WHERE dd.is_active = TRUE
        GROUP BY dd.driver_id, dd.name, dd.rating
        HAVING zone_deliveries > 0
        ORDER BY dd.rating DESC, avg_customer_rating DESC
        LIMIT 5
      `;
      const bestDrivers = await db.query(query, [zoneId]);

      res.json({
        success: true,
        data: bestDrivers,
        message: `Top 5 drivers for zone ${zoneId}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new DriverController();
