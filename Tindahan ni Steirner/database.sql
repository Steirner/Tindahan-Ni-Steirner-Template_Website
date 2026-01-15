-- database.sql - Database Schema for Tindahan ni Steirner

-- Create Database
CREATE DATABASE IF NOT EXISTS tindahan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tindahan_db;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    roblox_username VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('gcash', 'paypal', 'card') NOT NULL,
    payment_reference VARCHAR(100),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    status ENUM('pending', 'confirmed', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date DATETIME NOT NULL,
    delivery_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_customer_email (customer_email),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category ENUM('fruits', 'codes', 'passes', 'robux') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    features JSON,
    badge VARCHAR(20),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    roblox_username VARCHAR(50),
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_roblox_username (roblox_username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    payment_method ENUM('gcash', 'paypal', 'card') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    response_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_item_id INT NOT NULL,
    roblox_username VARCHAR(50) NOT NULL,
    delivery_method VARCHAR(50),
    status ENUM('pending', 'processing', 'delivered', 'failed') DEFAULT 'pending',
    delivery_notes TEXT,
    delivered_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_roblox_username (roblox_username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'support') DEFAULT 'support',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('customer', 'admin') NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_type (user_type),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Discount Codes Table
CREATE TABLE IF NOT EXISTS discount_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0.00,
    max_uses INT DEFAULT 0,
    times_used INT DEFAULT 0,
    valid_from DATETIME,
    valid_until DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Products
INSERT INTO products (name, category, price, emoji, description, features, badge, stock) VALUES
('Dough Fruit', 'fruits', 2500.00, '🍩', 'Legendary Dough Fruit - One of the most powerful fruits in Blox Fruits!', 
 '["Awakened Form Available", "High Damage Output", "Excellent for PvP", "Great Mobility"]', 'HOT', 100),
 
('Shadow Fruit', 'fruits', 2200.00, '🌑', 'Mythical Shadow Fruit with incredible powers', 
 '["Shadow Powers", "High DPS", "PvP Meta", "Fast Attacks"]', 'NEW', 100),
 
('Dragon Fruit', 'fruits', 3000.00, '🐉', 'The legendary Dragon Fruit - Transform into a dragon!', 
 '["Flight Ability", "Massive AOE Damage", "Tank Build", "Beast Transformation"]', 'HOT', 100),
 
('1000 Gems Code', 'codes', 150.00, '💎', 'Get 1000 free gems instantly!', 
 '["1000 Gems", "Instant Delivery", "Working Code", "Single Use"]', NULL, 1000),
 
('2500 Gems Code', 'codes', 350.00, '💎', 'Premium gem code for 2500 gems', 
 '["2500 Gems", "Instant Delivery", "Working Code", "Single Use"]', 'HOT', 1000),
 
('Fast Boat Pass', 'passes', 450.00, '🚤', 'Travel between islands at lightning speed!', 
 '["2x Boat Speed", "Permanent", "All Boats", "Quick Travel"]', NULL, 100),
 
('Dark Blade', 'passes', 1500.00, '⚔️', 'The legendary Dark Blade weapon!', 
 '["Legendary Weapon", "High Damage", "Special Abilities", "Permanent"]', 'RARE', 50),
 
('400 Robux', 'robux', 250.00, '💵', 'Purchase 400 Robux for your account', 
 '["400 Robux", "Safe Transfer", "Instant Delivery", "Direct to Account"]', NULL, 500),
 
('800 Robux', 'robux', 450.00, '💵', 'Get 800 Robux added to your account', 
 '["800 Robux", "Safe Transfer", "Instant Delivery", "Best Value"]', 'HOT', 500);

-- Insert Sample Admin User (password: admin123 - change this in production!)
INSERT INTO admin_users (username, password, email, full_name, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@tindahansteirner.com', 'Administrator', 'admin');

-- Create Views for Reporting

-- Sales Summary View
CREATE OR REPLACE VIEW sales_summary AS
SELECT 
    DATE(order_date) as sale_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value
FROM orders
WHERE status != 'cancelled'
GROUP BY DATE(order_date)
ORDER BY sale_date DESC;

-- Top Products View
CREATE OR REPLACE VIEW top_products AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.price * oi.quantity) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY p.id, p.name, p.category, p.price
ORDER BY total_revenue DESC;

-- Customer Lifetime Value View
CREATE OR REPLACE VIEW customer_ltv AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.roblox_username,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as lifetime_value,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.email = o.customer_email
WHERE o.status != 'cancelled'
GROUP BY c.id, c.name, c.email, c.roblox_username
ORDER BY lifetime_value DESC;

-- Indexes for Performance
CREATE INDEX idx_orders_customer_status ON orders(customer_email, status);
CREATE INDEX idx_order_items_product_order ON order_items(product_id, order_id);
CREATE INDEX idx_deliveries_status_date ON deliveries(status, created_at);

-- Done
SELECT 'Database schema created successfully!' as message;