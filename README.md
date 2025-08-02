# 🍕 Food Delivery Analytics Platform

A complete food delivery management system with advanced database features including views, triggers, and stored procedures.

## 📋 Table of Contents
- [Setup & Installation](#setup--installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Database Features](#database-features)
- [Examples & Testing](#examples--testing)
- [How It Works](#how-it-works)

---

## 🚀 Setup & Installation

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE food_delivery_analytics;
USE food_delivery_analytics;

-- Run the schema file
SOURCE database/schema.sql;
SOURCE database/sample_data.sql;
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

### 3. Test the API
```bash
curl http://localhost:5000/api/health
```

---

## 🗄️ Database Schema

### Main Tables
- **customers** - Customer information and loyalty data
- **restaurants** - Restaurant details and ratings
- **delivery_drivers** - Driver information and performance
- **delivery_zones** - Delivery areas and pricing
- **orders** - Order details and status
- **order_items** - Individual items in orders
- **driver_shifts** - Driver work sessions

### Key Relationships
```
customers ──┐
            ├─→ orders ←─┐
restaurants ──┘          ├─→ order_items
                         │
delivery_drivers ─────────┘
delivery_zones ───────────┘
```

---

## 📡 API Endpoints

### 🧑‍🤝‍🧑 Customer Endpoints

#### GET `/api/customers` - Get All Customers
**What it does**: Retrieves list of all customers with basic info
```bash
curl http://localhost:5000/api/customers
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "customer_id": 1,
      "name": "John Doe",
      "email": "john@email.com",
      "total_orders": 15,
      "total_spent": 450.00
    }
  ]
}
```

#### GET `/api/customers/summary` - Customer Tiers (VIEW EXAMPLE)
**What it does**: Shows customer tiers based on order history (VIP, Premium, Regular, New)
**Database Feature**: Uses SQL CASE statements for tier calculation
```bash
curl http://localhost:5000/api/customers/summary
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "customer_id": 1,
      "name": "John Doe",
      "total_orders": 25,
      "total_spent": 750.00,
      "customer_tier": "Premium"
    }
  ],
  "message": "Customer summary with tiers"
}
```

#### GET `/api/customers/:id/history` - Order History (PROCEDURE EXAMPLE)
**What it does**: Gets detailed order history for a specific customer
**Database Feature**: Complex JOIN with multiple tables
```bash
curl http://localhost:5000/api/customers/1/history
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "order_id": 101,
      "restaurant_name": "Pizza Palace",
      "final_amount": 25.50,
      "order_status": "delivered",
      "order_placed_at": "2025-08-01T18:30:00.000Z"
    }
  ],
  "message": "Order history for customer 1"
}
```

### 📦 Order Endpoints

#### GET `/api/orders` - Get All Orders
**What it does**: Retrieves all orders with customer and restaurant info
```bash
curl http://localhost:5000/api/orders
```

#### GET `/api/orders/sales/daily` - Daily Sales (VIEW EXAMPLE) 
**What it does**: Shows daily sales summary for last 7 days
**Database Feature**: Uses GROUP BY and date functions
```bash
curl http://localhost:5000/api/orders/sales/daily
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "order_date": "2025-08-01",
      "total_orders": 45,
      "total_revenue": 1250.00,
      "delivered_orders": 42,
      "cancelled_orders": 3
    }
  ],
  "message": "Daily sales summary for last 7 days"
}
```

#### PUT `/api/orders/:id/complete` - Complete Order (TRIGGER EXAMPLE)
**What it does**: Marks order as delivered and automatically updates customer stats
**Database Feature**: Triggers automatically update customer total_orders, total_spent, loyalty_points
```bash
curl -X PUT http://localhost:5000/api/orders/1/complete
```
**Example Response**:
```json
{
  "success": true,
  "message": "Order completed - customer stats updated automatically by triggers",
  "data": {
    "order_id": "1",
    "status": "delivered"
  }
}
```

### 🚗 Driver Endpoints

#### GET `/api/drivers/performance` - Driver Performance (VIEW EXAMPLE)
**What it does**: Shows driver performance metrics and earnings
**Database Feature**: Complex aggregations with AVG, COUNT, SUM
```bash
curl http://localhost:5000/api/drivers/performance
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "driver_id": 1,
      "name": "Mike Johnson",
      "vehicle_type": "bike",
      "rating": 4.8,
      "total_deliveries": 120,
      "avg_customer_rating": 4.7,
      "estimated_earnings": 960.00
    }
  ],
  "message": "Driver performance summary"
}
```

#### GET `/api/drivers/zone/:zoneId/best` - Best Drivers (PROCEDURE EXAMPLE)
**What it does**: Finds top 5 drivers for a specific zone
**Database Feature**: Advanced filtering and ranking
```bash
curl http://localhost:5000/api/drivers/zone/1/best
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "driver_id": 1,
      "name": "Mike Johnson",
      "rating": 4.8,
      "zone_deliveries": 45,
      "avg_customer_rating": 4.7
    }
  ],
  "message": "Top 5 drivers for zone 1"
}
```

### 🏪 Restaurant Endpoints

#### GET `/api/restaurants/performance` - Restaurant Performance (VIEW EXAMPLE)
**What it does**: Shows restaurant performance metrics
**Database Feature**: Revenue calculations and rating aggregations
```bash
curl http://localhost:5000/api/restaurants/performance
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "restaurant_id": 1,
      "name": "Pizza Palace",
      "cuisine_type": "Italian",
      "rating": 4.5,
      "total_orders": 250,
      "total_revenue": 6250.00,
      "avg_order_value": 25.00,
      "avg_customer_rating": 4.6
    }
  ],
  "message": "Restaurant performance summary"
}
```

#### POST `/api/restaurants/:id/commission` - Calculate Commission (FUNCTION EXAMPLE)
**What it does**: Calculates commission based on restaurant sales
**Database Feature**: Percentage calculations with custom rates
```bash
curl -X POST http://localhost:5000/api/restaurants/1/commission \
  -H "Content-Type: application/json" \
  -d '{"commission_rate": 15}'
```
**Example Input**:
```json
{
  "commission_rate": 15
}
```
**Example Response**:
```json
{
  "success": true,
  "data": {
    "name": "Pizza Palace",
    "total_orders": 250,
    "total_revenue": 6250.00,
    "commission_amount": 937.50
  },
  "message": "Commission calculated at 15%"
}
```

### 🗺️ Zone Endpoints

#### GET `/api/zones/performance` - Zone Performance (VIEW EXAMPLE)
**What it does**: Shows delivery zone performance and success rates
**Database Feature**: Success rate calculations and aggregations
```bash
curl http://localhost:5000/api/zones/performance
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "zone_id": 1,
      "zone_name": "Downtown",
      "base_delivery_fee": 5.00,
      "total_orders": 500,
      "total_revenue": 12500.00,
      "delivered_orders": 475,
      "cancelled_orders": 25,
      "success_rate": 95.00
    }
  ],
  "message": "Zone performance summary"
}
```

#### GET `/api/zones/:id/peak-hours` - Peak Hours (PROCEDURE EXAMPLE)
**What it does**: Analyzes peak hours for a specific zone
**Database Feature**: Time-based analysis with demand classification
```bash
curl http://localhost:5000/api/zones/1/peak-hours
```
**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "hour_of_day": 19,
      "order_count": 85,
      "avg_order_value": 28.50,
      "demand_level": "High Demand"
    },
    {
      "hour_of_day": 12,
      "order_count": 45,
      "avg_order_value": 22.00,
      "demand_level": "Medium Demand"
    }
  ],
  "message": "Peak hours analysis for zone 1"
}
```

---

## 🎯 Database Features

### 1. VIEWS - Fast Analytics Queries
**What they are**: Pre-written complex queries stored in database
**Benefits**: Fast data retrieval, simplified complex logic

**Examples in API**:
- Customer tier classification (`/api/customers/summary`)
- Daily sales summaries (`/api/orders/sales/daily`)  
- Driver performance metrics (`/api/drivers/performance`)
- Restaurant analytics (`/api/restaurants/performance`)
- Zone success rates (`/api/zones/performance`)

### 2. TRIGGERS - Automatic Data Updates
**What they are**: Code that runs automatically when data changes
**Benefits**: Data consistency, automatic calculations

**Example**: When you complete an order:
```bash
# This API call...
curl -X PUT http://localhost:5000/api/orders/1/complete

