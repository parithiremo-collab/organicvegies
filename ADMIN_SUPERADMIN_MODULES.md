# FreshHarvest - Admin & Super Admin Modules

**Updated:** November 24, 2025
**Status:** ✅ Fully Implemented & Tested

---

## 📋 Overview

FreshHarvest now includes comprehensive **Admin** and **Super Admin** modules for platform management and governance. These roles provide complete control over content moderation, user management, and platform operations.

---

## 👨‍💼 Admin Module

### Purpose
Admins are responsible for **content moderation** and **approval workflows**. They verify and approve farmers and products before they go live on the platform.

### Features

✅ **Platform Statistics Dashboard**
- Total active users count
- Total orders and revenue
- Pending approvals count
- Quick overview cards

✅ **Farmer Approval Workflow**
- View pending farmer registrations
- Review farm details (name, area, type, certifications)
- One-click farmer approval
- Automatic audit logging

✅ **Product Approval Workflow**
- View pending products
- Review product details (name, price, origin, description)
- One-click product approval
- Automatic audit logging

### Admin Dashboard - Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/stats` | Get platform statistics |
| GET | `/api/admin/farmers/pending` | List pending farmers |
| POST | `/api/admin/farmers/:id/approve` | Approve a farmer |
| GET | `/api/admin/products/pending` | List pending products |
| POST | `/api/admin/products/:id/approve` | Approve a product |

### Database Tables Used

```typescript
- farmerProfiles (isVerified field)
- products (isApproved field)
- auditLogs (track all admin actions)
```

### How to Use (Admin)

1. **Login** with your email
2. **Admin Role Set** (by SuperAdmin)
3. **View Dashboard** - See platform stats automatically
4. **Approve Farmers**
   - Go to "Farmers" tab
   - Review pending farmer applications
   - Click "Approve Farmer" to verify
5. **Approve Products**
   - Go to "Products" tab
   - Review pending product listings
   - Click "Approve Product" to go live

### Frontend Components

**AdminDashboard.tsx** (400+ lines)
- Platform stats cards
- Tabbed interface (Farmers/Products)
- Card-based approval UI
- Real-time data fetching
- Full data-testid coverage

---

## 👑 Super Admin Module

### Purpose
Super Admins are **platform administrators** with full system access. They manage admins, monitor all activities, and handle platform-level operations.

### Features

✅ **Global Platform Statistics**
- Total users (all roles)
- Active verified farmers
- Active admin count
- Platform-wide revenue

✅ **Admin Management**
- Create new admins from user emails
- View all active admins
- Remove admins (revoke permissions)
- Automatic admin record creation

✅ **Audit Logging & Activity Tracking**
- View all platform activities
- Track admin actions (approvals, deletions, etc.)
- Filter by action type or target
- Chronological activity log
- Searchable action details

✅ **Platform Control**
- Full visibility into all subsystems
- Complete user management
- Performance monitoring
- System-wide audit trail

### SuperAdmin Dashboard - Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/superadmin/stats` | Get global platform stats |
| POST | `/api/superadmin/admins` | Create new admin |
| GET | `/api/superadmin/admins` | List all admins |
| DELETE | `/api/superadmin/admins/:id` | Remove admin |
| GET | `/api/superadmin/audit-logs` | Get activity logs |

### Database Tables Used

```typescript
- adminProfiles (admin records)
- auditLogs (all activities)
- users (role management)
- farmerProfiles (statistics)
- orders (revenue tracking)
```

### How to Use (Super Admin)

1. **Login** with your email
2. **SuperAdmin Role Set** (platform bootstrap)
3. **View Dashboard** - See global platform stats
4. **Manage Admins**
   - Go to "Admin Management" tab
   - Click "Create Admin"
   - Enter admin email
   - New admin account created automatically
   - View active admins
   - Remove admins as needed
5. **Review Activity**
   - Go to "Audit Logs" tab
   - See all admin actions
   - Track approvals, deletions, changes
   - Monitor platform operations

### Frontend Components

**SuperAdminDashboard.tsx** (450+ lines)
- Global stats overview
- Admin creation dialog
- Admin listing with removal
- Activity audit logs
- Tabbed interface
- Full data-testid coverage

---

## 🗄️ Database Schema

### New Tables

#### admin_profiles
```typescript
CREATE TABLE admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id),
  admin_name text NOT NULL,
  department text,
  permissions text[],
  bio text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW()
);
```

#### super_admin_profiles
```typescript
CREATE TABLE super_admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id),
  super_admin_name text NOT NULL,
  bio text,
  permissions text[],
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW()
);
```

#### audit_logs
```typescript
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL,
  target_type text NOT NULL,
  target_id varchar NOT NULL,
  details jsonb,
  created_at timestamp DEFAULT NOW()
);
```

### Extended Tables

#### users
```typescript
- Added: "admin" and "superadmin" to user_role enum
- Existing: "customer", "seller", "agent"
```

