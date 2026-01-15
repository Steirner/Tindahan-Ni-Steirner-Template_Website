<?php
// payment_gateway.php - Payment Gateway Integration

require_once 'config.php';

/**
 * Verify GCash Payment
 */
function verifyGCashPayment($referenceNumber, $amount) {
    // In production, integrate with GCash API
    // This is a simplified example
    
    if (empty($referenceNumber)) {
        return ['success' => false, 'message' => 'GCash reference number is required'];
    }
    
    // Validate reference number format
    if (!preg_match('/^[A-Z0-9]{10,20}$/', $referenceNumber)) {
        return ['success' => false, 'message' => 'Invalid GCash reference number format'];
    }
    
    // In production, call GCash API to verify payment
    /*
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.gcash.com/verify');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'merchantId' => GCASH_MERCHANT_ID,
        'reference' => $referenceNumber,
        'amount' => $amount
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . GCASH_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    return $result;
    */
    
    // For demo purposes, accept any valid format
    return [
        'success' => true,
        'message' => 'GCash payment verified',
        'transactionId' => $referenceNumber
    ];
}

/**
 * Verify PayPal Payment
 */
function verifyPayPalPayment($transactionId, $amount) {
    if (empty($transactionId)) {
        return ['success' => false, 'message' => 'PayPal transaction ID is required'];
    }
    
    // Validate transaction ID format
    if (!preg_match('/^[A-Z0-9]{17}$/', $transactionId)) {
        return ['success' => false, 'message' => 'Invalid PayPal transaction ID format'];
    }
    
    // In production, integrate with PayPal API
    /*
    require_once 'vendor/autoload.php';
    
    $apiContext = new \PayPal\Rest\ApiContext(
        new \PayPal\Auth\OAuthTokenCredential(
            PAYPAL_CLIENT_ID,
            PAYPAL_SECRET
        )
    );
    
    $apiContext->setConfig([
        'mode' => PAYPAL_MODE
    ]);
    
    try {
        $payment = \PayPal\Api\Payment::get($transactionId, $apiContext);
        
        if ($payment->getState() === 'approved') {
            $transactions = $payment->getTransactions();
            $paidAmount = $transactions[0]->getAmount()->getTotal();
            
            if ($paidAmount >= $amount) {
                return [
                    'success' => true,
                    'message' => 'PayPal payment verified',
                    'transactionId' => $transactionId
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Payment amount mismatch'
                ];
            }
        }
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'PayPal verification failed: ' . $e->getMessage()
        ];
    }
    */
    
    // For demo purposes
    return [
        'success' => true,
        'message' => 'PayPal payment verified',
        'transactionId' => $transactionId
    ];
}

/**
 * Process Card Payment via Stripe
 */
function processCardPayment($customer, $amount) {
    // In production, integrate with Stripe API
    /*
    require_once 'vendor/autoload.php';
    
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);
    
    try {
        $charge = \Stripe\Charge::create([
            'amount' => $amount * 100, // Convert to cents
            'currency' => 'php',
            'source' => $customer['cardToken'], // This would come from Stripe.js
            'description' => 'Order from ' . $customer['name'],
            'receipt_email' => $customer['email']
        ]);
        
        if ($charge->status === 'succeeded') {
            return [
                'success' => true,
                'message' => 'Card payment successful',
                'transactionId' => $charge->id
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Card payment failed'
            ];
        }
    } catch (\Stripe\Exception\CardException $e) {
        return [
            'success' => false,
            'message' => 'Card declined: ' . $e->getError()->message
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Payment error: ' . $e->getMessage()
        ];
    }
    */
    
    // For demo purposes
    return [
        'success' => true,
        'message' => 'Card payment processed',
        'transactionId' => 'CARD-' . time()
    ];
}

/**
 * Create PayPal Payment (for direct PayPal checkout)
 */
function createPayPalPayment($amount, $currency = 'PHP') {
    // This would create a PayPal payment and return the approval URL
    /*
    require_once 'vendor/autoload.php';
    
    $apiContext = new \PayPal\Rest\ApiContext(
        new \PayPal\Auth\OAuthTokenCredential(
            PAYPAL_CLIENT_ID,
            PAYPAL_SECRET
        )
    );
    
    $payer = new \PayPal\Api\Payer();
    $payer->setPaymentMethod('paypal');
    
    $amountObj = new \PayPal\Api\Amount();
    $amountObj->setCurrency($currency)
              ->setTotal($amount);
    
    $transaction = new \PayPal\Api\Transaction();
    $transaction->setAmount($amountObj)
                ->setDescription('Purchase from Tindahan ni Steirner');
    
    $redirectUrls = new \PayPal\Api\RedirectUrls();
    $redirectUrls->setReturnUrl(SITE_URL . '/payment/success.php')
                 ->setCancelUrl(SITE_URL . '/payment/cancel.php');
    
    $payment = new \PayPal\Api\Payment();
    $payment->setIntent('sale')
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions([$transaction]);
    
    try {
        $payment->create($apiContext);
        return [
            'success' => true,
            'approvalUrl' => $payment->getApprovalLink()
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
    */
    
    return [
        'success' => true,
        'approvalUrl' => 'https://paypal.com/checkout'
    ];
}

/**
 * Refund Payment
 */
function refundPayment($orderId, $amount, $reason = '') {
    // Get order payment details from database
    $db = getDBConnection();
    $stmt = $db->prepare("
        SELECT payment_method, payment_reference 
        FROM orders 
        WHERE id = ?
    ");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    
    if (!$order) {
        return ['success' => false, 'message' => 'Order not found'];
    }
    
    // Process refund based on payment method
    switch($order['payment_method']) {
        case 'paypal':
            return refundPayPal($order['payment_reference'], $amount, $reason);
            
        case 'card':
            return refundStripe($order['payment_reference'], $amount, $reason);
            
        case 'gcash':
            return refundGCash($order['payment_reference'], $amount, $reason);
            
        default:
            return ['success' => false, 'message' => 'Unsupported payment method for refund'];
    }
}

function refundPayPal($transactionId, $amount, $reason) {
    // Implement PayPal refund
    return ['success' => true, 'message' => 'Refund initiated'];
}

function refundStripe($chargeId, $amount, $reason) {
    // Implement Stripe refund
    return ['success' => true, 'message' => 'Refund initiated'];
}

function refundGCash($reference, $amount, $reason) {
    // Implement GCash refund
    return ['success' => true, 'message' => 'Refund initiated'];
}

?>