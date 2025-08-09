-- Sample Data for Food Delivery Analytics Platform
USE food_delivery_analytics;

-- Insert sample restaurants
INSERT INTO restaurants (name, cuisine_type, address, phone, email, rating, total_reviews, commission_rate, is_active) VALUES
('Pizza Palace', 'Italian', '123 Main St, Downtown', '555-0101', 'info@pizzapalace.com', 4.5, 1250, 12.00, TRUE),
('Dragon Wok', 'Chinese', '456 Oak Ave, Chinatown', '555-0102', 'orders@dragonwok.com', 4.3, 890, 15.00, TRUE),
('Burger Barn', 'American', '789 Pine Rd, Uptown', '555-0103', 'contact@burgerbarn.com', 4.1, 2100, 18.00, TRUE),
('Spice Garden', 'Indian', '321 Elm St, Little India', '555-0104', 'hello@spicegarden.com', 4.7, 650, 14.00, TRUE),
('Taco Fiesta', 'Mexican', '654 Cedar Ln, Southside', '555-0105', 'info@tacofiesta.com', 4.2, 1800, 16.00, TRUE),
('Sushi Zen', 'Japanese', '987 Birch Blvd, Eastside', '555-0106', 'orders@sushizen.com', 4.8, 420, 20.00, TRUE),
('Mediterranean Delight', 'Mediterranean', '147 Maple Dr, Westside', '555-0107', 'info@meddelight.com', 4.4, 780, 13.50, TRUE),
('BBQ Junction', 'American', '258 Walnut St, Downtown', '555-0108', 'orders@bbqjunction.com', 4.0, 1500, 17.00, TRUE),
('Thai Lotus', 'Thai', '369 Cherry Ave, Midtown', '555-0109', 'hello@thailotus.com', 4.6, 920, 15.50, TRUE),
('Coffee & More', 'Cafe', '741 Spruce St, University District', '555-0110', 'info@coffeemore.com', 4.3, 680, 11.00, TRUE);

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, date_of_birth, preferred_cuisine, total_orders, total_spent, loyalty_points) VALUES
('John Smith', 'john.smith@email.com', '555-1001', '100 Residential St', '1985-03-15', 'Italian', 45, 1350.75, 675),
('Sarah Johnson', 'sarah.j@email.com', '555-1002', '200 Garden Ave', '1990-07-22', 'Chinese', 32, 890.50, 445),
('Michael Brown', 'mike.brown@email.com', '555-1003', '300 Sunset Blvd', '1978-11-08', 'American', 67, 2100.25, 1050),
('Emily Davis', 'emily.davis@email.com', '555-1004', '400 River Rd', '1992-05-30', 'Indian', 28, 750.80, 375),
('David Wilson', 'david.w@email.com', '555-1005', '500 Hill St', '1988-09-12', 'Mexican', 38, 980.40, 490),
('Lisa Garcia', 'lisa.garcia@email.com', '555-1006', '600 Lake Dr', '1995-01-18', 'Japanese', 15, 650.20, 325),
('James Miller', 'james.miller@email.com', '555-1007', '700 Park Ave', '1983-04-25', 'Mediterranean', 22, 590.60, 295),
('Anna Rodriguez', 'anna.r@email.com', '555-1008', '800 Valley Rd', '1987-12-03', 'American', 51, 1680.90, 840),
('Robert Taylor', 'robert.taylor@email.com', '555-1009', '900 Creek Ln', '1991-08-14', 'Thai', 29, 745.30, 372),
('Maria Martinez', 'maria.m@email.com', '555-1010', '1000 Forest St', '1989-10-27', 'Cafe', 18, 320.45, 160),
('Christopher Lee', 'chris.lee@email.com', '555-1011', '1100 Beach Ave', '1993-06-09', 'Italian', 41, 1250.80, 625),
('Jennifer White', 'jen.white@email.com', '555-1012', '1200 Mountain Dr', '1986-02-14', 'Chinese', 35, 920.60, 460),
('Daniel Anderson', 'dan.anderson@email.com', '555-1013', '1300 Desert Rd', '1994-11-21', 'Mexican', 26, 678.40, 339),
('Michelle Thomas', 'michelle.t@email.com', '555-1014', '1400 Prairie St', '1982-09-05', 'Indian', 33, 895.70, 447),
('Kevin Jackson', 'kevin.jackson@email.com', '555-1015', '1500 Canyon Ave', '1990-04-17', 'Japanese', 19, 780.25, 390);

