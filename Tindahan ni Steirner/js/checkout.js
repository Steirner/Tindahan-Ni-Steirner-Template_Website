// Checkout Management

function showCheckout() {
    const modal = document.getElementById('checkoutModal');
    updateCheckoutItems();
    modal.classList.add('active');
}

function hideCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function updateCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(243,156,18,0.2);">
            <span>${item.emoji} ${item.name} x${item.quantity}</span>
            <span style="color: var(--success-color); font-weight: bold;">₱${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = `₱${getCartTotal().toLocaleString()}`;
}

// Handle payment method selection
document.addEventListener('DOMContentLoaded', () => {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const paymentDetails = document.getElementById('paymentDetails');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const method = e.target.value;
            showPaymentDetails(method);
        });
    });
    
    // Close checkout button
    document.getElementById('closeCheckout').addEventListener('click', hideCheckout);
    
    // Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
});

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    
    let detailsHTML = '';
    
    switch(method) {
        case 'gcash':
            detailsHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px;">
                    <h4 style="color: var(--primary-color); margin-bottom: 15px;">
                        <i class="fas fa-mobile-alt"></i> GCash Payment Details
                    </h4>
                    <p style="margin-bottom: 10px;">Send payment to:</p>
                    <div style="background: rgba(243,156,18,0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="font-weight: bold; font-size: 18px; color: var(--primary-color);">
                            GCash Number: 09XX-XXX-XXXX
                        </p>
                        <p style="color: rgba(255,255,255,0.8);">Account Name: Steirner</p>
                    </div>
                    <input type="text" id="gcashRef" placeholder="GCash Reference Number" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white; margin-top: 10px;">
                    <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 10px;">
                        <i class="fas fa-info-circle"></i> After sending payment, enter your reference number above.
                    </p>
                </div>
            `;
            break;
            
        case 'paypal':
            detailsHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px;">
                    <h4 style="color: var(--primary-color); margin-bottom: 15px;">
                        <i class="fab fa-paypal"></i> PayPal Payment Details
                    </h4>
                    <p style="margin-bottom: 10px;">Send payment to:</p>
                    <div style="background: rgba(243,156,18,0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="font-weight: bold; font-size: 18px; color: var(--primary-color);">
                            PayPal Email: payment@tindahansteirner.com
                        </p>
                    </div>
                    <input type="text" id="paypalTransaction" placeholder="PayPal Transaction ID" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white; margin-top: 10px;">
                    <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 10px;">
                        <i class="fas fa-info-circle"></i> Send payment as "Friends & Family" to avoid fees.
                    </p>
                </div>
            `;
            break;
            
        case 'card':
            detailsHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px;">
                    <h4 style="color: var(--primary-color); margin-bottom: 15px;">
                        <i class="fas fa-credit-card"></i> Card Payment Details
                    </h4>
                    <input type="text" id="cardNumber" placeholder="Card Number (XXXX-XXXX-XXXX-XXXX)" required maxlength="19" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <input type="text" id="cardExpiry" placeholder="MM/YY" required maxlength="5" style="padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white;">
                        <input type="text" id="cardCVV" placeholder="CVV" required maxlength="3" style="padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white;">
                    </div>
                    <input type="text" id="cardName" placeholder="Cardholder Name" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 8px; color: white; margin-top: 15px;">
                    <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 10px;">
                        <i class="fas fa-lock"></i> Your payment information is secure and encrypted.
                    </p>
                </div>
            `;
            break;
    }
    
    paymentDetails.innerHTML = detailsHTML;
    
    // Add card number formatting
    if (method === 'card') {
        const cardNumber = document.getElementById('cardNumber');
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join('-') || value;
            e.target.value = formattedValue;
        });
        
        const cardExpiry = document.getElementById('cardExpiry');
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
        
        const cardCVV = document.getElementById('cardCVV');
        cardCVV.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    
    // Get form data
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const robloxUsername = document.getElementById('robloxUsername').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Validate cart
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Get payment reference based on method
    let paymentReference = '';
    if (paymentMethod === 'gcash') {
        paymentReference = document.getElementById('gcashRef')?.value || '';
    } else if (paymentMethod === 'paypal') {
        paymentReference = document.getElementById('paypalTransaction')?.value || '';
    } else if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value || '';
        paymentReference = 'CARD-' + cardNumber.slice(-4);
    }
    
    // Create order object
    const order = {
        orderNumber: generateOrderNumber(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            robloxUsername: robloxUsername
        },
        items: cart,
        total: getCartTotal(),
        paymentMethod: paymentMethod,
        paymentReference: paymentReference,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Save order to localStorage
        saveOrder(order);
        
        // Send order confirmation email (in real app)
        sendOrderConfirmation(order);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Hide checkout modal
        hideCheckout();
        
        // Show success modal
        showSuccessModal(order.orderNumber);
        
        // Reset form
        e.target.reset();
        document.getElementById('paymentDetails').innerHTML = '';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function generateOrderNumber() {
    return 'TNS' + Date.now().toString().slice(-8);
}

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function sendOrderConfirmation(order) {
    // In a real application, this would send an email via backend
    console.log('Order confirmation sent:', order);
    
    // Here you would typically make an API call to your backend:
    // fetch('/api/send-order-confirmation', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(order)
    // });
}

function showSuccessModal(orderNumber) {
    const modal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    modal.classList.add('active');
    
    // Confetti effect (simple version)
    createConfetti();
}

function createConfetti() {
    const colors = ['#f39c12', '#e67e22', '#3498db', '#27ae60', '#e74c3c'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                animation: confettiFall ${2 + Math.random() * 2}s linear;
                z-index: 10000;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Close success modal
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeSuccess').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
    });
});

// Close product modal
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeProduct').addEventListener('click', () => {
        document.getElementById('productModal').classList.remove('active');
    });
});