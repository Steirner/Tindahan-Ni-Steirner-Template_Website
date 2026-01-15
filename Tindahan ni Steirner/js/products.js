// Product Database
const products = [
    // Devil Fruits
    {
        id: 1,
        name: "Dough Fruit",
        category: "fruits",
        price: 2500,
        emoji: "🍩",
        description: "Legendary Dough Fruit - One of the most powerful fruits in Blox Fruits!",
        features: ["Awakened Form Available", "High Damage Output", "Excellent for PvP", "Great Mobility"],
        badge: "HOT"
    },
    {
        id: 2,
        name: "Shadow Fruit",
        category: "fruits",
        price: 2200,
        emoji: "🌑",
        description: "Mythical Shadow Fruit with incredible powers",
        features: ["Shadow Powers", "High DPS", "PvP Meta", "Fast Attacks"],
        badge: "NEW"
    },
    {
        id: 3,
        name: "Dragon Fruit",
        category: "fruits",
        price: 3000,
        emoji: "🐉",
        description: "The legendary Dragon Fruit - Transform into a dragon!",
        features: ["Flight Ability", "Massive AOE Damage", "Tank Build", "Beast Transformation"],
        badge: "HOT"
    },
    {
        id: 4,
        name: "Venom Fruit",
        category: "fruits",
        price: 2400,
        emoji: "☠️",
        description: "Deadly Venom Fruit with poison abilities",
        features: ["Poison Damage", "DOT Effects", "PvP Strong", "Area Control"]
    },
    {
        id: 5,
        name: "Spirit Fruit",
        category: "fruits",
        price: 2600,
        emoji: "👻",
        description: "Mythical Spirit Fruit with ghostly powers",
        features: ["Spectral Abilities", "High Mobility", "Versatile Moves", "PvE & PvP"]
    },
    {
        id: 6,
        name: "Leopard Fruit",
        category: "fruits",
        price: 3500,
        emoji: "🐆",
        description: "The rarest and most powerful fruit in the game!",
        features: ["Highest Rarity", "Incredible Speed", "Massive Damage", "Best PvP Fruit"],
        badge: "RARE"
    },
    
    // Game Codes
    {
        id: 7,
        name: "1000 Gems Code",
        category: "codes",
        price: 150,
        emoji: "💎",
        description: "Get 1000 free gems instantly!",
        features: ["1000 Gems", "Instant Delivery", "Working Code", "Single Use"]
    },
    {
        id: 8,
        name: "2500 Gems Code",
        category: "codes",
        price: 350,
        emoji: "💎",
        description: "Premium gem code for 2500 gems",
        features: ["2500 Gems", "Instant Delivery", "Working Code", "Single Use"],
        badge: "HOT"
    },
    {
        id: 9,
        name: "5000 Gems Code",
        category: "codes",
        price: 650,
        emoji: "💎",
        description: "Mega gem pack with 5000 gems!",
        features: ["5000 Gems", "Instant Delivery", "Working Code", "Best Value"],
        badge: "BEST"
    },
    {
        id: 10,
        name: "2x EXP Code (24h)",
        category: "codes",
        price: 200,
        emoji: "⚡",
        description: "Double your experience for 24 hours!",
        features: ["2x EXP Boost", "24 Hour Duration", "Level Up Fast", "Stack with Events"]
    },
    {
        id: 11,
        name: "2x Money Code (24h)",
        category: "codes",
        price: 200,
        emoji: "💰",
        description: "Double your money earnings for 24 hours!",
        features: ["2x Money Boost", "24 Hour Duration", "Get Rich Quick", "Works Everywhere"]
    },
    
    // Game Passes
    {
        id: 12,
        name: "Fast Boat Pass",
        category: "passes",
        price: 450,
        emoji: "🚤",
        description: "Travel between islands at lightning speed!",
        features: ["2x Boat Speed", "Permanent", "All Boats", "Quick Travel"]
    },
    {
        id: 13,
        name: "Dark Blade",
        category: "passes",
        price: 1500,
        emoji: "⚔️",
        description: "The legendary Dark Blade weapon!",
        features: ["Legendary Weapon", "High Damage", "Special Abilities", "Permanent"],
        badge: "RARE"
    },
    {
        id: 14,
        name: "Fruit Storage",
        category: "passes",
        price: 800,
        emoji: "📦",
        description: "Store unlimited devil fruits!",
        features: ["Unlimited Storage", "Never Lose Fruits", "Easy Management", "Permanent"]
    },
    {
        id: 15,
        name: "Geppo (Sky Jump)",
        category: "passes",
        price: 350,
        emoji: "☁️",
        description: "Jump in the air multiple times!",
        features: ["Air Jump Ability", "Enhanced Mobility", "Permanent", "Combat Advantage"]
    },
    
    // Robux
    {
        id: 16,
        name: "400 Robux",
        category: "robux",
        price: 250,
        emoji: "💵",
        description: "Purchase 400 Robux for your account",
        features: ["400 Robux", "Safe Transfer", "Instant Delivery", "Direct to Account"]
    },
    {
        id: 17,
        name: "800 Robux",
        category: "robux",
        price: 450,
        emoji: "💵",
        description: "Get 800 Robux added to your account",
        features: ["800 Robux", "Safe Transfer", "Instant Delivery", "Best Value"],
        badge: "HOT"
    },
    {
        id: 18,
        name: "1700 Robux",
        category: "robux",
        price: 900,
        emoji: "💵",
        description: "Premium Robux package - 1700 Robux!",
        features: ["1700 Robux", "Safe Transfer", "Instant Delivery", "Bonus Included"]
    },
    {
        id: 19,
        name: "4500 Robux",
        category: "robux",
        price: 2200,
        emoji: "💵",
        description: "Mega Robux pack - 4500 Robux!",
        features: ["4500 Robux", "Safe Transfer", "Instant Delivery", "Best Deal"],
        badge: "BEST"
    },
    {
        id: 20,
        name: "10000 Robux",
        category: "robux",
        price: 4500,
        emoji: "💵",
        description: "Ultimate Robux package - 10000 Robux!",
        features: ["10000 Robux", "Safe Transfer", "VIP Treatment", "Maximum Value"],
        badge: "VIP"
    }
];

// Display Products
function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">${product.emoji}</div>
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">₱${product.price.toLocaleString()}</div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary btn-small view-details" data-id="${product.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            showProductDetails(productId);
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.id);
            showProductDetails(productId);
        });
    });
}

function getCategoryName(category) {
    const names = {
        'fruits': 'Devil Fruit',
        'codes': 'Game Code',
        'passes': 'Game Pass',
        'robux': 'Robux'
    };
    return names[category] || category;
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    document.getElementById('productModalTitle').textContent = product.name;
    document.getElementById('productModalImage').innerHTML = product.emoji;
    document.getElementById('productModalPrice').textContent = `₱${product.price.toLocaleString()}`;
    document.getElementById('productModalDescription').textContent = product.description;
    document.getElementById('productModalFeatures').innerHTML = `
        <ul>
            ${product.features.map(f => `<li><i class="fas fa-check" style="color: var(--success-color); margin-right: 10px;"></i>${f}</li>`).join('')}
        </ul>
    `;
    
    const addBtn = document.getElementById('addToCartFromModal');
    addBtn.onclick = () => {
        addToCart(productId);
        modal.classList.remove('active');
    };
    
    modal.classList.add('active');
}

// Get product by ID
function getProduct(id) {
    return products.find(p => p.id === id);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});