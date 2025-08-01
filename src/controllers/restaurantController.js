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
}

export default new RestaurantController();
