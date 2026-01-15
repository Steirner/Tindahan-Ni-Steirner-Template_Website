<?php
// process_order.php - Order Processing Handler

require_once 'config.php';
require_once 'payment_gateway.php';
require_once 'email_handler.php';

header('Content-Type: application/json');

// Start session
session_start();

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (!$data || !isset($data['customer']) || !isset($data['items']) || !isset($data['paymentMethod'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

try {
    // Extract data
    $customer = $data['customer'];
    $items = $data['items'];
    $total = $data['total'];
    $paymentMethod = $data['paymentMethod'];
    $paymentReference = $data['paymentReference'] ?? '';
    
    // Validate customer data
    if (empty($customer['name']) || empty($customer['email']) || empty($customer['robloxUsername'])) {
        throw new Exception('Please fill in all required fields');
    }
    
    // Validate email
    if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    // Validate items
    if (empty($items) || !is_array($items)) {
        throw new Exception('Cart is empty');
    }
    
    // Generate order number
    $orderNumber = generateOrderNumber();
    
    // Connect to database
    $db = getDBConnection();
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // Begin transaction
    $db->beginTransaction();
    
    // Insert order
    $stmt = $db->prepare("
        INSERT INTO orders (
            order_number, customer_name, customer_email, customer_phone,
            roblox_username, total_amount, payment_method, payment_reference,
            order_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')
    ");
    
    $stmt->execute([
        $orderNumber,
        $customer['name'],
        $customer['email'],
        $customer['phone'],
        $customer['robloxUsername'],
        $total,
        $paymentMethod,
        $paymentReference
    ]);
    
    $orderId = $db->lastInsertId();
    
    // Insert order items
    $stmt = $db->prepare("
        INSERT INTO order_items (
            order_id, product_id, product_name, quantity, price
        ) VALUES (?, ?, ?, ?, ?)
    ");
    
    foreach ($items as $item) {
        $stmt->execute([
            $orderId,
            $item['id'],
            $item['name'],
            $item['quantity'],
            $item['price']
        ]);
    }
    
    // Process payment based on method
    $paymentResult = processPayment($paymentMethod, $total, $paymentReference, $customer);
    
    if (!$paymentResult['success']) {
        $db->rollBack();
        throw new Exception($paymentResult['message']);
    }
    
    // Update order status
    $stmt = $db->prepare("
        UPDATE orders 
        SET status = 'confirmed', payment_status = 'paid'
        WHERE id = ?
    ");
    $stmt->execute([$orderId]);
    
    // Commit transaction
    $db->commit();
    
    // Send confirmation email
    sendOrderConfirmation($customer['email'], $orderNumber, $items, $total);
    
    // Send notification to admin
    notifyAdmin($orderNumber, $customer, $items, $total);
    
    // If auto-delivery is enabled, process delivery
    if (AUTO_DELIVERY) {
        autoDeliverItems($orderId, $items, $customer['robloxUsername']);
    }
    
    // Log successful order
    logOrder($orderNumber, 'Order created successfully');
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'orderNumber' => $orderNumber,
        'orderId' => $orderId
    ]);
    
} catch (Exception $e) {
    // Rollback transaction if active
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    // Log error
    error_log("Order Processing Error: " . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Helper Functions

function generateOrderNumber() {
    return ORDER_PREFIX . date('Ymd') . rand(1000, 9999);
}

function processPayment($method, $amount, $reference, $customer) {
    // This is a simplified version. In production, you'd integrate with actual payment gateways
    
    switch($method) {
        case 'gcash':
            return verifyGCashPayment($reference, $amount);
            
        case 'paypal':
            return verifyPayPalPayment($reference, $amount);
            
        case 'card':
            return processCardPayment($customer, $amount);
            
        default:
            return ['success' => false, 'message' => 'Invalid payment method'];
    }
}

function autoDeliverItems($orderId, $items, $robloxUsername) {
    // Implement auto-delivery logic here
    // This would integrate with your game/item delivery system
    
    foreach ($items as $item) {
        // Log delivery attempt
        logDelivery($orderId, $item['id'], $robloxUsername, 'pending');
        
        // Here you would call your game API or delivery system
        // Example: deliverToPlayer($robloxUsername, $item['id'], $item['quantity']);
    }
}

function logOrder($orderNumber, $message) {
    $logFile = __DIR__ . '/logs/orders.log';
    $logMessage = date('Y-m-d H:i:s') . " - Order {$orderNumber}: {$message}\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

function logDelivery($orderId, $productId, $username, $status) {
    $logFile = __DIR__ . '/logs/deliveries.log';
    $logMessage = date('Y-m-d H:i:s') . " - Order {$orderId}, Product {$productId} to {$username}: {$status}\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

?>