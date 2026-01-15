// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart
function addToCart(productId) {
    const product = getProduct(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Added to cart!', 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    updateCartModal();
    showNotification('Removed from cart', 'info');
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        updateCartModal();
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Get Cart Total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get Cart Item Count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update Cart UI (Header Badge)
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const count = getCartItemCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

// Update Cart Modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">Your cart is empty</p>';
        cartTotal.textContent = '₱0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = `₱${getCartTotal().toLocaleString()}`;
}

// Show Cart Modal
function showCart() {
    const modal = document.getElementById('cartModal');
    updateCartModal();
    modal.classList.add('active');
}

// Hide Cart Modal
function hideCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize Cart on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Cart Button
    document.getElementById('cartBtn').addEventListener('click', showCart);
    
    // Close Cart Buttons
    document.getElementById('closeCart').addEventListener('click', hideCart);
    document.getElementById('closeCartBtn').addEventListener('click', hideCart);
    
    // Checkout Button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        hideCart();
        showCheckout();
    });
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);