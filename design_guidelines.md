# Design Guidelines: Organic Grocery Marketplace MVP

## Design Approach

**Reference-Based Approach**: Drawing inspiration from BigBasket, Licious, and Shopify's clean e-commerce patterns, combined with Stripe's trustworthy minimalism. The design emphasizes product freshness, origin authenticity, and streamlined shopping experience for Indian customers.

**Core Principles**:
- Trust-first design with clear product information and origin transparency
- Mobile-responsive from the ground up (India's mobile-first market)
- Fast, scannable layouts that reduce decision friction
- Emphasis on freshness indicators and quality badges

---

## Typography

**Font Stack**: 
- Primary: Inter (Google Fonts) - clean, modern, excellent readability
- Accent: Outfit (Google Fonts) - for headlines and category labels

**Hierarchy**:
- Hero Headlines: text-5xl to text-6xl, font-bold (Outfit)
- Section Headers: text-3xl to text-4xl, font-semibold (Outfit)
- Product Titles: text-xl, font-medium (Inter)
- Body Text: text-base, font-normal (Inter)
- Product Metadata (origin, grade): text-sm, font-medium (Inter)
- Pricing: text-2xl, font-bold for main price; text-sm line-through for MRP
- Button Text: text-base, font-semibold, uppercase tracking

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-4, gap-6
- Container max-width: max-w-7xl with px-4 for mobile, px-8 for desktop

**Grid System**:
- Product Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Category Cards: grid-cols-2 md:grid-cols-4 lg:grid-cols-6
- Checkout: 2-column layout (form + order summary) on desktop, stacked on mobile

---

## Component Library

### Navigation
- Sticky header with logo left, search center, cart/profile right
- Category navigation bar below header (horizontal scroll on mobile)
- Breadcrumbs for product pages
- Mobile: Hamburger menu with slide-out drawer

### Hero Section
**Large hero image** (full-width, h-96 to h-[500px]) showcasing fresh organic produce with overlay gradient
- Centered headline with primary CTA
- Search bar prominently featured
- Trust indicators: "Certified Organic" badges, delivery promise

### Product Cards
- Aspect ratio 4:3 product images
- Quick add-to-cart button (visible on hover for desktop, always visible mobile)
- Weight/variant selector dropdown
- Origin badge (small pill: "From Maharashtra")
- Stock indicator ("In Stock" / "Low Stock" / "Out of Stock")
- Pricing with MRP strikethrough
- Rating stars with review count

### Product Detail Page
- 2-column: Image gallery left (60%), product info right (40%)
- Sticky add-to-cart section on mobile
- Tabs: Description, Origin & Grade, Reviews
- Seller information card with verification badge
- Related products carousel at bottom

### Cart & Checkout
- Floating cart button with item count badge
- Slide-out cart drawer (quick view)
- Full cart page: item list + pricing breakdown + proceed button
- Checkout: Multi-step indicator, address selection with "Add New" option, delivery slot calendar picker
- Payment section with UPI/card options (Stripe integration for MVP)

### Category Pages
- Filter sidebar (collapsible on mobile): checkboxes for organic type, origin, price range, grade
- Sort dropdown: Price, Popularity, Newest
- Active filter tags with remove option
- Product count and "Clear All Filters" button

### User Dashboard
- Side navigation: Orders, Addresses, Profile, Wallet
- Order cards with status timeline, reorder button
- Address management with default/edit/delete actions

### Footer
- 4-column layout: About, Customer Service, Policies, Contact
- Newsletter signup with email input
- Social proof: "10,000+ Happy Customers"
- Payment method icons
- Certifications/trust badges

---

## Key Interactions & States

- Hover: Product cards lift slightly (shadow increase), buttons brighten
- Loading: Skeleton screens for product grids
- Empty states: Friendly illustrations for empty cart, no search results
- Error states: Inline validation messages, toast notifications for actions
- Success: Checkmark animations for add-to-cart, order confirmation

---

## Images

**Hero Image**: Large, full-width photograph of fresh organic vegetables/fruits in a rustic basket or farm setting. Image should convey freshness, natural quality, and Indian farm authenticity. Overlay with subtle dark gradient (bottom to top) to ensure text readability.

**Category Images**: Individual product category photos (Vegetables, Fruits, Grains, Dairy) - vibrant, clean backgrounds, well-lit product shots.

**Product Images**: High-quality, consistent white or light background product photography. Multiple angles for product detail pages.

**Trust/Social Proof**: Small farmer portraits or farm landscape imagery in "Our Farmers" section to build authenticity.

**Empty States**: Friendly, minimalist illustrations (not photos) for empty cart, no results found.

---

## Accessibility

- Minimum touch target: 44px x 44px for mobile
- ARIA labels for icon-only buttons
- Keyboard navigation support for filters and dropdowns
- Form labels visible and descriptive
- High contrast for text readability (WCAG AA minimum)
- Focus states clearly visible with outline offset