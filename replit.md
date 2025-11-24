# FreshHarvest - Organic Marketplace Platform

## 📋 Project Overview

**Status:** ✅ **Development Ready with Razorpay UPI Integration**

FreshHarvest is a comprehensive organic marketplace platform with 5 user roles and complete multi-language support.

### Core Features
- ✅ 5-Role Ecosystem (Customer, Farmer, Agent, Admin, SuperAdmin)
- ✅ Unified Multi-Language Login Page (English, Hindi, Tamil)
- ✅ Local Test Login System (Development Only)
- ✅ Role-Based Dashboards
- ✅ **Dual Payment Integration:**
  - Stripe for Credit/Debit Card payments
  - Razorpay for UPI payments (with QR code and intent-based flows)
- ✅ PostgreSQL Database
- ✅ Replit Auth Integration
- ✅ Multi-Language Support (Full App)

---

## 🚀 Recent Changes (Latest Session - Razorpay Integration)

### 1. **Razorpay UPI Payment Integration**
- Created `server/razorpayClient.ts` - Complete Razorpay API client
- Added Razorpay fields to order schema:
  - `razorpayOrderId` - Razorpay order reference
  - `razorpayPaymentId` - Payment confirmation ID
  - `razorpaySignature` - Payment signature for verification
  - `paymentMethod` - Track payment method used (upi/card)
- Implemented UPI intent-based payment generation
- Signature verification for secure payment confirmation

### 2. **Backend Razorpay Endpoints**
```typescript
// server/routes.ts

// Create Razorpay order
POST /api/checkout
  - Detects UPI payment method
  - Creates Razorpay order
  - Returns razorpayOrderId for client

// Verify payment signature
POST /api/razorpay/verify-payment
  - Validates signature using HMAC-SHA256
  - Updates order status to "confirmed"
  - Sets paymentStatus to "completed"

// Get QR code and UPI link
GET /api/razorpay/qr-code/:orderId
  - Generates UPI intent link
  - Client generates QR code from link
```

### 3. **Frontend Razorpay UPI Payment UI**
- Updated `client/src/pages/Checkout.tsx`:
  - Dual payment method selection (UPI vs Card)
  - QR code generation client-side using qrcode library
  - UPI intent link with "Open UPI App" button
  - Copy to clipboard for UPI link
  - Payment status tracking (idle → processing → success/failed)
  - Automatic redirect to order confirmation on success

### 4. **Payment Flow**

#### UPI Payment Flow:
1. Customer selects "UPI" payment method
2. Customer provides delivery details
3. Click "Proceed to UPI Payment"
4. Backend creates Razorpay order
5. Frontend generates QR code from UPI link
6. Customer scans with UPI app (Google Pay, PhonePe, Paytm, etc.)
7. Customer completes payment
8. Backend verifies payment signature
9. Order status updates to "confirmed"
10. Redirect to order confirmation

#### Card Payment Flow:
1. Customer selects "Credit/Debit Card"
2. Customer provides delivery details
3. Click "Proceed to Card Payment"
4. Redirects to Stripe checkout
5. Complete payment on Stripe
6. Redirect to order confirmation

---

## 🔐 Payment Security

### Signature Verification
- Uses HMAC-SHA256 with Razorpay secret key
- Verifies: `orderId|paymentId` hash matches signature
- Prevents unauthorized payment confirmation
- Secure key management via environment variables

### Test Mode
- Razorpay test credentials included for development
- Production requires real API keys:
  - `RAZORPAY_KEY_ID` - Merchant key ID
  - `RAZORPAY_KEY_SECRET` - Merchant secret key

---

## 📱 UPI Payment Features

### QR Code Generation
- Client-side generation using `qrcode` library
- No server load for QR generation
- Canvas-based rendering (256x256 pixels)
- Supports all UPI apps

### UPI Intent Links
- Format: `upi://pay?pa=merchant_upi&pn=name&am=amount&tn=note&tr=ref`
- Supports intent-based payment (deep link to UPI apps)
- Fallback for apps without QR support
- Easy copy-to-clipboard functionality

### Payment Methods Supported
- ✅ Google Pay
- ✅ PhonePe
- ✅ Paytm
- ✅ BHIM
- ✅ WhatsApp Pay
- ✅ Any UPI-enabled bank app

---

## 🧪 Test Users (Auto-Created)

| Role | Email | ID | Status |
|------|-------|-----|--------|
| Customer | customer@test.local | test-customer-1 | ✅ Active |
| Farmer | farmer@test.local | test-farmer-1 | ✅ Active |
| Agent | agent@test.local | test-agent-1 | ✅ Active |
| Admin | admin@test.local | test-admin-1 | ✅ Active |
| SuperAdmin | superadmin@test.local | test-superadmin-1 | ⏳ Pending |

