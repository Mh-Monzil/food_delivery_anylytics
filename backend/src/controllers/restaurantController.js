import db from '../config/database.js';

class RestaurantController {
  async getAllRestaurants(req, res) {
    try {
      const query = `
                SELECT 
                    restaurant_id, 
                    name, 
                    cuisine_type, 
                    address, 
                    phone, 
                    email,
                    rating,
                    total_reviews,
                    is_active
                FROM restaurants 
                WHERE is_active = 1
                ORDER BY restaurant_id DESC
                LIMIT 50
            `;
      const restaurants = await db.query(query);

      res.json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT * FROM restaurants 
                WHERE restaurant_id = ?
            `;
      const restaurant = await db.query(query, [id]);

      if (restaurant.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }

      res.json({
        success: true,
        data: restaurant[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createRestaurant(req, res) {
    try {
      const { name, cuisine_type, address, phone, email } = req.body;
      const query = `
                INSERT INTO restaurants (name, cuisine_type, address, phone, email) 
                VALUES (?, ?, ?, ?, ?)
            `;
      const result = await db.query(query, [name, cuisine_type, address, phone, email]);

      res.status(201).json({
        success: true,
        message: 'Restaurant created successfully',
        data: { restaurant_id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRestaurantOrders(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    o.order_id,
                    c.name as customer_name,
                    o.final_amount,
                    o.order_status,
                    o.order_placed_at
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                WHERE o.restaurant_id = ?
                ORDER BY o.order_placed_at DESC
                LIMIT 50
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

  async getRestaurantPerformance(req, res) {
    try {
      const query = `
        SELECT 
          r.restaurant_id,
          r.name,
          r.cuisine_type,
          r.rating,
          COUNT(o.order_id) as total_orders,
          SUM(CASE WHEN o.order_status = 'delivered' THEN o.final_amount ELSE 0 END) as total_revenue,
          AVG(CASE WHEN o.order_status = 'delivered' THEN o.final_amount END) as avg_order_value,
          AVG(o.customer_rating) as avg_customer_rating
        FROM restaurants r
        LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id
        WHERE r.is_active = TRUE
        GROUP BY r.restaurant_id, r.name, r.cuisine_type, r.rating
        ORDER BY total_revenue DESC
      `;
      const performance = await db.query(query);

      res.json({
        success: true,
        data: performance,
        message: 'Restaurant performance summary'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;

      // Start transaction to handle restaurant deactivation and order cancellation
      const conn = await db.getConnection();
      await conn.beginTransaction();

      try {
        // Check if restaurant exists and is active
        const [restaurant] = await conn.execute(
          'SELECT is_active FROM restaurants WHERE restaurant_id = ? FOR UPDATE',
          [id]
        );

        if (restaurant.length === 0 || restaurant[0].is_active === 0) {
          await conn.rollback();
          conn.release();
          return res.status(404).json({
            success: false,
            message: 'Restaurant not found or already inactive'
          });
        }

        // Cancel all pending/preparing orders for this restaurant
        const [cancelOrdersResult] = await conn.execute(
          `UPDATE orders 
            SET order_status = 'cancelled' 
            WHERE restaurant_id = ? 
            AND order_status IN ('pending', 'confirmed', 'preparing', 'ready')`,
          [id]
        );

        // Soft delete: set is_active = 0
        await conn.execute(
          'UPDATE restaurants SET is_active = 0 WHERE restaurant_id = ?',
          [id]
        );

        await conn.commit();
        conn.release();

        res.json({
          success: true,
          message: 'Restaurant deactivated successfully',
          data: {
            restaurant_id: Number(id),
            cancelled_orders: cancelOrdersResult.affectedRows
          }
        });
      } catch (error) {
        await conn.rollback();
        conn.release();
        throw error;
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDeletedRestaurants(req, res) {
    try {
      const query = `
        SELECT 
          *
        FROM deleted_restaurants
        ORDER BY deleted_at DESC
      `;

      const deletedRestaurants = await db.query(query);

      res.json({
        success: true,
        data: deletedRestaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new RestaurantController();
