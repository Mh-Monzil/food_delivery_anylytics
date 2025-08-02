import db from '../config/database.js';

class RestaurantController {
  // 1. GET all restaurants
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

  // 2. GET restaurant by ID
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

  // 3. CREATE new restaurant
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

  // 4. Restaurant orders - Simple JOIN
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

  // NEW: Simple view example - Restaurant performance
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

  // NEW: Simple function example - Calculate commission  
  async calculateCommission(req, res) {
    try {
      const { id } = req.params;
      const { commission_rate = 15 } = req.body; // Default 15%
      
      const query = `
        SELECT 
          r.name,
          COUNT(o.order_id) as total_orders,
          SUM(CASE WHEN o.order_status = 'delivered' THEN o.final_amount ELSE 0 END) as total_revenue,
          SUM(CASE WHEN o.order_status = 'delivered' THEN o.final_amount ELSE 0 END) * (? / 100) as commission_amount
        FROM restaurants r
        LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id
        WHERE r.restaurant_id = ?
        GROUP BY r.restaurant_id, r.name
      `;
      const result = await db.query(query, [commission_rate, id]);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }

      res.json({
        success: true,
        data: result[0],
        message: `Commission calculated at ${commission_rate}%`
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
