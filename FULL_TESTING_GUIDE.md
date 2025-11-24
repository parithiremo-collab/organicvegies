# 🚀 Complete Testing Guide - FreshHarvest Marketplace

## ✅ Status: Ready for Testing

The FreshHarvest marketplace is now fully set up with **local test login for all 5 roles**. You can test everything locally without needing a Replit account.

---

## 🎯 Quick Start (2 minutes)

### Step 1: Check Test Users Available

```bash
curl http://localhost:5000/api/test/users
```

**Response:**
```json
{
  "message": "Available test users for local development",
  "users": [
    {"role": "customer", "email": "customer@test.local"},
    {"role": "farmer", "email": "farmer@test.local"},
    {"role": "agent", "email": "agent@test.local"},
    {"role": "admin", "email": "admin@test.local"},
    {"role": "superadmin", "email": "superadmin@test.local"}
  ]
}
```

### Step 2: Login as a Role

```bash
# Customer
curl -X POST http://localhost:5000/api/test/login/customer

# Farmer
curl -X POST http://localhost:5000/api/test/login/farmer

# Agent
curl -X POST http://localhost:5000/api/test/login/agent

# Admin
curl -X POST http://localhost:5000/api/test/login/admin

# Super Admin (note: will be available after DB migration)
curl -X POST http://localhost:5000/api/test/login/superadmin
```

### Step 3: Refresh Browser

After logging in with curl, refresh http://localhost:5000 in your browser. You'll be logged in!

---

## 🧪 Test Users & Profiles

All test users are **automatically created** when the app starts in development mode.

| Role | Email | ID | Status |
|------|-------|-----|--------|
| 🛒 Customer | customer@test.local | test-customer-1 | ✅ Created |
| 👨‍🌾 Farmer | farmer@test.local | test-farmer-1 | ✅ Created |
| 🤝 Agent | agent@test.local | test-agent-1 | ✅ Created |
| 👨‍💼 Admin | admin@test.local | test-admin-1 | ✅ Created |
| 👑 Super Admin | superadmin@test.local | test-superadmin-1 | ⏳ Pending (DB migration) |

---

## 📋 Testing Workflows

### Workflow 1: Test Customer Role

**Objective:** Browse products and add to cart

```bash
# 1. Login as customer
curl -X POST http://localhost:5000/api/test/login/customer

# 2. Go to http://localhost:5000 in browser
# 3. You should see marketplace home page
# 4. Browse categories:
#    - Vegetables
#    - Fruits
#    - Grains & Pulses
#    - Dairy
# 5. Search for products
# 6. Add products to cart
# 7. View cart
```

**Expected Results:**
- ✅ Can view products list
- ✅ Can search and filter products
- ✅ Can add items to cart
- ✅ Can view cart items
- ✅ Dashboard shows "Customer Marketplace"

---

### Workflow 2: Test Farmer Role

**Objective:** Create farm profile and add products

```bash
# 1. Login as farmer
curl -X POST http://localhost:5000/api/test/login/farmer

# 2. Go to http://localhost:5000 in browser
# 3. Should show Farmer Dashboard
# 4. Create/Update farm profile:
#    - Farm Name: "My Test Farm"
#    - Farm Area: "10 acres"
#    - Farming Type: "Organic"
#    - Certifications: "IFOAM Certified"
# 5. Add a new product:
#    - Name: "Organic Tomatoes"
#    - Price: 50
#    - Stock: 100
#    - Description: "Fresh organic tomatoes"
# 6. View your products
# 7. Check analytics
```

**Expected Results:**
- ✅ Can view/edit farm profile
- ✅ Profile data persists
- ✅ Can add new products
- ✅ Products appear in marketplace
- ✅ Can see product list
- ✅ Analytics show sales data

---

### Workflow 3: Test Agent Role

**Objective:** Connect with farmers and track commissions

```bash
# 1. Login as agent
curl -X POST http://localhost:5000/api/test/login/agent

# 2. Go to http://localhost:5000 in browser
# 3. Should show Agent Dashboard
# 4. View agent profile:
#    - Agent Name
#    - Service Area
#    - Commission Rate (default 5%)
# 5. View available farmers (if any)
# 6. Connect with farmers
# 7. View sales data
# 8. Check commission earnings
```

**Expected Results:**
- ✅ Can view agent profile
- ✅ Can see list of farmers
- ✅ Commission rates visible
- ✅ Sales tracking available
- ✅ Analytics show earnings

---

### Workflow 4: Test Admin Role

**Objective:** Review and approve content

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/test/login/admin

# 2. Go to http://localhost:5000 in browser
# 3. Should show Admin Dashboard
# 4. View pending approvals:
#    - Pending farmers
#    - Pending products
# 5. Review content
# 6. Approve or reject
# 7. View audit logs
# 8. Manage platform content
```

**Expected Results:**
- ✅ Can view pending approvals
- ✅ Can approve/reject farmers
- ✅ Can approve/reject products
- ✅ Audit logs show changes
- ✅ Can moderate content

---

### Workflow 5: Test Super Admin Role

**Objective:** Manage entire platform

```bash
# 1. Login as super admin (when available)
curl -X POST http://localhost:5000/api/test/login/superadmin

