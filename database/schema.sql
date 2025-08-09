-- Active: 1753587914142@@127.0.0.1@3306@food_delivery_analytics
-- Food Delivery Analytics Platform Database Schema
-- Created: July 2025

DROP DATABASE IF EXISTS food_delivery_analytics;
CREATE DATABASE food_delivery_analytics;
USE food_delivery_analytics;

-- 1. Restaurants Table
CREATE TABLE restaurants (
    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cuisine_type VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    preferred_cuisine VARCHAR(100),
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Delivery Drivers Table
CREATE TABLE delivery_drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE,
    vehicle_type ENUM('bike', 'scooter', 'car') NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Delivery Zones Table
CREATE TABLE delivery_zones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    area_code VARCHAR(20),
    base_delivery_fee DECIMAL(8,2) NOT NULL,
    surge_multiplier DECIMAL(3,2) DEFAULT 1.00,
    max_delivery_distance_km DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    driver_id INT,
    zone_id INT NOT NULL,
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(8,2) NOT NULL,
    tax_amount DECIMAL(8,2) NOT NULL,
    discount_amount DECIMAL(8,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'digital_wallet') NOT NULL,
    special_instructions TEXT,
    order_placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),
    customer_review TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
    FOREIGN KEY (driver_id) REFERENCES delivery_drivers(driver_id),
    FOREIGN KEY (zone_id) REFERENCES delivery_zones(zone_id)
);

-- 6. Order Items Table
CREATE TABLE order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    special_requests TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 7. Driver Shifts Table
CREATE TABLE driver_shifts (
    shift_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    zone_id INT NOT NULL,
    shift_start TIMESTAMP NOT NULL,
    shift_end TIMESTAMP,
    deliveries_completed INT DEFAULT 0,
    total_distance_km DECIMAL(8,2) DEFAULT 0.00,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    fuel_cost DECIMAL(8,2) DEFAULT 0.00,
    status ENUM('active', 'ended', 'paused') DEFAULT 'active',
    FOREIGN KEY (driver_id) REFERENCES delivery_drivers(driver_id),
    FOREIGN KEY (zone_id) REFERENCES delivery_zones(zone_id)
);

-- Indexes for better performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_zone_id ON orders(zone_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_placed_at ON orders(order_placed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_driver_shifts_driver_id ON driver_shifts(driver_id);
CREATE INDEX idx_driver_shifts_zone_id ON driver_shifts(zone_id);

-- Views for common analytics queries
CREATE VIEW restaurant_performance_view AS
SELECT 
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.rating as restaurant_rating,
    COUNT(o.order_id) as total_orders,
    AVG(o.final_amount) as avg_order_value,
    SUM(o.final_amount) as total_revenue,
    AVG(o.customer_rating) as avg_customer_rating,
    AVG(TIMESTAMPDIFF(MINUTE, o.order_placed_at, o.actual_delivery_time)) as avg_delivery_time_minutes
FROM restaurants r
LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id AND o.order_status = 'delivered'
GROUP BY r.restaurant_id, r.name, r.cuisine_type, r.rating;

CREATE VIEW driver_efficiency_view AS
SELECT 
    dd.driver_id,
    dd.name,
    dd.vehicle_type,
    dd.rating as driver_rating,
    COUNT(o.order_id) as total_deliveries,
    AVG(TIMESTAMPDIFF(MINUTE, o.order_placed_at, o.actual_delivery_time)) as avg_delivery_time_minutes,
    AVG(o.customer_rating) as avg_customer_rating,
    SUM(ds.total_earnings) as total_earnings
FROM delivery_drivers dd
LEFT JOIN orders o ON dd.driver_id = o.driver_id AND o.order_status = 'delivered'
LEFT JOIN driver_shifts ds ON dd.driver_id = ds.driver_id
GROUP BY dd.driver_id, dd.name, dd.vehicle_type, dd.rating;