# Triggers automatically:
# 1. Updates customer total_orders
# 2. Updates customer total_spent  
# 3. Adds loyalty points
# 4. Updates restaurant rating
# 5. Updates driver stats
```

### 3. PROCEDURES - Complex Business Logic
**What they are**: Stored functions that perform complex operations
**Benefits**: Consistent business rules, better performance

**Examples in API**:
- Customer order history (`/customers/:id/history`)
- Best driver selection (`/drivers/zone/:id/best`)
- Peak hours analysis (`/zones/:id/peak-hours`)

### 4. FUNCTIONS - Reusable Calculations
**What they are**: Custom functions for calculations
**Benefits**: Consistent calculations, reusable logic

**Examples in API**:
- Commission calculations (`/restaurants/:id/commission`)
- Delivery fee calculations
- Customer tier determinations

---

## 🧪 Examples & Testing

### CRUD Operations

#### Create a Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@email.com",
    "phone": "555-0123",
    "address": "123 Main St"
  }'
```

#### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "restaurant_id": 1,
    "zone_id": 1,
    "total_amount": 25.00,
    "delivery_fee": 5.00,
    "tax_amount": 2.50,
    "final_amount": 32.50,
    "payment_method": "card"
  }'
```

### Test Database Features

#### Test Views (Fast Analytics)
```bash
# Customer tiers
curl http://localhost:5000/api/customers/summary