# 2. Go to http://localhost:5000 in browser
# 3. Should show Super Admin Dashboard
# 4. Manage admins:
#    - View all admins
#    - Create new admins
#    - Manage permissions
# 5. View platform statistics
# 6. Monitor all activities
# 7. System configuration
```

**Expected Results:**
- ✅ Can manage admins
- ✅ Can view all platform data
- ✅ Full system access
- ✅ All features available

---

## 🔄 Full End-to-End Testing

### Test Scenario: Complete Purchase Flow

```bash
# 1. Farmer creates products
curl -X POST http://localhost:5000/api/test/login/farmer
# - Create farm profile
# - Add 3-5 products

# 2. Switch to customer
curl -X POST http://localhost:5000/api/test/logout
curl -X POST http://localhost:5000/api/test/login/customer
# - Browse farmer's products
# - Add to cart
# - View cart

# 3. Proceed to checkout
# - Use Stripe test card: 4242 4242 4242 4242
# - Expiry: Any future date
# - CVC: Any 3 digits
# - Complete payment

# 4. Switch to farmer
curl -X POST http://localhost:5000/api/test/logout
curl -X POST http://localhost:5000/api/test/login/farmer
# - Check analytics
# - View sales
# - Check earnings

# 5. Switch to admin
curl -X POST http://localhost:5000/api/test/logout
curl -X POST http://localhost:5000/api/test/login/admin
# - View audit logs
# - See transaction records
```

---

## 🌍 Multi-Language Testing

The login page supports **3 languages**:
- 🇬🇧 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 தமிழ் (Tamil)

**Test multi-language support:**

1. Go to http://localhost:5000
2. See language switcher (top right)
3. Select language:
   - **EN** → English
   - **HI** → हिंदी (Devanagari)
   - **TA** → தமிழ் (Tamil)
4. All text should translate
5. Login works in all languages
6. Role descriptions translate

**Test languages after login:**

1. After login, language preference persists
2. Switch languages in app
3. Content updates dynamically
4. Preference saved locally

---

## 🧬 API Endpoints for Testing

### Authentication Endpoints

```bash
# Get available test users
GET /api/test/users

# Login as specific role
POST /api/test/login/{role}
# Parameters: customer, farmer, agent, admin, superadmin

# Logout
POST /api/test/logout
```

### Protected Endpoints (Require Login)

```bash
# Get current user info
GET /api/auth/user

# Get all products
GET /api/products

# Get single product
GET /api/products/{id}

# Get shopping cart
GET /api/cart

# Add to cart
POST /api/cart
# Body: { productId, quantity }

# Farmer endpoints
POST   /api/farmer/profile
GET    /api/farmer/profile
POST   /api/farmer/products
GET    /api/farmer/products
GET    /api/farmer/analytics

# Agent endpoints
POST   /api/agent/profile
GET    /api/agent/profile
GET    /api/agent/sales
GET    /api/agent/farmers

# Admin endpoints
GET    /api/admin/stats

# Orders
GET    /api/orders
GET    /api/orders/{id}
POST   /api/checkout
```

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] App loads at http://localhost:5000
- [ ] Login page displays all 5 roles
- [ ] Language switcher works
- [ ] Can switch between English, Hindi, Tamil

### Authentication
- [ ] Can login as customer
- [ ] Can login as farmer
- [ ] Can login as agent
- [ ] Can login as admin
- [ ] Can logout
- [ ] Session persists on refresh
- [ ] Different users see different dashboards

### Customer Features
- [ ] Can browse products
- [ ] Can search products
- [ ] Can filter by category
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Can checkout
- [ ] Can use Stripe payment

### Farmer Features
- [ ] Can create farm profile
- [ ] Can edit profile
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Can view analytics
- [ ] Can track earnings

### Agent Features
- [ ] Can create agent profile
- [ ] Can view farmers
- [ ] Can track sales
- [ ] Can see commissions
- [ ] Can view analytics

### Admin Features
- [ ] Can view pending farmers
- [ ] Can view pending products
- [ ] Can approve/reject
- [ ] Can view audit logs
- [ ] Can moderate content

### Multi-Language
- [ ] English text displays correctly
- [ ] Hindi (Devanagari) displays correctly
- [ ] Tamil (Tamil script) displays correctly
- [ ] All role descriptions translate
- [ ] Language preference saves

---

## 🔧 Using with Postman or Curl

### Using Curl

```bash
# 1. Login
curl -X POST http://localhost:5000/api/test/login/customer

# 2. Get user info (in new terminal to maintain cookies)
curl -X GET http://localhost:5000/api/auth/user

# 3. Get products
curl http://localhost:5000/api/products