#### farmerProfiles
```typescript
- Existing: is_verified field (used for approval workflow)
```

#### products
```typescript
- Added: is_approved field (used for approval workflow)
- Existing: other product fields
```

---

## 🔐 Role Hierarchy & Permissions

### Role-Based Access Control

```
┌─────────────────────────────────────────────────────┐
│ SUPER ADMIN (Platform Owner)                        │
│ - Full system control                               │
│ - Create/remove admins                              │
│ - View all audit logs                               │
│ - Platform statistics                               │
└────────────────┬────────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ ADMIN       │      │ ADMIN       │
│ (Moderator) │      │ (Moderator) │
│ - Approve   │      │ - Approve   │
│   farmers   │      │   farmers   │
│ - Approve   │      │ - Approve   │
│   products  │      │   products  │
│ - View logs │      │ - View logs │
└─────────────┘      └─────────────┘
      ▼                     ▼
┌─────────────┐      ┌─────────────┐
│ Sellers     │      │ Agents      │
│ (Farmers)   │      │ (Distrib.)  │
└─────────────┘      └─────────────┘
      ▼
┌─────────────┐
│ Customers   │
│ (Buyers)    │
└─────────────┘
```

### Authentication Flow

1. User logs in via Replit Auth
2. User role checked from `users.role` field
3. Role-based routing in App.tsx:
   - `role="superadmin"` → SuperAdminDashboard
   - `role="admin"` → AdminDashboard
   - `role="seller"` → FarmerDashboard
   - `role="agent"` → AgentDashboard
   - `role="customer"` → Home + Marketplace

---

## 📊 Approval Workflow

### Farmer Approval Flow

```
1. Farmer Registration
   └─> Profile created, is_verified = false
       └─> Appears in "Pending Farmers" list

2. Admin Review
   └─> Admin views farmer details
       └─> Clicks "Approve Farmer"
           └─> is_verified = true
               └─> Audit log created
                   └─> Farmer can now sell products
```

### Product Approval Flow

```
1. Farmer Lists Product
   └─> Product created, is_approved = false
       └─> Appears in "Pending Products" list

2. Admin Review
   └─> Admin views product details
       └─> Clicks "Approve Product"
           └─> is_approved = true
               └─> Audit log created
                   └─> Product visible to customers
```

---

## 🔍 Audit Logging

Every admin action is tracked for compliance and monitoring:

### Logged Actions

| Action | Target Type | Details Recorded |
|--------|------------|------------------|
| APPROVE_FARMER | farmer | farmer name, ID |
| APPROVE_PRODUCT | product | product name, ID |
| CREATE_ADMIN | admin | admin email |
| DELETE_ADMIN | admin | admin ID |

### Audit Log Structure

```typescript
{
  id: uuid,
  admin_id: uuid,           // Who performed action
  action: string,           // APPROVE_FARMER, etc.
  target_type: string,      // farmer, product, admin, etc.
  target_id: string,        // ID of affected entity
  details: {                // Additional context
    farmerName?: string,
    productName?: string,
    email?: string
  },
  created_at: timestamp     // When action occurred
}
```

---

## 🎨 Frontend Components

### AdminDashboard.tsx
- **Location:** `client/src/pages/AdminDashboard.tsx`
- **Size:** 400+ lines
- **Features:**
  - Stats cards (users, orders, revenue, pending)
  - Farmers tab with approval cards
  - Products tab with approval cards
  - Real-time data updates
  - Error handling
  - Loading states
  - Full accessibility (data-testids)

### SuperAdminDashboard.tsx
- **Location:** `client/src/pages/SuperAdminDashboard.tsx`
- **Size:** 450+ lines
- **Features:**
  - Global stats overview
  - Admin creation dialog
  - Admin list management
  - Activity audit log
  - Real-time data fetching
  - Error handling
  - Dialog forms
  - Full accessibility (data-testids)

### Updated App.tsx
- **Route Priority:**
  1. SuperAdmin (highest)
  2. Admin
  3. Seller (Farmer)
  4. Agent
  5. Customer (default)

---

## 🚀 API Endpoints Summary

### Admin Endpoints (5 total)

```
GET  /api/admin/stats                    - Platform overview stats
GET  /api/admin/farmers/pending          - List pending farmers
POST /api/admin/farmers/:id/approve      - Approve a farmer
GET  /api/admin/products/pending         - List pending products
POST /api/admin/products/:id/approve     - Approve a product
```

### SuperAdmin Endpoints (5 total)

```
GET  /api/superadmin/stats               - Global platform stats
POST /api/superadmin/admins              - Create new admin
GET  /api/superadmin/admins              - List all admins
DELETE /api/superadmin/admins/:id        - Remove admin
GET  /api/superadmin/audit-logs          - Get activity logs
```

**Total New Endpoints:** 10

---

## 🧪 Testing Scenarios

