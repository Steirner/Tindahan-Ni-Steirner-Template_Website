<?php
// email_handler.php - Email Notification Handler

require_once 'config.php';

/**
 * Send Order Confirmation Email to Customer
 */
function sendOrderConfirmation($email, $orderNumber, $items, $total) {
    $subject = "Order Confirmation - {$orderNumber}";
    
    $message = generateOrderEmailHTML($orderNumber, $items, $total);
    
    return sendEmail($email, subject, $message);
}

/**
 * Send Order Notification to Admin
 */
function notifyAdmin($orderNumber, $customer, $items, $total) {
    $subject = "New Order Received - {$orderNumber}";
    
    $message = "
        <h2>New Order Notification</h2>
        <p><strong>Order Number:</strong> {$orderNumber}</p>
        <p><strong>Customer Name:</strong> {$customer['name']}</p>
        <p><strong>Email:</strong> {$customer['email']}</p>
        <p><strong>Phone:</strong> {$customer['phone']}</p>
        <p><strong>Roblox Username:</strong> {$customer['robloxUsername']}</p>
        <p><strong>Total Amount:</strong> ₱" . number_format($total, 2) . "</p>
        
        <h3>Order Items:</h3>
        <ul>";
    
    foreach ($items as $item) {
        $message .= "<li>{$item['name']} x{$item['quantity']} - ₱" . number_format($item['price'] * $item['quantity'], 2) . "</li>";
    }
    
    $message .= "</ul>";
    
    return sendEmail(ADMIN_EMAIL, $subject, $message);
}

/**
 * Generate Order Confirmation Email HTML
 */
function generateOrderEmailHTML($orderNumber, $items, $total) {
    $itemsHTML = '';
    foreach ($items as $item) {
        $itemsHTML .= "
            <tr>
                <td style='padding: 15px; border-bottom: 1px solid #e0e0e0;'>{$item['name']}</td>
                <td style='padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: center;'>{$item['quantity']}</td>
                <td style='padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;'>₱" . number_format($item['price'], 2) . "</td>
                <td style='padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;'>₱" . number_format($item['price'] * $item['quantity'], 2) . "</td>
            </tr>
        ";
    }
    
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-number { background: #fff; padding: 15px; border-left: 4px solid #f39c12; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
            th { background: #f39c12; color: white; padding: 15px; text-align: left; }
            .total { background: #f39c12; color: white; padding: 15px; text-align: right; font-size: 18px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🎮 Tindahan ni Steirner</h1>
                <p>Thank you for your order!</p>
            </div>
            <div class='content'>
                <div class='order-number'>
                    <h2>Order Number: {$orderNumber}</h2>
                    <p>Order Date: " . date('F j, Y g:i A') . "</p>
                </div>
                
                <h3>Order Details:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th style='text-align: center;'>Quantity</th>
                            <th style='text-align: right;'>Price</th>
                            <th style='text-align: right;'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {$itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan='4' class='total'>
                                Total: ₱" . number_format($total, 2) . "
                            </td>
                        </tr>
                    </tfoot>
                </table>
                
                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Your order is being processed</li>
                    <li>You will receive your items within 24 hours</li>
                    <li>Check your Roblox account for the items</li>
                    <li>Contact us if you have any questions</li>
                </ul>
                
                <center>
                    <a href='" . SITE_URL . "' class='button'>Visit Our Shop</a>
                </center>
                
                <p style='margin-top: 30px;'><strong>Need Help?</strong></p>
                <p>Contact us at: " . ADMIN_EMAIL . "</p>
                <p>Discord: Steirner#0000</p>
            </div>
            <div class='footer'>
                <p>&copy; 2026 Tindahan ni Steirner. All rights reserved.</p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

/**
 * Send Email using PHP Mail or SMTP
 */
function sendEmail($to, $subject, $message) {
    // Using PHPMailer for better email delivery
    // You would need to install PHPMailer via Composer: composer require phpmailer/phpmailer
    
    /*
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require 'vendor/autoload.php';
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $message;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email Error: {$mail->ErrorInfo}");
        return false;
    }
    */
    
    // Simple PHP mail() function (less reliable)
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM . ">\r\n";
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Send Order Status Update Email
 */
function sendStatusUpdate($email, $orderNumber, $status, $message = '') {
    $statusMessages = [
        'pending' => 'Your order is being processed',
        'confirmed' => 'Your order has been confirmed',
        'processing' => 'Your order is being prepared',
        'delivered' => 'Your order has been delivered',
        'cancelled' => 'Your order has been cancelled',
        'refunded' => 'Your order has been refunded'
    ];
    
    $subject = "Order Update - {$orderNumber}";
    
    $emailMessage = "
        <h2>Order Status Update</h2>
        <p><strong>Order Number:</strong> {$orderNumber}</p>
        <p><strong>Status:</strong> " . ucfirst($status) . "</p>
        <p>" . ($message ?: $statusMessages[$status]) . "</p>
        <p>If you have any questions, please contact us.</p>
    ";
    
    return sendEmail($email, $subject, $emailMessage);
}

/**
 * Send Delivery Confirmation Email
 */
function sendDeliveryConfirmation($email, $orderNumber, $items) {
    $subject = "Items Delivered - {$orderNumber}";
    
    $itemsList = '';
    foreach ($items as $item) {
        $itemsList .= "<li>{$item['name']} x{$item['quantity']}</li>";
    }
    
    $message = "
        <h2>🎉 Your Items Have Been Delivered!</h2>
        <p><strong>Order Number:</strong> {$orderNumber}</p>
        <p>The following items have been delivered to your Roblox account:</p>
        <ul>{$itemsList}</ul>
        <p>Please check your inventory in-game.</p>
        <p>Thank you for shopping with us!</p>
    ";
    
    return sendEmail($email, $subject, $message);
}

?>