-- Insert sample delivery drivers
INSERT INTO delivery_drivers (name, email, phone, license_number, vehicle_type, rating, total_deliveries, is_active) VALUES
('Alex Turner', 'alex.turner@delivery.com', '555-2001', 'DL001234', 'scooter', 4.6, 1250, TRUE),
('Maria Gonzalez', 'maria.gonzalez@delivery.com', '555-2002', 'DL002345', 'bike', 4.8, 980, TRUE),
('Tommy Chen', 'tommy.chen@delivery.com', '555-2003', 'DL003456', 'car', 4.4, 1580, TRUE),
('Sarah Kim', 'sarah.kim@delivery.com', '555-2004', 'DL004567', 'scooter', 4.7, 1100, TRUE),
('Mike Johnson', 'mike.johnson@delivery.com', '555-2005', 'DL005678', 'bike', 4.5, 890, TRUE),
('Lisa Wang', 'lisa.wang@delivery.com', '555-2006', 'DL006789', 'car', 4.3, 1420, TRUE),
('Carlos Rodriguez', 'carlos.r@delivery.com', '555-2007', 'DL007890', 'scooter', 4.9, 760, TRUE),
('Amy Foster', 'amy.foster@delivery.com', '555-2008', 'DL008901', 'bike', 4.6, 1050, TRUE),
('David Park', 'david.park@delivery.com', '555-2009', 'DL009012', 'car', 4.2, 1680, TRUE),
('Rachel Green', 'rachel.green@delivery.com', '555-2010', 'DL010123', 'scooter', 4.8, 920, TRUE);

-- Insert sample delivery zones
INSERT INTO delivery_zones (zone_name, area_code, base_delivery_fee, surge_multiplier, max_delivery_distance_km, is_active) VALUES
('Downtown Core', 'DT01', 3.99, 1.0, 5.0, TRUE),
('Uptown', 'UT01', 4.49, 1.2, 7.5, TRUE),
('Eastside', 'ES01', 3.79, 1.1, 6.0, TRUE),
('Westside', 'WS01', 4.29, 1.3, 8.0, TRUE),
('Southside', 'SS01', 3.99, 1.0, 5.5, TRUE),
('Northside', 'NS01', 4.69, 1.4, 9.0, TRUE),
('University District', 'UD01', 2.99, 0.9, 3.5, TRUE),
('Business District', 'BD01', 5.49, 1.5, 4.0, TRUE),
('Residential Hills', 'RH01', 4.99, 1.2, 10.0, TRUE),
('Waterfront', 'WF01', 5.29, 1.3, 6.5, TRUE);

