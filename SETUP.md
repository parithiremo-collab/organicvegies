# FreshHarvest - Organic Grocery Marketplace Setup Guide

## Overview
FreshHarvest is a full-stack web application for an organic grocery marketplace with authentication, shopping cart, and Stripe payment integration (including UPI support).

**Tech Stack:**
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Authentication: Replit Auth (OAuth 2.0)
- Payments: Stripe (Card & UPI)

---

## Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

3. **PostgreSQL** (v13 or higher)
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

4. **npm** (comes with Node.js)
   - Verify: `npm --version`

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd fresh-harvest

# Or download and extract the ZIP file
unzip fresh-harvest.zip
cd fresh-harvest
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

This will install:
- Frontend dependencies (React, Vite, Tailwind, etc.)
- Backend dependencies (Express, Drizzle ORM, Stripe, etc.)
- All TypeScript types and utilities

---

## Step 3: Setup Environment Variables

Create a `.env` file in the root directory with the following variables:

### Option A: Automatic Setup (Windows)
Run the provided batch file:
```bash
setup.bat
```

### Option B: Manual Setup

1. Copy the template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your values:

```env
# DATABASE CONFIGURATION
DATABASE_URL=postgresql://user:password@localhost:5432/fresh_harvest
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=fresh_harvest

# STRIPE CONFIGURATION (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

# SESSION CONFIGURATION
SESSION_SECRET=your_random_secret_key_min_32_chars_long_123456

# REPLIT AUTH (for production only)
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret
REPLIT_AUTH_REDIRECT_URI=http://localhost:5000/auth/callback

# NODE ENVIRONMENT
NODE_ENV=development

# PORT CONFIGURATION
PORT=5000
```

---

## Step 4: Setup PostgreSQL Database

### Windows (PowerShell or CMD):
```bash
# Login to PostgreSQL
psql -U postgres

# In PostgreSQL CLI:
CREATE DATABASE fresh_harvest;
\q
```

### macOS/Linux:
```bash
# Create database
createdb fresh_harvest

# Verify
psql fresh_harvest -c "SELECT 1"
```

---

## Step 5: Run Database Migrations

```bash
# Generate and run migrations
npm run db:push

# Check database schema
npm run db:studio
```

This will:
- Create all required tables (users, products, cart items, orders, etc.)
- Setup relationships and constraints
- Create indexes for performance

---

## Step 6: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/
2. Sign up or login with your Stripe account
3. Navigate to Developers → API Keys
4. Copy your **Publishable Key** and **Secret Key**
5. Paste them into your `.env` file
6. Keep these keys secure (never commit to git)

**For Testing:**
- Use Stripe Test Mode keys (starting with `pk_test_` and `sk_test_`)
- Test Card: `4242 4242 4242 4242` with any future expiry date and any CVC
- Test UPI: Use any UPI ID format like `success@okhdfcbank`

---

## Step 7: Start the Application

### All-in-One (Recommended):
```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`
- Both are served on the same port with Vite proxy

### Separate Terminals (Alternative):

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

---

## Step 8: Access the Application

1. Open browser: **http://localhost:5000**
2. Login with your email
3. Browse products by category
4. Add items to cart
5. Proceed to checkout
6. Select payment method (UPI or Card)
7. Complete payment with Stripe test credentials

---

## Project Structure

```
fresh-harvest/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utility functions
│   │   ├── i18n/            # Translations (EN, HI, TA)
│   │   └── index.css        # Tailwind + custom styles
│   └── package.json
│
├── server/                    # Backend (Express + Node.js)
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage interface
│   ├── app.ts               # Express app setup
│   ├── stripeClient.ts      # Stripe configuration
│   └── webhookHandlers.ts   # Stripe webhook handlers
│
├── shared/                    # Shared code
│   └── schema.ts            # Database schema (Drizzle ORM)
│
├── .env                      # Environment variables (create this)
├── .env.example             # Environment template
├── drizzle.config.ts        # Database configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (frontend + backend)
npm run dev:server      # Start backend only
npm run dev:client      # Start frontend only

# Database
npm run db:push         # Run migrations
npm run db:studio       # Open database studio (Drizzle Studio)
npm run db:generate     # Generate migrations

# Build
npm run build           # Build frontend for production
npm run build:server    # Build backend for production

# Type checking
npm run type-check      # Check TypeScript types

# Linting
npm run lint            # Run ESLint
```

---

## Troubleshooting

### Issue: Database connection failed
**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database

# Restart PostgreSQL service
# Windows: Services → PostgreSQL
# macOS: brew services restart postgresql
# Linux: sudo systemctl restart postgresql
```

### Issue: Stripe keys not working
**Solution:**
```bash
# Ensure you're using TEST keys (pk_test_ and sk_test_)
# Check .env has both STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
# Restart the server after updating .env
npm run dev
```

### Issue: Port 5000 already in use
**Solution:**
```bash
# Kill the process using port 5000
# Windows (PowerShell as Admin):
Get-Process | Where-Object {$_.Port -eq 5000} | Stop-Process -Force

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=3000
```

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## Features

✅ **Authentication**
- Email/password login with Replit Auth
- Secure session management
- Protected routes

✅ **Product Catalog**
- Browse products by category
- Filter by organic certification
- Product details with pricing
- Multi-language support (EN, HI, TA)

✅ **Shopping Cart**
- Add/remove items
- Persistent cart (database-backed)
- Quantity management
- Cart summary

✅ **Checkout**
- Delivery address collection
- Delivery time slot selection
- Free delivery over ₹500
- Address validation

✅ **Payments**
- 💳 Credit/Debit Card (via Stripe)
- 💸 UPI Payments (via Stripe)
- Secure Stripe checkout
- Payment status tracking

✅ **Orders**
- Order history
- Order details view
- Payment status
- Delivery information

✅ **Multi-Language**
- English
- Hindi (Devanagari script)
- Tamil (Tamil script)
- Language switcher in header

---

## Deployment

### Deploy to Replit
1. Push code to GitHub
2. Import repository into Replit
3. Replit automatically installs dependencies
4. Set up environment variables in Secrets
5. Database and webhooks auto-configured
6. Click "Publish" to make live

### Deploy to Other Platforms
- **Heroku**: Use PostgreSQL addon + Stripe webhooks
- **Vercel** (Frontend) + **Railway** (Backend): Separate deployments
- **AWS**: EC2 + RDS + Lambda for webhooks
- **Azure**: App Service + Database + Functions

---

## Development Tips

1. **Enable Debug Logging:**
   ```env
   DEBUG=app:*
   ```

2. **Use Drizzle Studio:**
   ```bash
   npm run db:studio
   ```

3. **Test Stripe Webhooks Locally:**
   ```bash
   stripe listen --forward-to localhost:5000/webhooks/stripe
   ```

4. **Hot Reload:**
   - Frontend changes auto-reload (Vite)
   - Backend changes auto-restart (tsx watch)

---

## Security Checklist

Before deploying to production:

- [ ] Change `SESSION_SECRET` to a strong random value
- [ ] Use production Stripe keys (not test keys)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add CORS restrictions
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor error logs

---

## Support & Documentation

- **Stripe Docs**: https://stripe.com/docs
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## License

This project is provided as-is for educational and commercial use.

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
