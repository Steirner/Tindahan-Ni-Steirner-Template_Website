# 🚀 QUICK START GUIDE - Tindahan ni Steirner

## 📦 What You Have

Your complete e-commerce website with:
- ✅ Full frontend (HTML, CSS, JavaScript)
- ✅ Backend API (PHP)
- ✅ Database schema (MySQL)
- ✅ Payment integrations (PayPal, GCash, Cards)
- ✅ Email notifications
- ✅ Shopping cart system
- ✅ Responsive design
- ✅ Security features

## ⚡ 5-Minute Setup

### Step 1: Upload Files
Upload ALL files to your web hosting:
- cPanel: Use File Manager or FTP
- Upload to `/public_html/` or `/www/`

### Step 2: Create Database
In cPanel > MySQL Databases:
1. Create new database: `tindahan_db`
2. Create user with password
3. Grant ALL privileges
4. Import `database.sql` via phpMyAdmin

### Step 3: Configure
Edit `php/config.php`:
```php
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('GCASH_NUMBER', '09XX-XXX-XXXX'); // Your GCash number
```

### Step 4: Test
Visit your website: `https://yourdomain.com`

## 💳 Payment Setup (Choose One or All)

### Option 1: GCash Only (Easiest)
1. Update your GCash number in `config.php`
2. Customers send payment and provide reference
3. You manually verify and deliver

### Option 2: PayPal
1. Create account at paypal.com
2. Get API keys from developer.paypal.com
3. Add keys to `config.php`

### Option 3: Credit/Debit Cards
1. Create Stripe account at stripe.com
2. Get API keys from dashboard
3. Add keys to `config.php`

## 📧 Email Setup

### Gmail SMTP (Recommended)
1. Enable 2-Factor Auth on Gmail
2. Generate App Password
3. Add to `config.php`:
```php
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
```

## 🎨 Customization

### Change Colors
Edit `css/style.css` line 6-10:
```css
:root {
    --primary-color: #f39c12;  /* Gold */
    --secondary-color: #e67e22; /* Orange */
    --accent-color: #3498db;    /* Blue */
}
```

### Add Products
1. Go to phpMyAdmin
2. Open `products` table
3. Insert new row with product details
4. Or edit `js/products.js` directly

### Change Logo
Replace `logo.html` with your design

## 🔒 Security Checklist

- [ ] Change default database password
- [ ] Enable HTTPS/SSL
- [ ] Update admin email in config.php
- [ ] Test all payment methods
- [ ] Set proper file permissions (755 for directories, 644 for files)

## 📱 Testing

### Test Shopping Flow
1. Browse products ✓
2. Add to cart ✓
3. Checkout ✓
4. Select payment method ✓
5. Complete order ✓
6. Check email notification ✓

### Test Each Payment Method
- GCash: Enter reference number
- PayPal: Enter transaction ID
- Card: Enter card details

## 🆘 Common Issues

**Problem**: Can't connect to database
- **Solution**: Check credentials in config.php

**Problem**: Emails not sending
- **Solution**: Verify SMTP settings, use Gmail App Password

**Problem**: Payment not working
- **Solution**: Check API keys, test in sandbox mode first

**Problem**: Logo not showing
- **Solution**: Check file path, ensure logo.html is uploaded

## 📞 Need Help?

1. Check README.md for detailed instructions
2. Review error logs in `php/logs/`
3. Contact support: support@tindahansteirner.com

## 🎯 Next Steps

After basic setup works:
1. Test all features thoroughly
2. Add more products
3. Customize design
4. Set up automated backups
5. Add Google Analytics
6. Market your shop!

## 📊 File Structure

```
your-website/
├── index.html          (Main page)
├── logo.html           (Your logo)
├── .htaccess           (Security & SEO)
├── README.md           (Full documentation)
├── database.sql        (Database schema)
├── css/
│   └── style.css       (All styles)
├── js/
│   ├── products.js     (Product data)
│   ├── cart.js         (Shopping cart)
│   ├── checkout.js     (Payment)
│   └── main.js         (UI interactions)
└── php/
    ├── config.php      (Configuration)
    ├── process_order.php
    ├── payment_gateway.php
    └── email_handler.php
```

## 🎮 Ready to Go!

Your shop is ready for customers! Start promoting:
- Share on Facebook/Discord
- Create promotional posts
- Offer launch discounts
- Engage with Blox Fruits community

---

**🌟 Pro Tip**: Start with manual GCash payments for simplicity, then add PayPal/Stripe as you grow!

Good luck with your shop! 💎🎮