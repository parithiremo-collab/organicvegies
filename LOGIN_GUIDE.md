# FreshHarvest - Complete Login Guide

**How to Login to Different User Roles**

---

## 🔐 Authentication Overview

All users login through **Replit Auth** (OAuth). Once authenticated, the system routes them to the appropriate dashboard based on their role.

### Login Flow
```
1. User clicks "Login" button
2. Redirected to Replit Auth
3. User enters email & password
4. Auth successful
5. System checks user's role in database
6. Routes to appropriate dashboard
```

---

## 👤 Step 1: Create User Accounts

All users must first **create an account via Replit Auth**. Everyone starts as a **customer** by default.

### Register New Account
1. Open the app at `http://localhost:5000`
2. Click **"Login"** button (top right)
3. You'll see Replit Auth login page
4. Click **"Create Account"** if new user
5. Enter email and password
6. Submit
7. Account created with `role="customer"` by default

### Test Accounts (Already Created)
If you have existing accounts in the database, you can use those emails to login.

---

## 🔄 Step 2: Assign Roles to Users

Users must be assigned their role to access specific dashboards. Here are the methods:

### Method 1: Manual Database Update (Quickest for Testing)

Open your PostgreSQL database and run these SQL commands:

#### Create a Farmer (Seller)
```sql
UPDATE users SET role = 'seller' WHERE email = 'farmer@example.com';
```

#### Create an Agent
```sql
UPDATE users SET role = 'agent' WHERE email = 'agent@example.com';
```

#### Create an Admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

#### Create a Super Admin
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'superadmin@example.com';
```

### Method 2: Via SuperAdmin Dashboard (Production)

1. Login as SuperAdmin
2. Go to "Admin Management" tab
3. Click "Create Admin" button
4. Enter admin email
5. System automatically creates admin account

⚠️ **Note:** SuperAdmin can only create admins. For farmers and agents, use Method 1 or extend the system.

---

## 🏠 Dashboard Access After Login

Once logged in, the system **automatically routes** to your role dashboard:

### Role → Dashboard Mapping

| Role | Dashboard | URL | View |
|------|-----------|-----|------|
| **customer** | Customer Home | `/` | Browse products, cart, orders |
| **seller** | Farmer Dashboard | `/` | Farm profile, products, analytics |
| **agent** | Agent Dashboard | `/` | Agent profile, sales, commissions |
| **admin** | Admin Dashboard | `/` | Farmer approvals, product approvals |
| **superadmin** | SuperAdmin Dashboard | `/` | Admin management, platform stats |

---

## 🧑‍💼 Complete Login Scenarios

### Scenario 1: Login as Customer

**Credentials:**
```
Email: customer@example.com
Password: password123
```

**After Login:**
1. Redirected to Customer Home (`/`)
2. See product catalog
3. Can add to cart
4. Can browse orders

**Actions Available:**
- ✅ Browse products
- ✅ Add to cart
- ✅ Checkout
- ✅ View orders
- ❌ Cannot approve farmers
- ❌ Cannot manage admins

---

### Scenario 2: Login as Farmer (Seller)

**Step 1: Create Account**
- Register via Replit Auth: `farmer@example.com` / `password123`

**Step 2: Assign Farmer Role**
```sql
UPDATE users SET role = 'seller' WHERE email = 'farmer@example.com';
```

**Step 3: Login**
- Email: `farmer@example.com`
- Password: `password123`
- Click Login

**After Login:**
1. Redirected to Farmer Dashboard (`/`)
2. See "Create Farm Profile" form
3. Fill in:
   - Farm Name: "Green Valley Organic"
   - Farm Area: "50 acres"
   - Farming Type: "Organic"
   - Certifications: Add certifications
   - Bio: Farm description

**Actions Available:**
- ✅ Create farm profile
- ✅ Add products
- ✅ Manage inventory (update stock)
- ✅ View sales analytics
- ✅ Track earnings
- ❌ Cannot approve other farmers
- ❌ Cannot manage admins

---

### Scenario 3: Login as Agent (Distributor)

**Step 1: Create Account**
- Register via Replit Auth: `agent@example.com` / `password123`

**Step 2: Assign Agent Role**
```sql
UPDATE users SET role = 'agent' WHERE email = 'agent@example.com';
```

**Step 3: Login**
- Email: `agent@example.com`
- Password: `password123`
- Click Login

**After Login:**
1. Redirected to Agent Dashboard (`/`)
2. See "Create Agent Profile" form
3. Fill in:
   - Agent Name: "John Distribution"
   - Company Name: "Fresh Distribution Co."
   - Service Area: "Mumbai Metropolitan"
   - Commission Rate: "5%" (default, adjustable)

**Actions Available:**
- ✅ Create agent profile
- ✅ View connected farmers
- ✅ Track sales facilitated
- ✅ Monitor commissions earned
- ✅ View paid vs. pending commissions
- ❌ Cannot approve farmers
- ❌ Cannot manage admins

---

### Scenario 4: Login as Admin (Moderator)

**Step 1: Create Account**
- Register via Replit Auth: `admin@example.com` / `password123`

**Step 2: Assign Admin Role**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

**Step 3: Login**
- Email: `admin@example.com`
- Password: `password123`
- Click Login

**After Login:**
1. Redirected to Admin Dashboard (`/`)
2. See platform statistics:
   - Total users
   - Total orders
   - Total revenue
   - Pending approvals count

3. Go to "Farmers" tab:
   - See pending farmer registrations
   - Review farm details
   - Click "Approve Farmer" button
   - Farmer is now verified

4. Go to "Products" tab:
   - See pending products
   - Review product details
   - Click "Approve Product" button
   - Product is now visible to customers

**Actions Available:**
- ✅ View platform statistics
- ✅ Approve farmers
- ✅ Approve products
- ✅ View audit logs (indirectly)
- ❌ Cannot manage admins
- ❌ Cannot access Super Admin features

---

### Scenario 5: Login as Super Admin

**Step 1: Create Account**
- Register via Replit Auth: `superadmin@example.com` / `password123`

**Step 2: Assign SuperAdmin Role**
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'superadmin@example.com';
```

