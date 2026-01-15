// Main JavaScript for Website Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Filter Products
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const filter = btn.dataset.filter;
            displayProducts(filter);
        });
    });
    
    // Search Functionality
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', () => {
        showSearchModal();
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactForm(e);
    });
    
    // Scroll to Top Button
    createScrollToTopButton();
    
    // Add parallax effect to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Animate elements on scroll
    observeElements();
});

// Search Modal
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-search"></i> Search Products</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="text" id="searchInput" placeholder="Search for products..." 
                    style="width: 100%; padding: 15px; background: rgba(255,255,255,0.05); border: 2px solid rgba(243,156,18,0.3); border-radius: 12px; color: white; font-size: 16px; margin-bottom: 20px;">
                <div id="searchResults"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const searchInput = document.getElementById('searchInput');
    searchInput.focus();
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchProducts(query);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function searchProducts(query) {
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    
    const searchResults = document.getElementById('searchResults');
    
    if (query.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">Start typing to search...</p>';
        return;
    }
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">No products found</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="showProductDetails(${product.id}); document.querySelector('.modal').remove();" 
            style="display: flex; gap: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s;">
            <div style="font-size: 40px;">${product.emoji}</div>
            <div style="flex: 1;">
                <div style="font-weight: 700; margin-bottom: 5px;">${product.name}</div>
                <div style="color: var(--primary-color); font-size: 14px; margin-bottom: 5px;">${getCategoryName(product.category)}</div>
                <div style="color: var(--success-color); font-weight: 700;">₱${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
    
    // Add hover effect
    const searchResultStyle = document.createElement('style');
    searchResultStyle.textContent = `
        .search-result-item:hover {
            background: rgba(243,156,18,0.2) !important;
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(searchResultStyle);
}

// Handle Contact Form
function handleContactForm(e) {
    const form = e.target;
    const formData = new FormData(form);
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending (in real app, this would be an API call)
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Scroll to Top Button
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 5px 20px rgba(243,156,18,0.5);
        transition: all 0.3s;
        z-index: 1000;
    `;
    
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1) translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1) translateY(0)';
    });
}

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe sections
    document.querySelectorAll('.shop-section, .about-section, .contact-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearchModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Loading Screen
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s;
    `;
    loader.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">🎮</div>
            <div style="color: var(--primary-color); font-size: 24px; font-weight: 900;">Loading...</div>
        </div>
    `;
    
    document.body.prepend(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1000);
});

// Add mouse follower effect (optional cool feature)
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFollower() {
    const diffX = mouseX - followerX;
    const diffY = mouseY - followerY;
    
    followerX += diffX * 0.1;
    followerY += diffY * 0.1;
    
    const follower = document.querySelector('.mouse-follower');
    if (follower) {
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(animateFollower);
}

// Create mouse follower
const follower = document.createElement('div');
follower.className = 'mouse-follower';
follower.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.5;
    transition: transform 0.2s;
`;
document.body.appendChild(follower);
animateFollower();

// Scale up follower on clickable elements
document.querySelectorAll('button, a, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
        follower.style.transform = 'scale(1)';
    });
});

console.log('🎮 Tindahan ni Steirner - Blox Fruits Shop Ready!');
console.log('💎 Premium items available now!');