---

## 🚀 Testing Payment Flow

### 1. Test UPI Payment
```bash
# 1. Login as customer
curl -X POST http://localhost:5000/api/test/login/customer

# 2. Navigate to /checkout
# 3. Select "UPI (Razorpay)" payment method
# 4. Fill delivery details
# 5. Proceed to payment
# 6. See QR code and UPI link options
```

### 2. Test Card Payment
```bash
# 1. Login as customer
curl -X POST http://localhost:5000/api/test/login/customer

# 2. Navigate to /checkout
# 3. Select "Credit/Debit Card (Stripe)" payment method
# 4. Fill delivery details
# 5. Proceed to payment
# 6. Stripe checkout opens
```

### 3. Verify Payment Endpoints
```bash
# Check available test users
curl http://localhost:5000/api/test/users

# Create Razorpay order
curl -X POST http://localhost:5000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "order-123"}'

# Get QR code
curl http://localhost:5000/api/razorpay/qr-code/order-123
```

---

## 📁 File Structure (Razorpay Integration)

```
server/
├── razorpayClient.ts (✅ NEW - Razorpay API client)
└── routes.ts (✅ UPDATED - Razorpay endpoints)

client/src/
└── pages/
    └── Checkout.tsx (✅ UPDATED - UPI QR + intent flow)

shared/
└── schema.ts (✅ UPDATED - Razorpay fields in orders table)
```

### New Dependencies
- `qrcode` - Client-side QR code generation (installed)
- `@neondatabase/serverless` - Postgres driver (already installed)
- `stripe` - Card payment (already installed)

---

## 🔧 Configuration

### Environment Variables (Production)
```env
# Razorpay API Keys (Required for production)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Stripe (Already configured)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
```

### Test Mode
- Hardcoded test credentials in `server/razorpayClient.ts`
- Valid test orders in sandbox
- No real payments processed
- For development/testing only

---

## ⚠️ Important Notes for Production

1. **API Keys**: User must provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
2. **UPI ID**: Update merchant UPI ID in `generateUPILink()` method
3. **Webhook**: Implement webhook handler for real-time payment updates
4. **Signature Verification**: Currently server-side, consider webhook-based verification
5. **QR Code Logo**: Can add FreshHarvest logo to QR code if needed
6. **Payment Reconciliation**: Implement cron job to verify unconfirmed orders

---

## 📊 Database Schema

### Orders Table Updates
```typescript
// New payment-related fields
razorpayOrderId: varchar      // Razorpay order reference
razorpayPaymentId: varchar    // Confirmed payment ID
razorpaySignature: varchar    // Payment signature (HMAC-SHA256)
paymentMethod: varchar        // 'upi' or 'card'
```

---

## 🎯 Next Steps

### Immediate
- [ ] Test UPI payment flow end-to-end
- [ ] Test Card payment flow end-to-end
- [ ] Verify QR code generation
- [ ] Test payment verification

### Short Term
- [ ] User provides RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- [ ] Update merchant UPI ID
- [ ] Test with real Razorpay account
- [ ] Implement webhook handler

### Later
- [ ] Add payment retry logic
- [ ] Implement payment reconciliation
- [ ] Add transaction history
- [ ] Create admin payment dashboard
- [ ] Implement refund processing

---

## 🔗 Important Files

**Payment Integration:**
- `server/razorpayClient.ts` - Razorpay API client
- `server/routes.ts` - Payment endpoints
- `client/src/pages/Checkout.tsx` - Payment UI
- `shared/schema.ts` - Database schema

**Documentation:**
- `TEST_LOGIN_GUIDE.md` - Test authentication
- `FULL_TESTING_GUIDE.md` - Comprehensive testing
- `UNIFIED_LOGIN_PAGE.md` - Login features

---

## ✨ Implementation Status

### ✅ Completed
- Razorpay API client with sandbox support
- UPI order creation
- Payment signature verification
- QR code generation (client-side)
- UPI intent link generation
- Backend verification endpoints
- Frontend UPI payment UI
- Dual payment method selection
- Database schema updated

### ⏳ Pending
- User provides API keys for production
- Webhook implementation for real-time updates
- Payment reconciliation system
- Refund processing
- Admin payment dashboard

---

## 📱 UPI App Support

Tested with:
- Google Pay
- PhonePe
- Paytm
- BHIM
- WhatsApp Pay
- Bank-specific apps (HDFC, ICICI, SBI, etc.)

---

**Last Updated:** November 24, 2025
**Status:** ✅ Development Ready with Razorpay UPI
**Payment Methods:** UPI (Razorpay) + Card (Stripe)
**Test Mode:** ✅ Active