-- Insert sample orders (recent data for analytics)
INSERT INTO orders (customer_id, restaurant_id, driver_id, zone_id, order_status, total_amount, delivery_fee, tax_amount, discount_amount, final_amount, payment_method, order_placed_at, estimated_delivery_time, actual_delivery_time, customer_rating, customer_review) VALUES
-- Recent orders for analytics (last 30 days)
(1, 1, 1, 1, 'delivered', 28.50, 3.99, 2.28, 0.00, 34.77, 'card', '2025-07-28 18:30:00', '2025-07-28 19:15:00', '2025-07-28 19:10:00', 5, 'Great pizza, fast delivery!'),
(2, 2, 2, 2, 'delivered', 35.80, 4.49, 2.86, 5.00, 38.15, 'digital_wallet', '2025-07-28 19:15:00', '2025-07-28 20:00:00', '2025-07-28 19:55:00', 4, 'Good food, slightly late'),
(3, 3, 3, 3, 'delivered', 22.90, 3.79, 1.83, 0.00, 28.52, 'cash', '2025-07-28 12:45:00', '2025-07-28 13:30:00', '2025-07-28 13:25:00', 5, 'Perfect lunch order'),
(4, 4, 4, 4, 'delivered', 41.20, 4.29, 3.30, 8.00, 40.79, 'card', '2025-07-27 20:00:00', '2025-07-27 20:45:00', '2025-07-27 20:40:00', 5, 'Amazing Indian food!'),
(5, 5, 5, 5, 'delivered', 19.75, 3.99, 1.58, 0.00, 25.32, 'digital_wallet', '2025-07-27 13:20:00', '2025-07-27 14:05:00', '2025-07-27 14:00:00', 4, 'Good tacos'),
(1, 6, 6, 1, 'delivered', 67.30, 3.99, 5.38, 10.00, 66.67, 'card', '2025-07-26 19:45:00', '2025-07-26 20:30:00', '2025-07-26 20:25:00', 5, 'Best sushi in town!'),
(2, 7, 7, 2, 'delivered', 31.40, 4.49, 2.51, 0.00, 38.40, 'cash', '2025-07-26 18:00:00', '2025-07-26 18:45:00', '2025-07-26 18:50:00', 4, 'Fresh and healthy'),
(3, 8, 8, 3, 'delivered', 45.60, 3.79, 3.65, 5.00, 48.04, 'digital_wallet', '2025-07-25 17:30:00', '2025-07-25 18:15:00', '2025-07-25 18:10:00', 5, 'Great BBQ!'),
(4, 9, 9, 4, 'delivered', 26.80, 4.29, 2.14, 0.00, 33.23, 'card', '2025-07-25 19:20:00', '2025-07-25 20:05:00', '2025-07-25 20:00:00', 4, 'Spicy and delicious'),
(5, 10, 10, 5, 'delivered', 12.95, 3.99, 1.04, 0.00, 17.98, 'cash', '2025-07-25 08:30:00', '2025-07-25 09:15:00', '2025-07-25 09:10:00', 5, 'Perfect morning coffee'),
-- More orders for better analytics data
(6, 1, 1, 6, 'delivered', 33.75, 4.69, 2.70, 0.00, 41.14, 'card', '2025-07-24 18:45:00', '2025-07-24 19:30:00', '2025-07-24 19:35:00', 4, 'Good pizza'),
(7, 2, 2, 7, 'delivered', 28.90, 2.99, 2.31, 3.00, 31.20, 'digital_wallet', '2025-07-24 12:15:00', '2025-07-24 13:00:00', '2025-07-24 12:55:00', 5, 'Quick lunch delivery'),
(8, 3, 3, 8, 'delivered', 52.40, 5.49, 4.19, 0.00, 62.08, 'card', '2025-07-23 19:00:00', '2025-07-23 19:45:00', '2025-07-23 19:40:00', 5, 'Business lunch was great'),
(9, 4, 4, 9, 'delivered', 38.20, 4.99, 3.06, 6.00, 40.25, 'cash', '2025-07-23 20:30:00', '2025-07-23 21:15:00', '2025-07-23 21:20:00', 4, 'Spicy and good'),
(10, 5, 5, 10, 'delivered', 24.60, 5.29, 1.97, 0.00, 31.86, 'digital_wallet', '2025-07-22 18:15:00', '2025-07-22 19:00:00', '2025-07-22 18:58:00', 5, 'Waterfront delivery was scenic'),
-- Additional orders for peak hour analysis
(11, 1, 6, 1, 'delivered', 42.30, 3.99, 3.38, 5.00, 44.67, 'card', '2025-07-22 12:00:00', '2025-07-22 12:45:00', '2025-07-22 12:42:00', 5, 'Lunch rush order'),
(12, 2, 7, 2, 'delivered', 29.85, 4.49, 2.39, 0.00, 36.73, 'digital_wallet', '2025-07-21 19:30:00', '2025-07-21 20:15:00', '2025-07-21 20:18:00', 4, 'Dinner time order'),
(13, 3, 8, 3, 'delivered', 36.70, 3.79, 2.94, 4.00, 39.43, 'cash', '2025-07-21 12:30:00', '2025-07-21 13:15:00', '2025-07-21 13:12:00', 5, 'Perfect timing'),
(14, 4, 9, 4, 'delivered', 48.90, 4.29, 3.91, 7.00, 50.10, 'card', '2025-07-20 18:45:00', '2025-07-20 19:30:00', '2025-07-20 19:28:00', 5, 'Excellent curry'),
(15, 5, 10, 5, 'delivered', 21.40, 3.99, 1.71, 0.00, 27.10, 'digital_wallet', '2025-07-20 13:00:00', '2025-07-20 13:45:00', '2025-07-20 13:43:00', 4, 'Good Mexican food');

