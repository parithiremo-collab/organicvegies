# Customer Web Marketplace MVP - FreshHarvest

## Project Overview
Building an organic grocery marketplace web platform where authenticated customers can browse certified organic products, manage shopping carts, and place orders with delivery. The platform emphasizes product freshness, origin transparency, and trust-first design inspired by BigBasket and Licious.

**Status:** MVP Core Features Implemented (70% complete)
**Target Audience:** Organic grocery customers seeking fresh, certified products
**Tech Stack:** React + TypeScript, Express, PostgreSQL (Neon), Replit Auth, Tailwind CSS

---

## ✅ Completed Features (4/7 Core Tasks)

### 1. Database Schema & Infrastructure
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Tables: users, products, categories, cart_items, orders, order_items, addresses, sessions
- ✅ Relationships properly configured with foreign keys
- ✅ Replit Auth session storage implemented

### 2. Product Catalog System
- ✅ API endpoints: `/api/products`, `/api/products/:id`, `/api/categories`
- ✅ Advanced filtering: by category, price range (min/max with regex validation), stock status
- ✅ Sorting options: price-asc, price-desc, rating, newest-first
- ✅ Full-text search on product names
- ✅ Real product data loaded into database

### 3. User Authentication (Replit Auth)
- ✅ Replit Auth integration with OpenID Connect
- ✅ Login/Register flow on Landing page
- ✅ Protected routes and API endpoints with isAuthenticated middleware
- ✅ useAuth hook for client-side authentication state
- ✅ User profile fields: firstName, lastName, profileImageUrl
- ✅ Session persistence with connect-pg-simple

### 4. Persistent Shopping Cart
- ✅ API endpoints: GET/POST/PATCH/DELETE `/api/cart`
- ✅ Cart items stored in database (cart_items table)
- ✅ Protected cart endpoints (require authentication)
- ✅ Frontend cart mutations with React Query
- ✅ Real-time cart synchronization across page reloads
- ✅ CartDrawer component displays persisted items

---

## 📋 Pending Features (3/7 Core Tasks)

### 5. Checkout Flow (Next Priority)
- Order creation with cart items
- Address management (delivery address selection/creation)
- Delivery slot selection
- Order summary with pricing calculations

### 6. Stripe Payment Integration
- Checkout session creation
- Payment processing
- Webhook handling for payment status
- Order status updates after payment

### 7. User Profile Pages
- Order history view
- Saved addresses management
- Account settings
- Profile picture upload

---

## 🏗️ Project Architecture

### Frontend Structure
```
client/src/
├── pages/
│   ├── Home.tsx (main marketplace - products, cart)
│   ├── Landing.tsx (auth & unauthenticated view)
│   └── not-found.tsx
├── components/
│   ├── Header.tsx (navigation, cart toggle)
│   ├── Hero.tsx (landing hero section)
│   ├── CartDrawer.tsx (shopping cart UI)
│   ├── ProductCard.tsx (individual product display)
│   ├── CategoryCard.tsx (category browsing)
│   ├── FarmerSection.tsx (trust/origin section)
│   ├── Footer.tsx (footer links)
│   └── ui/ (shadcn components)
├── hooks/
│   ├── useAuth.ts (authentication state)
│   └── use-toast.ts (toast notifications)
├── lib/
│   └── queryClient.ts (React Query setup, API request helper)
└── App.tsx (main router with Wouter)
```

### Backend Structure
```
server/
├── index-dev.ts (development server)
├── db.ts (Drizzle ORM connection)
├── routes.ts (API route handlers)
├── replitAuth.ts (Replit Auth integration)
├── storage.ts (storage interface - currently not used for cart)
└── vite.ts (Vite dev server)
```

### Shared Types
```
shared/schema.ts
- Product, Category, User, CartItem, Order, OrderItem, Address models
- Insert schemas with Drizzle-Zod validation
- Full TypeScript type safety across frontend & backend
```

---

## 🎨 Design System
- **Color Scheme:** Green (#8dd35f / HSL 142 76% 36%) for organic/fresh theme
- **Typography:** Inter for body, Outfit for headings
- **Components:** shadcn/ui (Radix UI based)
- **Styling:** Tailwind CSS + custom CSS variables
- **Dark Mode:** Configured with CSS class strategy
- **Icons:** Lucide React for UI icons, react-icons/si for company logos

---

## 🔐 Authentication Flow
1. User clicks "Sign In" on Landing page
2. Redirected to Replit Auth provider
3. User completes OAuth2 flow
4. Replit Auth creates session in sessions table
5. User returned to Home with authenticated state
6. Protected API endpoints check isAuthenticated middleware

---

## 📊 Database Schema Quick Reference
- **users:** id, email, firstName, lastName, profileImageUrl
- **products:** id, name, price, description, imageUrl, category, weight, rating, inStock, createdAt
- **categories:** id, name, description
- **cart_items:** id, userId (FK), productId (FK), quantity
- **orders:** id, userId (FK), status, totalAmount, deliveryAddress, createdAt
- **order_items:** id, orderId (FK), productId (FK), quantity, price
- **addresses:** id, userId (FK), street, city, postalCode, isDefault
- **sessions:** sid (PK), sess (JSONB), expire

---

## 🚀 Development Notes

### Key Technical Decisions
1. **Cart Storage:** Database-backed (persistent) instead of localStorage
2. **Auth:** Replit Auth for secure, zero-config authentication
3. **ORM:** Drizzle for type-safe database access
4. **State Management:** React Query + custom hooks (no Redux needed)
5. **Frontend Framework:** React with Wouter for lightweight routing
6. **Styling:** Tailwind CSS + shadcn/ui for component library consistency
7. **Payment:** Stripe for MVP (UPI integration planned for production)

### API Validation
- Strict regex validation on price parameters: `!/^\d+\.?\d*$/` to reject malformed input
- Request body validation with Zod schemas
- Protected routes checked with isAuthenticated middleware

### Error Handling
- Frontend: refetch() mechanism for failed queries (preserves SPA behavior)
- Backend: try-catch blocks with console logging
- User feedback: toast notifications for success/error states

---

## 🔧 Running the Project

### Development
```bash
npm run dev  # Starts Express backend + Vite frontend on port 5000
```

### Database
```bash
npm run db:push  # Apply schema changes to database
npm run db:studio  # Open Drizzle Studio for database inspection
```

---

## 📈 Next Steps (Recommended Order)
1. **Checkout Flow** - Most critical for MVP completion
2. **Stripe Integration** - Payment processing essential
3. **User Profile** - Account management and order history
4. **Bug Fixes** - Edge cases and error scenarios
5. **Production Deployment** - Publish to Replit

---

## 🎯 User Preferences & Development Guidelines
- **Coding Style:** Modern TypeScript, functional components
- **Testing:** Added data-testid attributes to all interactive elements
- **Responsive Design:** Mobile-first approach with Tailwind
- **Performance:** React Query for efficient data fetching with caching
- **Accessibility:** Semantic HTML, keyboard navigation support

---

## 📝 File References
**Important Files Modified:**
- `shared/schema.ts` - Data models
- `server/routes.ts` - API endpoints
- `server/replitAuth.ts` - Replit Auth setup
- `client/src/pages/Home.tsx` - Main marketplace page
- `client/src/hooks/useAuth.ts` - Auth state management
- `client/src/App.tsx` - Router configuration

