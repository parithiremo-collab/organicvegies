# FreshHarvest - Organic Marketplace Platform

## Overview
FreshHarvest is a comprehensive organic marketplace platform designed to connect farmers, agents, and customers. It features a 5-role ecosystem (Customer, Farmer, Agent, Admin, SuperAdmin), multi-language support, and dual payment integration (Stripe for card payments and Razorpay for UPI). The platform aims to provide a seamless and secure experience for buying and selling organic products.

## User Preferences
I prefer detailed explanations.
Do not make changes to the folder `Z`.
Do not make changes to the file `Y`.
Ask before making major changes.

## System Architecture

### UI/UX Decisions
- **Multi-Language Support:** Full application support for English, Hindi, and Tamil, including a unified multi-language login page.
- **Role-Based Dashboards:** Tailored dashboards for each of the 5 user roles to provide relevant information and functionalities.
- **Payment UI:** Dual payment method selection (UPI via Razorpay, Card via Stripe) with client-side QR code generation for UPI, intent-based UPI links, and clear payment status tracking.
- **Error Handling UI:** User-friendly error messages, form validation with instant feedback, loading states with spinners, and an `ErrorBoundary` component for unhandled React errors.

### Technical Implementations
- **Backend Framework:** Node.js with Express (implied by API routes).
- **Database:** PostgreSQL, managed with Drizzle ORM. Schema includes `farmerId`, `isApproved`, and `stock` fields for products, and Razorpay-specific fields (`razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `paymentMethod`) for orders.
- **Authentication:** Replit Auth integration with a local test login system for development.
- **Payment Gateway Integrations:**
    - **Razorpay (UPI):** `server/razorpayClient.ts` handles API interactions. Implements UPI intent-based payment generation, signature verification using HMAC-SHA256, and supports QR code generation client-side using the `qrcode` library.
    - **Stripe (Card):** Integrated for credit/debit card payments.
- **Error Handling:**
    - **Frontend:** `ErrorBoundary` component, comprehensive form validation, loading states, and user-friendly error toasts.
    - **Backend:** Input validation on all endpoints (required fields, data types, constraints, authorization), specific error handling for payment gateway issues, and generic fallback for unexpected errors.
- **Routing:** Invalid routes redirect to the home page (no dedicated 404 page).

### Feature Specifications
- **User Roles:** Customer, Farmer, Agent, Admin, SuperAdmin.
- **Product Management:** Products include `farmerId`, `isApproved` (for admin workflow), and `stock` for inventory.
- **Order Processing:** Supports both UPI and card payments, with secure payment verification processes.
- **Test Users:** Auto-created test users for all roles to facilitate development and testing.

## External Dependencies
- **PostgreSQL:** Primary database.
- **Stripe:** Payment gateway for credit/debit card transactions.
- **Razorpay:** Payment gateway for UPI transactions.
- **Replit Auth:** For user authentication.
- **`qrcode` library:** Client-side QR code generation for UPI payments.
- **`@neondatabase/serverless`:** PostgreSQL driver.