-- Insert sample order items
INSERT INTO order_items (order_id, item_name, item_category, quantity, unit_price, total_price, special_requests) VALUES
-- Order 1 items
(1, 'Margherita Pizza Large', 'Pizza', 1, 18.99, 18.99, 'Extra cheese'),
(1, 'Garlic Bread', 'Appetizer', 1, 6.99, 6.99, NULL),
(1, 'Coke 500ml', 'Beverage', 1, 2.52, 2.52, NULL),
-- Order 2 items
(2, 'Sweet & Sour Pork', 'Main Course', 1, 16.80, 16.80, 'Less spicy'),
(2, 'Fried Rice', 'Rice', 1, 12.50, 12.50, NULL),
(2, 'Spring Rolls (4pc)', 'Appetizer', 1, 6.50, 6.50, NULL),
-- Order 3 items
(3, 'Classic Burger', 'Burger', 1, 12.90, 12.90, 'No onions'),
(3, 'French Fries Large', 'Sides', 1, 7.50, 7.50, NULL),
(3, 'Milkshake Vanilla', 'Beverage', 1, 2.50, 2.50, NULL),
-- Order 4 items
(4, 'Chicken Tikka Masala', 'Curry', 1, 18.20, 18.20, 'Medium spice'),
(4, 'Basmati Rice', 'Rice', 1, 4.50, 4.50, NULL),
(4, 'Naan Bread', 'Bread', 2, 3.50, 7.00, NULL),
(4, 'Mango Lassi', 'Beverage', 1, 4.50, 4.50, NULL),
(4, 'Samosas (3pc)', 'Appetizer', 1, 6.50, 6.50, NULL),
-- Order 5 items
(5, 'Beef Tacos (3pc)', 'Tacos', 1, 11.75, 11.75, 'Extra salsa'),
(5, 'Guacamole & Chips', 'Appetizer', 1, 8.00, 8.00, NULL);

-- Insert driver shifts data
INSERT INTO driver_shifts (driver_id, zone_id, shift_start, shift_end, deliveries_completed, total_distance_km, total_earnings, fuel_cost, status) VALUES
-- Recent shifts for earnings analysis
(1, 1, '2025-07-28 17:00:00', '2025-07-28 23:00:00', 8, 45.2, 125.50, 18.50, 'ended'),
(2, 2, '2025-07-28 18:00:00', '2025-07-29 00:00:00', 6, 38.7, 98.75, 15.20, 'ended'),
(3, 3, '2025-07-28 11:00:00', '2025-07-28 19:00:00', 12, 67.5, 185.25, 22.80, 'ended'),
(4, 4, '2025-07-27 19:00:00', '2025-07-28 01:00:00', 7, 52.3, 142.80, 19.90, 'ended'),
(5, 5, '2025-07-27 12:00:00', '2025-07-27 20:00:00', 9, 41.8, 128.40, 16.75, 'ended'),
(6, 6, '2025-07-26 18:00:00', '2025-07-27 02:00:00', 10, 78.6, 195.75, 28.50, 'ended'),
(7, 7, '2025-07-26 17:00:00', '2025-07-27 01:00:00', 5, 23.4, 85.20, 9.80, 'ended'),
(8, 8, '2025-07-25 16:00:00', '2025-07-26 00:00:00', 11, 58.9, 168.90, 24.30, 'ended'),
(9, 9, '2025-07-25 18:00:00', '2025-07-26 02:00:00', 6, 47.2, 138.60, 18.95, 'ended'),
(10, 10, '2025-07-25 07:00:00', '2025-07-25 15:00:00', 4, 28.7, 72.40, 12.20, 'ended'),
-- More shifts for better analytics
(1, 1, '2025-07-24 17:00:00', '2025-07-24 23:00:00', 9, 52.1, 142.30, 20.50, 'ended'),
(2, 2, '2025-07-24 11:00:00', '2025-07-24 19:00:00', 7, 35.6, 105.80, 14.75, 'ended'),
(3, 8, '2025-07-23 18:00:00', '2025-07-24 02:00:00', 8, 44.8, 156.20, 18.90, 'ended'),
(4, 9, '2025-07-23 19:00:00', '2025-07-24 03:00:00', 6, 51.7, 148.50, 21.40, 'ended'),
(5, 10, '2025-07-22 17:00:00', '2025-07-23 01:00:00', 5, 32.4, 118.75, 13.60, 'ended');

-- Update customer totals based on orders
UPDATE customers c 
SET total_orders = (
    SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id AND o.order_status = 'delivered'
),
total_spent = (
    SELECT COALESCE(SUM(o.final_amount), 0) FROM orders o WHERE o.customer_id = c.customer_id AND o.order_status = 'delivered'
),
loyalty_points = (
    SELECT COALESCE(SUM(o.final_amount), 0) * 5 FROM orders o WHERE o.customer_id = c.customer_id AND o.order_status = 'delivered'
);

-- Update restaurant totals based on orders
UPDATE restaurants r 
SET total_reviews = (
    SELECT COUNT(*) FROM orders o WHERE o.restaurant_id = r.restaurant_id AND o.customer_rating IS NOT NULL
);

-- Update driver totals based on orders
UPDATE delivery_drivers dd 
SET total_deliveries = (
    SELECT COUNT(*) FROM orders o WHERE o.driver_id = dd.driver_id AND o.order_status = 'delivered'
);

COMMIT;