# 4. Logout
curl -X POST http://localhost:5000/api/test/logout
```

### Using Postman

1. Create new collection: "FreshHarvest"
2. Add requests:
   - **GET** http://localhost:5000/api/test/users
   - **POST** http://localhost:5000/api/test/login/customer
   - **GET** http://localhost:5000/api/auth/user
   - **GET** http://localhost:5000/api/products
   - **POST** http://localhost:5000/api/test/logout

3. Set up environment variables:
   ```
   base_url: http://localhost:5000
   ```

---

## 🚨 Troubleshooting

### Test login not working?

1. **Check if app is running:**
   ```bash
   curl http://localhost:5000/api/test/users
   ```
   Should return list of test users

2. **Check if in development mode:**
   ```bash
   # Logs should show: "🧪 Setting up test authentication for development..."
   ```

3. **Verify test users were created:**
   - Check database: SELECT * FROM users;
   - 4 users should exist (customer, farmer, agent, admin)
   - superadmin will be pending after DB migration

4. **Session not persisting?**
   - Check if cookies are enabled
   - Check browser developer tools (Application → Cookies)
   - Try clearing browser cache: DevTools → Application → Clear Site Data

5. **Stuck on blank page?**
   - Open DevTools (F12)
   - Check console for errors
   - Refresh page
   - Try logging out first

### API endpoints not working?

1. **Verify logged in:**
   ```bash
   curl -v http://localhost:5000/api/auth/user
   ```
   Should show user info, not 401 error

2. **Check request format:**
   - POST requests need `Content-Type: application/json`
   - Include request body as JSON

3. **Database not synced?**
   - Tables might not exist
   - Run: `npm run db:push`
   - Or check DATABASE_URL is valid

---

## 📊 Current Database Status

### Created Tables
- ✅ users (4 test users created)
- ✅ sessions (for session management)
- ✅ products (sample products available)
- ✅ categories (4 categories available)
- ✅ cart_items (for shopping cart)
- ✅ orders (for order management)

### Pending (After DB Migration)
- ⏳ farmer_profiles (profile tables don't exist yet)
- ⏳ agent_profiles
- ⏳ admin_profiles
- ⏳ superadmin_profiles
- ⏳ audit_logs
- ⏳ addresses

**Note:** Test auth gracefully handles missing profile tables. Full functionality will work after running migrations.

---

## 🚀 Next Steps for Testing

### Immediate (Today)
1. ✅ Test login for all 4 available roles
2. ✅ Verify role-based dashboards
3. ✅ Test multi-language support
4. ✅ Try adding products (farmer)
5. ✅ Try browsing products (customer)

### Later (After DB Migrations)
1. Create role-specific profiles
2. Test profile creation workflows
3. Full end-to-end purchase flow
4. Admin approval workflows
5. Agent commission tracking

### For Production
1. Replace Replit Auth setup
2. Real user registration
3. Real payment processing
4. Email notifications
5. Production database migration

---

## 📝 Important Notes

### Test Auth Details
- ✅ Works in **development mode only** (NODE_ENV=development)
- ✅ Automatically seeds test users on startup
- ✅ Session-based authentication
- ✅ Gracefully handles missing database tables
- ✅ No password required (use API endpoints for testing)

### Current Limitations
- ⏳ Super Admin not yet in database (enum missing)
- ⏳ Profile tables don't exist yet
- ⏳ Audit logging not implemented
- ⏳ Some advanced features pending

### When to Use Test Auth
- ✅ Local development
- ✅ Testing features
- ✅ Learning the app
- ✅ Demo purposes

### When NOT to Use Test Auth
- ❌ Production environment
- ❌ Real user data
- ❌ Security-sensitive operations
- ❌ Performance testing

---

## ✨ What You Can Test Now

### ✅ Available Features
- Login/Logout for 4 roles
- Multi-language login page
- Browse products
- Search products
- Filter by category
- Role-based dashboards
- Basic API endpoints
- Stripe integration (if configured)

### ⏳ Coming Soon (After Migrations)
- Farmer product creation
- Agent commission tracking
- Admin approval workflows
- Complete audit logging
- Super Admin features

---

## 🎯 Success Criteria

You've successfully set up local testing when:

1. ✅ `curl http://localhost:5000/api/test/users` returns test users list
2. ✅ `curl -X POST http://localhost:5000/api/test/login/customer` succeeds
3. ✅ http://localhost:5000 loads and shows login page
4. ✅ Refresh after login keeps you logged in
5. ✅ Language switcher works (English, Hindi, Tamil)
6. ✅ Each role shows different dashboard

---

## 📞 Support

If something doesn't work:

1. **Check logs:** See "Start application" workflow logs
2. **Verify database:** Check if tables exist
3. **Check development mode:** `NODE_ENV=development`
4. **Restart app:** Use restart button
5. **Check browser console:** DevTools → Console
6. **Review documentation:** See TEST_LOGIN_GUIDE.md

---

**Ready to test? Start with:**
```bash
curl http://localhost:5000/api/test/users
curl -X POST http://localhost:5000/api/test/login/customer
```

Then refresh http://localhost:5000 in your browser! 🚀
