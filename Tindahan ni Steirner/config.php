<?php
// config.php - Configuration File

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'tindahan_db');

// Site Configuration
define('SITE_NAME', 'Tindahan ni Steirner');
define('SITE_URL', 'https://yourdomain.com');
define('ADMIN_EMAIL', 'admin@tindahansteirner.com');

// Payment Gateway Configuration

// PayPal Configuration
define('PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_CLIENT_ID');
define('PAYPAL_SECRET', 'YOUR_PAYPAL_SECRET');
define('PAYPAL_MODE', 'sandbox'); // 'sandbox' or 'live'
define('PAYPAL_EMAIL', 'payment@tindahansteirner.com');

// GCash Configuration
define('GCASH_MERCHANT_ID', 'YOUR_GCASH_MERCHANT_ID');
define('GCASH_API_KEY', 'YOUR_GCASH_API_KEY');
define('GCASH_NUMBER', '09XX-XXX-XXXX');

// Stripe Configuration (for Card Payments)
define('STRIPE_PUBLISHABLE_KEY', 'YOUR_STRIPE_PUBLISHABLE_KEY');
define('STRIPE_SECRET_KEY', 'YOUR_STRIPE_SECRET_KEY');

// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_FROM', 'noreply@tindahansteirner.com');
define('SMTP_FROM_NAME', 'Tindahan ni Steirner');

// Security
define('ENCRYPTION_KEY', 'your-32-character-encryption-key');
define('SESSION_TIMEOUT', 3600); // 1 hour

// Order Configuration
define('ORDER_PREFIX', 'TNS');
define('AUTO_DELIVERY', true);
define('REQUIRE_VERIFICATION', true);

// Database Connection Function
function getDBConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $conn;
    } catch(PDOException $e) {
        error_log("Database Connection Error: " . $e->getMessage());
        return null;
    }
}

// Error Handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1); // Use only on HTTPS

// Timezone
date_default_timezone_set('Asia/Manila');

// CORS Headers (if needed for API)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

?>