### Admin Testing

- ✅ View dashboard with stats
- ✅ See pending farmers
- ✅ Approve farmer
- ✅ See pending products
- ✅ Approve product
- ✅ Audit logs created
- ✅ Tab switching
- ✅ Error handling

### SuperAdmin Testing

- ✅ View global stats
- ✅ Create new admin
- ✅ View admin list
- ✅ Remove admin
- ✅ View audit logs
- ✅ Dialog forms
- ✅ Tab switching
- ✅ Error handling

---

## 📈 Complete User Role System

### Five-Role Marketplace

```
┌─ SuperAdmin (1+)      - Platform control & admin management
├─ Admin (1+)           - Content moderation & approvals
├─ Seller/Farmer (100+) - Product producers
├─ Agent (10+)          - Distributors & commission earners
└─ Customer (1000+)     - Buyers & marketplace users
```

---

## 🔄 Admin Workflow Example

### Scenario: New Farmer Registration

```
1. John registers as farmer
   - Email: john@farm.com
   - Farm: Green Valley Organic
   - Status: Pending (is_verified = false)

2. Admin logs in
   - Sees "Green Valley Organic" in pending list
   - Reviews farm details
   - Clicks "Approve Farmer"

3. System updates
   - is_verified = true
   - Audit log: {
      action: "APPROVE_FARMER",
      admin_id: admin_uuid,
      target_id: john_uuid,
      details: { farmerName: "Green Valley Organic" }
    }

4. John can now
   - Add products
   - List them for approval
   - Track sales
```

---

## 📚 Integration with Existing Modules

### How Admin/SuperAdmin Fits with Other Roles

```
Customer Journey:
customer → browse products → checkout → order
              ↑                           ↓
          [Products filtered by is_approved=true]
          [Created by farmers with is_verified=true]

Farmer Journey:
farmer → create farm profile → admin approves → add products 
         → admin approves products → appears on marketplace

Admin Role:
admin → approve farmers → approve products → monitor via audit logs

SuperAdmin Role:
superadmin → create admins → monitor all activities → manage system
```

---

## 🎯 Next Steps & Future Enhancements

### Phase 2 (Future)
- Farmer rejection with comments
- Admin messaging system
- Bulk approval/rejection
- Advanced filtering in audit logs
- Admin notifications
- Role-based permissions matrix

### Phase 3 (Future)
- Admin analytics dashboard
- Fraud detection system
- User suspension/banning
- Platform-wide reporting
- Advanced search across all data
- Scheduled reports

---

## 📝 Code Statistics

### New Code Added
- **Database Schema:** 200 lines (3 new tables)
- **API Routes:** 200 lines (10 admin/superadmin endpoints)
- **Frontend Pages:** 850 lines (2 dashboard pages)
- **Updated Files:** 50 lines (App.tsx role routing)
- **Total:** 1,300+ lines of new functionality

### Files Created
1. `client/src/pages/AdminDashboard.tsx` (400 lines)
2. `client/src/pages/SuperAdminDashboard.tsx` (450 lines)

### Files Modified
1. `shared/schema.ts` - Added 3 new tables + validators
2. `server/routes.ts` - Added 10 new endpoints
3. `client/src/App.tsx` - Added role-based routing

---

## 🔐 Security Considerations

- ✅ Authentication required for all admin routes
- ✅ Role-based access control
- ✅ Audit logging for all actions
- ✅ User verification workflow
- ✅ Admin credentials tied to Replit Auth
- ✅ No sensitive data in audit logs
- ✅ Timestamps for action tracking

---

## 📊 Complete Platform Overview

### Five-Module Ecosystem

1. **Customer Module** ✅
   - Browse products
   - Add to cart
   - Checkout with UPI/Card
   - Track orders

2. **Farmer Module** ✅
   - Create farm profile
   - Add products
   - Track sales & earnings
   - Manage inventory

3. **Agent Module** ✅
   - Create agent profile
   - Track commissions
   - View connected farmers
   - Monitor earnings

4. **Admin Module** ✅
   - Approve farmers
   - Approve products
   - Monitor platform
   - View audit logs

5. **SuperAdmin Module** ✅
   - Create/manage admins
   - View global statistics
   - Monitor all activities
   - Platform governance

---

## 🚀 Deployment Checklist

- ✅ Database schema created (npm run db:push)
- ✅ All API endpoints tested
- ✅ Role-based routing working
- ✅ Frontend dashboards created
- ✅ Audit logging implemented
- ✅ Error handling in place
- ✅ Type safety with TypeScript
- ✅ Documentation complete

---

**FreshHarvest now has a complete five-role marketplace with admin governance!** 🎉

For complete setup and deployment, see:
- **SETUP.md** - Local development
- **MODULES_UPDATE.md** - Farmer & Agent modules
- **DEPLOYMENT.md** - Production deployment
- **README.md** - Project overview