# Daily sales
curl http://localhost:5000/api/orders/sales/daily

# Driver performance
curl http://localhost:5000/api/drivers/performance
```

#### Test Procedures (Complex Logic)
```bash
# Customer history
curl http://localhost:5000/api/customers/1/history

# Best drivers for zone
curl http://localhost:5000/api/drivers/zone/1/best

# Peak hours analysis
curl http://localhost:5000/api/zones/1/peak-hours
```

#### Test Triggers (Automatic Updates)
```bash
# Check customer stats before
curl http://localhost:5000/api/customers/1

# Complete an order (triggers will run automatically)
curl -X PUT http://localhost:5000/api/orders/1/complete

# Check customer stats after (should be updated automatically)
curl http://localhost:5000/api/customers/1
```

#### Test Functions (Calculations)
```bash
# Calculate commission
curl -X POST http://localhost:5000/api/restaurants/1/commission \
  -H "Content-Type: application/json" \
  -d '{"commission_rate": 15}'
```

---

## ⚙️ How It Works

### 1. Views Work Like This:
```sql
-- Instead of writing complex queries every time:
SELECT 
  c.customer_id,
  c.name,
  CASE 
    WHEN c.total_orders >= 20 THEN 'VIP'
    WHEN c.total_orders >= 10 THEN 'Premium' 
    ELSE 'Regular'
  END as tier
FROM customers c;

-- You just call the API:
GET /api/customers/summary
```

### 2. Triggers Work Like This:
```sql
-- When you update an order to 'delivered':
UPDATE orders SET order_status = 'delivered' WHERE order_id = 1;

-- Triggers automatically run:
-- ✅ Update customer total_orders
-- ✅ Update customer total_spent
-- ✅ Add loyalty points
-- ✅ Update restaurant rating
-- ✅ Update driver stats
```

### 3. Procedures Work Like This:
```sql
-- Complex logic with multiple steps:
-- 1. Find active drivers in zone
-- 2. Calculate their performance
-- 3. Rank by rating and experience
-- 4. Return top 5

-- You just call:
GET /api/drivers/zone/1/best
```

### 4. Functions Work Like This:
```sql
-- Reusable calculation:
CREATE FUNCTION CalculateCommission(revenue, rate)
RETURNS commission_amount

-- Used in API:
POST /api/restaurants/1/commission
```

---

## 🎉 Summary

This Food Delivery Analytics Platform demonstrates:

- **Views**: Fast analytics queries for business insights
- **Triggers**: Automatic data updates for consistency  
- **Procedures**: Complex business logic in the database
- **Functions**: Reusable calculations and rules

All features work through simple REST API calls with JSON responses. The database handles the complex logic automatically, making your application faster and more reliable.

**Start testing**: `npm start` then try the API endpoints above! 🚀
