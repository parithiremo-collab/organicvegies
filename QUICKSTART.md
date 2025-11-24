# Quick Start Guide - FreshHarvest

## For Impatient Developers ⚡

### Fastest Setup (5 minutes)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## Manual Quick Setup (10 minutes)

```bash
# 1. Clone or extract project
cd fresh-harvest

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env and add:
#    - STRIPE_SECRET_KEY=sk_test_...
#    - STRIPE_PUBLISHABLE_KEY=pk_test_...
#    - Create PostgreSQL database: createdb fresh_harvest

# 5. Setup database
npm run db:push

# 6. Start development
npm run dev
```

**Open browser:** http://localhost:5000

---

## Test the App

1. **Login**
   - Click "Login" in header
   - Use any email
   - You're authenticated!

2. **Browse Products**
   - See organic vegetables, fruits, grains, dairy
   - View products by category
   - Check prices

3. **Add to Cart**
   - Click "Add to Cart" on any product
   - Adjust quantity
   - See cart count update

4. **Checkout**
   - Click cart icon in header → "Checkout"
   - Fill delivery address
   - Select delivery time slot
   - **Choose payment method:**
     - **UPI** (default for Indian users)
     - **Credit/Debit Card**
   - Click "Proceed to Payment"

5. **Pay with Test Credentials**
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVC:** Any 3 digits (e.g., 123)
   - **UPI:** `success@okhdfcbank`

6. **See Order**
   - After payment, redirected to order detail
   - View in "Orders" menu

---

## Features to Test

✅ **Authentication**
- Login/logout
- Session persistence

✅ **Shopping**
- Browse by category
- Search products
- Add/remove from cart
- Persistent cart

✅ **Checkout**
- Address validation
- Time slot selection
- Free delivery over ₹500
- Tax calculation

✅ **Payment**
- UPI payment option
- Card payment option
- Stripe sandbox testing
- Payment success/failure

✅ **Orders**
- Order history
- Order details
- Payment status

✅ **Multi-Language**
- English
- Hindi (Devanagari)
- Tamil (Tamil script)
- Language switcher in header

---

## Stripe Test Credentials

### Card Payments
- **Valid Card:** `4242 4242 4242 4242`
- **Declined Card:** `4000 0000 0000 0002`
- **3D Secure Card:** `4000 0025 0000 3155`

### UPI Payments
- **Success:** `success@okhdfcbank`
- **Failure:** `failure@okhdfcbank`

Use any future expiry and any CVC (3 digits).

---

## Troubleshooting

**Port 5000 in use?**
```bash
# Kill process on port 5000
# Windows: Get-Process | Where-Object {$_.Port -eq 5000} | Stop-Process -Force
# macOS/Linux: lsof -ti:5000 | xargs kill -9
```

**Database error?**
```bash
# Restart PostgreSQL
# macOS: brew services restart postgresql
# Windows: Services → PostgreSQL → Restart
# Linux: sudo systemctl restart postgresql
```

**Stripe keys not working?**
```bash
# Use TEST keys (pk_test_* and sk_test_*)
# Verify in .env file
# Restart server: npm run dev
```

---

## Project Structure

```
fresh-harvest/
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared types
├── SETUP.md         # Detailed setup guide
├── QUICKSTART.md    # This file
├── DEPLOYMENT.md    # Deployment guide
└── setup.bat/sh     # Automated setup scripts
```

---

## Common Commands

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run db:push         # Run database migrations
npm run db:studio       # Open Drizzle Studio (DB UI)
npm run type-check      # Check TypeScript
```

---

## Next Steps

1. Read **SETUP.md** for detailed configuration
2. Read **DEPLOYMENT.md** for production deployment
3. Check out **client/src/pages/** for feature implementation
4. Explore **server/routes.ts** for API endpoints

---

**Happy coding!** 🚀
