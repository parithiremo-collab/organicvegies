# Quick Testing Guide - FreshHarvest

**Status:** App Running on http://localhost:5000 ✅

---

## 🚀 Step 1: Access the App

Open your browser and go to:
```
http://localhost:5000
```

You should see the FreshHarvest landing page.

---

## 🔐 Step 2: Create Your First Account

1. Click **"Login"** button in top right
2. You'll be redirected to **Replit Auth** page
3. Click **"Create Account"** (if first time)
4. Enter:
   - Email: `test@example.com`
   - Password: `password123`
5. Click **"Create Account"**
6. After creation, login with same credentials

✅ **You're now logged in as a Customer (default role)**

---

## 👨‍🌾 Step 3: Create Farmer Account & Test Farmer Dashboard

### 3A. Create Farmer Email
1. Logout: Click profile menu → **"Logout"**
2. Click **"Login"** again
3. Click **"Create Account"**
4. Enter:
   - Email: `farmer@test.com`
   - Password: `password123`
5. Login

### 3B. Assign Farmer Role via Database
Open your **PostgreSQL database** and run:
```sql
UPDATE users SET role = 'seller' WHERE email = 'farmer@test.com';
```

### 3C. Refresh and See Farmer Dashboard
1. Refresh your browser (F5)
2. You should now see **Farmer Dashboard** with:
   - Farm profile form
   - Add products section
   - Analytics cards

---

## 🤝 Step 4: Create Agent Account & Test Agent Dashboard

### 4A. Create Agent Email
1. Logout
2. Create new account:
   - Email: `agent@test.com`
   - Password: `password123`
3. Login

### 4B. Assign Agent Role
```sql
UPDATE users SET role = 'agent' WHERE email = 'agent@test.com';
```

### 4C. Refresh and See Agent Dashboard
1. Refresh browser
2. You should now see **Agent Dashboard** with:
   - Agent profile form
   - Commission rate settings
   - Sales tracking
   - Connected farmers section

---

## 👨‍💼 Step 5: Create Admin Account & Test Admin Dashboard

### 5A. Create Admin Email
1. Logout
2. Create new account:
   - Email: `admin@test.com`
   - Password: `password123`
3. Login

### 5B. Assign Admin Role
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
```

### 5C. Refresh and See Admin Dashboard
1. Refresh browser
2. You should now see **Admin Dashboard** with:
   - Platform statistics cards
   - Farmers tab (for approvals)
   - Products tab (for approvals)

---

## 👑 Step 6: Create SuperAdmin Account & Test SuperAdmin Dashboard

### 6A. Create SuperAdmin Email
1. Logout
2. Create new account:
   - Email: `superadmin@test.com`
   - Password: `password123`
3. Login

### 6B. Assign SuperAdmin Role
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'superadmin@test.com';
```

### 6C. Refresh and See SuperAdmin Dashboard
1. Refresh browser
2. You should now see **SuperAdmin Dashboard** with:
   - Global platform statistics
   - Admin Management tab (create/remove admins)
   - Audit Logs tab (activity tracking)

---

## 🧪 Testing Checklist

### Customer Role ✓
- [ ] Login as customer@test.com
- [ ] See marketplace home page
- [ ] See product list
- [ ] Can add items to cart
- [ ] See checkout button

### Farmer Role ✓
- [ ] Login as farmer@test.com
- [ ] See Farm Profile form
- [ ] Can create farm profile
- [ ] Can add products
- [ ] See analytics dashboard

### Agent Role ✓
- [ ] Login as agent@test.com
- [ ] See Agent Profile form
- [ ] Can set commission rate
- [ ] See connected farmers section
- [ ] See sales tracking

### Admin Role ✓
- [ ] Login as admin@test.com
- [ ] See platform statistics
- [ ] Go to "Farmers" tab
- [ ] Go to "Products" tab
- [ ] See pending approvals

### SuperAdmin Role ✓
- [ ] Login as superadmin@test.com
- [ ] See global statistics
- [ ] Go to "Admin Management" tab
- [ ] Can see admin creation form
- [ ] Go to "Audit Logs" tab
- [ ] See activity log

---

## 📝 SQL Batch Script

If you want to create all test accounts at once, run this in your PostgreSQL database:

```sql
-- Create all test users
INSERT INTO users (email, role) VALUES 
('customer@test.com', 'customer'),
('farmer@test.com', 'seller'),
('agent@test.com', 'agent'),
('admin@test.com', 'admin'),
('superadmin@test.com', 'superadmin');
```

Then:
1. Go to http://localhost:5000
2. Create/register each account via Replit Auth with same emails
3. Refresh browser to see the role-specific dashboards

---

## 🎯 Expected Results

| When You Login As | You Should See |
|------------------|----------------|
| customer | Home marketplace with products |
| farmer | Farm profile + products management |
| agent | Agent profile + commission tracking |
| admin | Platform stats + approval tabs |
| superadmin | Global stats + admin management |

---

## 🐛 Troubleshooting

### Q: I see blank page after login
**A:** Your role isn't assigned in database. Run the SQL UPDATE command for your role.

### Q: I see customer dashboard but want farmer
**A:** You need to:
1. Make sure you're logged in as the right email
2. Run: `UPDATE users SET role = 'seller' WHERE email = 'farmer@test.com';`
3. Refresh browser

### Q: SQL command not working
**A:** Make sure you're in the correct database. Check that the users table exists and you can query it.

### Q: Need to switch between roles
**A:** 
1. Logout
2. Create/login as different email
3. Assign that email the desired role via SQL
4. Refresh

---

## ✅ Ready to Test!

The app is running and fully functional. Go ahead and create accounts to test each role!

**Happy Testing!** 🎉
