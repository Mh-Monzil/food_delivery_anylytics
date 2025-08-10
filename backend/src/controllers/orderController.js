import db from '../config/database.js';

class OrderController {
  // 1. GET all orders with basic info
  async getAllOrders(req, res) {
    try {
      const query = `
                SELECT 
                    o.order_id,
                    c.name as customer_name,
                    r.name as restaurant_name,
                    o.final_amount,
                    o.order_status,
                    o.order_placed_at
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                ORDER BY o.order_placed_at DESC
                LIMIT 100
            `;
      const orders = await db.query(query);

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

  // 2. GET order by ID with details
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    o.*,
                    c.name as customer_name,
                    c.phone as customer_phone,
                    r.name as restaurant_name,
                    r.address as restaurant_address,
                    d.name as driver_name
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                LEFT JOIN delivery_drivers d ON o.driver_id = d.driver_id
                WHERE o.order_id = ?
            `;
      const order = await db.query(query, [id]);

      if (order.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 3. CREATE new order
  async createOrder(req, res) {
    try {
      const { customer_id, restaurant_id, total_amount, delivery_fee } = req.body;

      // Check if restaurant is active before creating order
      const restaurantCheck = await db.query(
        'SELECT is_active FROM restaurants WHERE restaurant_id = ?',
        [restaurant_id]
      );

      if (restaurantCheck.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }

      if (restaurantCheck[0].is_active === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot place order: restaurant is currently inactive'
        });
      }

      const final_amount = total_amount + delivery_fee;

      const query = `
                INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_fee, final_amount, order_status) 
                VALUES (?, ?, ?, ?, ?, 'pending')
            `;
      const result = await db.query(query, [customer_id, restaurant_id, total_amount, delivery_fee, final_amount]);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order_id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 4. UPDATE order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const query = `
                UPDATE orders 
                SET order_status = ? 
                WHERE order_id = ?
            `;
      await db.query(query, [status, id]);

      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 5. Get orders by status
  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const query = `
                SELECT 
                    o.order_id,
                    c.name as customer_name,
                    r.name as restaurant_name,
                    o.final_amount,
                    o.order_placed_at
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                WHERE o.order_status = ?
                ORDER BY o.order_placed_at DESC
            `;
      const orders = await db.query(query, [status]);

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

  // 5. GET order items (uses order_items table)
  async getOrderItems(req, res) {
    try {
      const { id } = req.params;
      const query = `
                SELECT 
                    oi.item_id,
                    oi.item_name,
                    oi.item_category,
                    oi.quantity,
                    oi.unit_price,
                    oi.total_price,
                    o.order_id
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.order_id
                WHERE o.order_id = ?
            `;
      const items = await db.query(query, [id]);

      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 6. ADD item to order
  async addOrderItem(req, res) {
    try {
      const { order_id, item_name, item_category, quantity, unit_price } = req.body;
      const total_price = quantity * unit_price;

      const query = `
                INSERT INTO order_items (order_id, item_name, item_category, quantity, unit_price, total_price) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
      const result = await db.query(query, [order_id, item_name, item_category, quantity, unit_price, total_price]);

      res.status(201).json({
        success: true,
        message: 'Item added to order successfully',
        data: { item_id: result.insertId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: Simple view example - Daily sales summary
  async getDailySales(req, res) {
    try {
      const query = `
        SELECT 
          DATE(order_placed_at) as order_date,
          COUNT(*) as total_orders,
          SUM(CASE WHEN order_status = 'delivered' THEN final_amount ELSE 0 END) as total_revenue,
          COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled_orders
        FROM orders 
        WHERE order_placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(order_placed_at)
        ORDER BY order_date DESC
      `;
      const dailySales = await db.query(query);

      res.json({
        success: true,
        data: dailySales,
        message: 'Daily sales summary for last 7 days'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: Simple trigger example - Update order status (triggers will run automatically)
  async completeOrder(req, res) {
    try {
      const { id } = req.params;

      // This update will trigger automatic updates to customer stats
      const query = `
        UPDATE orders 
        SET 
          order_status = 'delivered',
          actual_delivery_time = NOW()
        WHERE order_id = ? AND order_status != 'delivered'
      `;

      const result = await db.query(query, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or already completed'
        });
      }

      res.json({
        success: true,
        message: 'Order completed - customer stats updated automatically by triggers',
        data: { order_id: id, status: 'delivered' }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new OrderController();