**Step 3: Login**
- Email: `superadmin@example.com`
- Password: `password123`
- Click Login

**After Login:**
1. Redirected to SuperAdmin Dashboard (`/`)
2. See global platform statistics:
   - Total users (all roles)
   - Active verified farmers
   - Active admin count
   - Platform-wide revenue

3. Go to "Admin Management" tab:
   - See all active admins
   - Click "Create Admin" button
   - Enter new admin email
   - System creates admin account automatically

4. Can remove admins:
   - Click "Remove" button on any admin
   - Admin account downgraded to customer

5. Go to "Audit Logs" tab:
   - See all platform activities
   - Track farmer approvals
   - Track product approvals
   - See admin management actions

**Actions Available:**
- ✅ View global platform stats
- ✅ Create new admins
- ✅ Remove admins
- ✅ View complete audit logs
- ✅ Monitor all activities
- ✅ Full platform control

---

## 🧪 Quick Test Setup

### Create Test Accounts (SQL)

```sql
-- Create customer
INSERT INTO users (email, role) VALUES ('customer@test.com', 'customer');

-- Create farmer
INSERT INTO users (email, role) VALUES ('farmer@test.com', 'seller');

-- Create agent
INSERT INTO users (email, role) VALUES ('agent@test.com', 'agent');

-- Create admin
INSERT INTO users (email, role) VALUES ('admin@test.com', 'admin');

-- Create superadmin
INSERT INTO users (email, role) VALUES ('superadmin@test.com', 'superadmin');
```

### Quick Login Checklist

- [ ] Register new account via Replit Auth
- [ ] Assign role via SQL update
- [ ] Logout and login with same email
- [ ] Verify correct dashboard appears
- [ ] Test role-specific features

