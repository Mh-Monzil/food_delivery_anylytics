import db from '../config/database.js';

class CustomerController {
    // 1. GET all customers - Simple SELECT
    async getAllCustomers(req, res) {
        try {
            const query = `
                SELECT customer_id, name, email, phone, total_orders, total_spent 
                FROM customers 
                ORDER BY customer_id DESC
                LIMIT 50
            `;
            const customers = await db.query(query);
            
            res.json({
                success: true,
                data: customers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2. GET customer by ID - Simple SELECT with WHERE
    async getCustomerById(req, res) {
        try {
            const { id } = req.params;
            const query = `
                SELECT * FROM customers 
                WHERE customer_id = ?
            `;
            const customer = await db.query(query, [id]);
            
            if (customer.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            
            res.json({
                success: true,
                data: customer[0]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 3. CREATE new customer - Simple INSERT
    async createCustomer(req, res) {
        try {
            const { name, email, phone, address } = req.body;
            const query = `
                INSERT INTO customers (name, email, phone, address) 
                VALUES (?, ?, ?, ?)
            `;
            const result = await db.query(query, [name, email, phone, address]);
            
            res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                data: { customer_id: result.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4. Customer orders - Simple JOIN
    async getCustomerOrders(req, res) {
        try {
            const { id } = req.params;
            const query = `
                SELECT 
                    o.order_id,
                    o.final_amount,
                    o.order_placed_at,
                    r.name as restaurant_name
                FROM orders o
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                WHERE o.customer_id = ?
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

    // NEW: Simple view example - Customer summary
    async getCustomerSummary(req, res) {
        try {
            const query = `
                SELECT 
                    customer_id,
                    name,
                    total_orders,
                    total_spent,
                    CASE 
                        WHEN total_orders >= 20 THEN 'VIP'
                        WHEN total_orders >= 10 THEN 'Premium'
                        WHEN total_orders >= 5 THEN 'Regular'
                        ELSE 'New'
                    END as customer_tier
                FROM customers 
                ORDER BY total_spent DESC
            `;
            const customers = await db.query(query);
            
            res.json({
                success: true,
                data: customers,
                message: 'Customer summary with tiers'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // NEW: Simple procedure example - Get customer order history
    async getCustomerOrderHistory(req, res) {
        try {
            const { id } = req.params;
            const query = `
                SELECT 
                    o.order_id,
                    r.name as restaurant_name,
                    o.final_amount,
                    o.order_status,
                    o.order_placed_at
                FROM orders o
                JOIN restaurants r ON o.restaurant_id = r.restaurant_id
                WHERE o.customer_id = ?
                ORDER BY o.order_placed_at DESC
                LIMIT 10
            `;
            const orders = await db.query(query, [id]);
            
            res.json({
                success: true,
                data: orders,
                message: `Order history for customer ${id}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new CustomerController();