---

## 🔑 Test Credentials Summary

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Customer | customer@test.com | any | Home |
| Farmer | farmer@test.com | any | Farm Profile |
| Agent | agent@test.com | any | Agent Profile |
| Admin | admin@test.com | any | Approvals |
| SuperAdmin | superadmin@test.com | any | Platform Control |

---

## ⚠️ Important Notes

### Authentication
- **Every login goes through Replit Auth**
- No special login page per role
- All users use same login URL
- Role determines dashboard after auth

### Role Assignment
- Default role on signup: `customer`
- Only database can assign roles (currently)
- SuperAdmin can create other admins via dashboard
- Use SQL for bulk role assignments

### Password Recovery
- Use Replit Auth password reset
- Works for any account registered via Replit Auth

### Session Management
- Sessions stored in PostgreSQL
- Session timeout: Standard Replit Auth
- Logout: Clears session and cookies
- Login again: Creates new session

---

## 🚀 For Production

In production, you might want to:

1. **Self-Service Farmer Signup**
   - Add endpoint to create farmer profile
   - Set role automatically
   - Require manual admin approval

2. **Invite-Based Admin Creation**
   - SuperAdmin sends invite link
   - User registers with that link
   - Auto-assigned admin role

3. **Agent Application Form**
   - Users apply to become agents
   - SuperAdmin approves
   - Role assigned automatically

4. **Role-Change Endpoint**
   - Admin can change user roles via UI
   - Audit logged
   - Notifications sent

---

## 🧑‍💻 Troubleshooting

### Issue: Logged in but see blank page
- **Cause:** Role not assigned in database
- **Fix:** Run SQL UPDATE to assign role

### Issue: Redirected to login repeatedly
- **Cause:** Session expired or not set
- **Fix:** Clear browser cookies, login again

### Issue: Cannot find "Approve" buttons
- **Cause:** Not logged in as admin
- **Fix:** Verify role in database is "admin" or "superadmin"

### Issue: See customer dashboard but want admin
- **Cause:** Role is "customer" not "admin"
- **Fix:** Update role in database:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
  ```

---

## 📝 Example: Full Flow for Testing

### Step 1: Create SuperAdmin
```sql
INSERT INTO users (email, role) VALUES ('superadmin@test.com', 'superadmin');
```

### Step 2: Register & Login as SuperAdmin
1. Go to http://localhost:5000
2. Click Login
3. Register with email: `superadmin@test.com`
4. After registration, login
5. Should see SuperAdmin Dashboard

### Step 3: Create Admin via Dashboard
1. In SuperAdmin Dashboard
2. Go to "Admin Management" tab
3. Click "Create Admin"
4. Enter: `admin@test.com`
5. Click "Create Admin"

### Step 4: Login as Admin
1. Register new account: `admin@test.com`
2. Should already have admin role (created by SuperAdmin)
3. After login, should see Admin Dashboard

### Step 5: Approve Content
1. As Admin, go to "Farmers" tab
2. Wait for farmer to register
3. Click "Approve Farmer"
4. Farmer can now add products

---

## 🎯 Role-Based Capabilities Matrix

| Action | Customer | Farmer | Agent | Admin | SuperAdmin |
|--------|----------|--------|-------|-------|------------|
| Browse products | ✅ | ❌ | ❌ | ❌ | ❌ |
| Add to cart | ✅ | ❌ | ❌ | ❌ | ❌ |
| Checkout | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create farm | ❌ | ✅ | ❌ | ❌ | ❌ |
| Add products | ❌ | ✅ | ❌ | ❌ | ❌ |
| View sales | ❌ | ✅ | ✅ | ❌ | ❌ |
| Track commission | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve farmer | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve product | ❌ | ❌ | ❌ | ✅ | ✅ |
| Create admin | ❌ | ❌ | ❌ | ❌ | ✅ |
| Remove admin | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ✅ |

---

**Ready to test all five roles!** 🎉
