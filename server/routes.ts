import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { categories, products, cartItems, orders, orderItems, users, farmerProfiles, agentProfiles, agentSales, agentFarmerRelations, adminProfiles, superAdminProfiles, auditLogs } from "@shared/schema";
import { eq, and, or, ilike, gte, lte, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated, isReplitAuthEnabled } from "./replitAuth";
import { setupTestAuth, setupSessionMiddleware } from "./testAuth";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertFarmerProfileSchema, insertAgentProfileSchema, insertAdminProfileSchema, insertSuperAdminProfileSchema } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { getRazorpayClient } from "./razorpayClient";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication based on configuration
  if (isReplitAuthEnabled()) {
    // Production: Replit Auth with OIDC
    await setupAuth(app);
  } else {
    // Development: Test auth with session middleware fallback
    console.log("🧪 Using test authentication mode (ENABLE_REPLIT_AUTH=false)");
    setupSessionMiddleware(app);
  }
  
  // Setup test authentication for local development (NODE_ENV=development)
  setupTestAuth(app);

  // Auth endpoint to fetch current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const { 
        category, 
        search, 
        minPrice, 
        maxPrice, 
        inStock,
        sort = 'newest'
      } = req.query;

      let query = db.select().from(products);
      const conditions = [];

      // Filter by category
      if (category && typeof category === 'string') {
        const categoryData = await db.select()
          .from(categories)
          .where(eq(categories.slug, category))
          .limit(1);
        
        if (categoryData.length > 0) {
          conditions.push(eq(products.categoryId, categoryData[0].id));
        }
      }

      // Search by name or description
      if (search && typeof search === 'string') {
        conditions.push(
          or(
            ilike(products.name, `%${search}%`),
            ilike(products.description, `%${search}%`)
          )
        );
      }

      // Filter by price range - validate and cast to numbers
      if (minPrice && typeof minPrice === 'string') {
        // Strict validation: reject if contains non-numeric characters
        if (!/^\d+\.?\d*$/.test(minPrice)) {
          return res.status(400).json({ error: "Invalid minPrice parameter: must be a valid number" });
        }
        const minPriceNum = parseFloat(minPrice);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
          return res.status(400).json({ error: "Invalid minPrice parameter: must be a positive number" });
        }
        conditions.push(gte(products.price, String(minPriceNum)));
      }
      if (maxPrice && typeof maxPrice === 'string') {
        // Strict validation: reject if contains non-numeric characters
        if (!/^\d+\.?\d*$/.test(maxPrice)) {
          return res.status(400).json({ error: "Invalid maxPrice parameter: must be a valid number" });
        }
        const maxPriceNum = parseFloat(maxPrice);
        if (isNaN(maxPriceNum) || maxPriceNum < 0) {
          return res.status(400).json({ error: "Invalid maxPrice parameter: must be a positive number" });
        }
        conditions.push(lte(products.price, String(maxPriceNum)));
      }

      // Filter by stock
      if (inStock === 'true') {
        conditions.push(eq(products.inStock, true));
      } else if (inStock === 'false') {
        conditions.push(eq(products.inStock, false));
      }

      // Apply filters
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      // Apply sorting
      if (sort === 'price-asc') {
        query = query.orderBy(products.price) as any;
      } else if (sort === 'price-desc') {
        query = query.orderBy(desc(products.price)) as any;
      } else if (sort === 'rating') {
        query = query.orderBy(desc(products.rating)) as any;
      } else {
        // Default: newest first
        query = query.orderBy(desc(products.createdAt)) as any;
      }

      const allProducts = await query;
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await db.select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);

      if (product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product[0]);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Cart endpoints (protected)
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      }).from(cartItems).where(eq(cartItems.userId, userId));
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId, quantity } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({ error: "Missing productId or quantity" });
      }

      const existing = await db.select().from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));

      if (existing.length > 0) {
        await db.update(cartItems)
          .set({ quantity: existing[0].quantity + quantity })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        await db.insert(cartItems).values({ userId, productId, quantity });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (quantity <= 0) {
        await db.delete(cartItems).where(eq(cartItems.id, id));
      } else {
        await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ error: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await db.delete(cartItems).where(eq(cartItems.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  // Get Stripe publishable key
  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      console.error("Error fetching Stripe key:", error);
      res.status(500).json({ error: "Failed to fetch Stripe key" });
    }
  });

  // Create checkout session
  app.post("/api/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const { deliveryAddress, deliverySlot, deliveryFee = 0, paymentMethod = 'card' } = req.body || {};

      // Validate required fields
      if (!deliveryAddress) {
        return res.status(400).json({ error: "Delivery address is required" });
      }
      if (!deliverySlot) {
        return res.status(400).json({ error: "Delivery slot is required" });
      }

      // Validate address fields
      if (!deliveryAddress.line1?.trim() || !deliveryAddress.city?.trim() || !deliveryAddress.state?.trim() || !deliveryAddress.pincode?.trim()) {
        return res.status(400).json({ error: "Missing delivery details" });
      }

      // Validate pincode format
      if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
        return res.status(400).json({ error: "Pincode must be 6 digits" });
      }

      // Validate payment method
      if (!['upi', 'card'].includes(paymentMethod)) {
        return res.status(400).json({ error: "Invalid payment method" });
      }

      // Get cart items
      const cartData = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      }).from(cartItems).where(eq(cartItems.userId, userId));

      if (!cartData || cartData.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Fetch product details
      const productIds = cartData.map(item => item?.productId).filter(Boolean);
      if (productIds.length === 0) {
        return res.status(400).json({ error: "No items in cart" });
      }
      
      const productDetails = await db.select().from(products)
        .where(or(...productIds.map(id => eq(products.id, id) as any)));

      if (!productDetails || productDetails.length === 0) {
        return res.status(400).json({ error: "Products not found" });
      }

      let totalAmount = 0;
      const orderItemsData = [];

      for (const cartItem of cartData) {
        if (!cartItem?.productId || !cartItem?.quantity) {
          continue;
        }
        
        const product = productDetails.find(p => p?.id === cartItem.productId);
        if (!product) {
          return res.status(400).json({ error: "Product not found" });
        }
        
        const itemPrice = parseFloat(product?.price?.toString() || '0');
        if (isNaN(itemPrice) || itemPrice < 0) {
          return res.status(400).json({ error: "Invalid product price" });
        }
        
        const itemTotal = itemPrice * cartItem.quantity;
        totalAmount += itemTotal;
        
        orderItemsData.push({
          productId: product.id,
          productName: product.name || 'Unknown Product',
          productImage: product.imageUrl || '',
          price: product.price,
          quantity: cartItem.quantity,
          weight: product.weight || '',
        });
      }

      if (orderItemsData.length === 0) {
        return res.status(400).json({ error: "No valid items to checkout" });
      }

      // Add delivery fee to total
      const deliveryFeeNum = parseFloat(deliveryFee?.toString() || '0');
      if (isNaN(deliveryFeeNum) || deliveryFeeNum < 0) {
        return res.status(400).json({ error: "Invalid delivery fee" });
      }
      totalAmount += deliveryFeeNum;

      // Create order
      if (totalAmount <= 0) {
        return res.status(400).json({ error: "Invalid order amount" });
      }
      
      const orderData = {
        userId,
        totalAmount: totalAmount.toString(),
        status: "pending" as const,
        paymentStatus: "pending" as const,
        deliveryAddressLine1: deliveryAddress?.line1 || '',
        deliveryAddressLine2: deliveryAddress?.line2 || null,
        deliveryCity: deliveryAddress?.city || '',
        deliveryState: deliveryAddress?.state || '',
        deliveryPincode: deliveryAddress?.pincode || '',
        deliverySlot: deliverySlot || 'morning',
        paymentMethod: paymentMethod || 'card',
      };

      const orderResult = await db.insert(orders).values(orderData).returning();
      if (!orderResult || orderResult.length === 0) {
        return res.status(500).json({ error: "Failed to create order" });
      }
      
      const newOrder = orderResult[0];
      if (!newOrder?.id) {
        return res.status(500).json({ error: "Invalid order created" });
      }

      // Add order items
      if (!orderItemsData || orderItemsData.length === 0) {
        // Clean up order if no items
        await db.delete(orders).where(eq(orders.id, newOrder.id));
        return res.status(400).json({ error: "No items to add to order" });
      }
      
      for (const item of orderItemsData) {
        if (!item?.productId || !item?.productName) {
          continue;
        }
        await db.insert(orderItems).values({
          orderId: newOrder.id,
          ...item,
        });
      }

      // Handle Razorpay UPI or Stripe Card
      if (paymentMethod === 'upi') {
        try {
          // Create Razorpay order for UPI
          const razorpay = getRazorpayClient();
          if (!razorpay) {
            throw new Error("Razorpay client not initialized");
          }
          
          const razorpayOrder = await razorpay.createOrder(
            totalAmount,
            newOrder.id,
            `FreshHarvest Order ${newOrder.id}`
          );

          if (!razorpayOrder?.id) {
            throw new Error("Failed to create Razorpay order");
          }

          // Update order with Razorpay order ID
          await db.update(orders)
            .set({ razorpayOrderId: razorpayOrder.id })
            .where(eq(orders.id, newOrder.id));

          // Clear cart
          await db.delete(cartItems).where(eq(cartItems.userId, userId));

          res.json({
            orderId: newOrder.id,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            currency: 'INR',
            paymentMethod: 'upi',
          });
        } catch (razorpayError: any) {
          console.error("Razorpay error:", razorpayError);
          return res.status(500).json({ error: "Failed to initialize UPI payment" });
        }
      } else if (paymentMethod === 'card') {
        try {
          // Create Stripe checkout session for card
          const stripe = await getUncachableStripeClient();
          if (!stripe) {
            throw new Error("Stripe client not initialized");
          }
          
          console.log(`Creating Stripe session for order ${newOrder.id}, amount: ${totalAmount}, paymentMethod: ${paymentMethod}`);
          
          const sessionAmount = Math.round(totalAmount * 100);
          if (sessionAmount <= 0) {
            throw new Error("Invalid session amount");
          }
          
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'FreshHarvest Order',
                  description: `Order #${newOrder.id}`,
                },
                unit_amount: sessionAmount,
              },
              quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol || 'https'}://${req.get('host')}/orders/${newOrder.id}?success=true`,
            cancel_url: `${req.protocol || 'https'}://${req.get('host')}/checkout?cancelled=true`,
            metadata: {
              orderId: newOrder.id,
              userId,
              paymentMethod: paymentMethod || 'card',
            },
          });
          
          if (!session?.id) {
            throw new Error("Failed to create Stripe session");
          }
          
          console.log(`Stripe session created: ${session.id}`);

          // Update order with Stripe session ID
          await db.update(orders)
            .set({ stripeSessionId: session.id })
            .where(eq(orders.id, newOrder.id));

          // Clear cart
          await db.delete(cartItems).where(eq(cartItems.userId, userId));

          res.json({ 
            orderId: newOrder.id, 
            sessionId: session.id, 
            paymentMethod: 'card' 
          });
        } catch (stripeError: any) {
          console.error("Stripe error:", stripeError);
          return res.status(500).json({ error: "Failed to initialize card payment" });
        }
      } else {
        return res.status(400).json({ error: "Invalid payment method selected" });
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      const errorMessage = error?.message || error?.toString() || "Failed to create checkout session";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Razorpay: Create UPI order
  app.post("/api/razorpay/create-order", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      if (typeof orderId !== 'string') {
        return res.status(400).json({ error: "Invalid Order ID format" });
      }

      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const amount = parseFloat(order.totalAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid order amount" });
      }

      try {
        const razorpay = getRazorpayClient();
        const razorpayOrder = await razorpay.createOrder(
          amount,
          orderId,
          `FreshHarvest Order ${orderId}`
        );

        // Update order with Razorpay order ID
        await db.update(orders)
          .set({ razorpayOrderId: razorpayOrder.id })
          .where(eq(orders.id, orderId));

        res.json({
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        });
      } catch (razorpayError: any) {
        console.error("Razorpay API error:", razorpayError);
        // Return user-friendly error message
        const errorMessage = razorpayError.message?.includes('Authentication') 
          ? "Payment gateway authentication failed. Please contact support."
          : razorpayError.message || "Failed to create payment order";
        res.status(500).json({ error: errorMessage });
      }
    } catch (error: any) {
      console.error("Error in create order endpoint:", error);
      res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
  });

  // Razorpay: Verify payment
  app.post("/api/razorpay/verify-payment", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      // Validate all required fields
      if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ error: "Missing required payment verification fields" });
      }

      // Type validation
      if (typeof orderId !== 'string' || typeof razorpayPaymentId !== 'string' || typeof razorpaySignature !== 'string') {
        return res.status(400).json({ error: "Invalid payment data format" });
      }

      try {
        const razorpay = getRazorpayClient();
        const isValid = await razorpay.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
          console.warn(`Invalid signature for order ${orderId}`);
          return res.status(400).json({ error: "Payment verification failed: Invalid signature" });
        }

        // Verify order exists and belongs to user
        const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        if (order.userId !== req.user.claims.sub) {
          return res.status(403).json({ error: "Unauthorized: Order does not belong to you" });
        }

        // Update order with payment details
        await db.update(orders)
          .set({
            razorpayPaymentId,
            razorpaySignature,
            paymentStatus: "completed" as const,
            status: "confirmed" as const,
          })
          .where(eq(orders.id, orderId));

        res.json({
          success: true,
          orderId,
          paymentId: razorpayPaymentId,
          message: "Payment verified successfully",
        });
      } catch (verifyError: any) {
        console.error("Payment verification error:", verifyError);
        res.status(500).json({ error: "Payment verification failed. Please contact support." });
      }
    } catch (error: any) {
      console.error("Error in verify payment endpoint:", error);
      res.status(500).json({ error: "An unexpected error occurred during verification" });
    }
  });

  // Razorpay: Get QR code for UPI payment
  app.get("/api/razorpay/qr-code/:orderId", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId } = req.params;

      if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ error: "Invalid Order ID" });
      }

      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Verify order belongs to user
      if (order.userId !== req.user.claims.sub) {
        return res.status(403).json({ error: "Unauthorized: Order does not belong to you" });
      }

      if (!order.razorpayOrderId) {
        return res.status(400).json({ error: "Razorpay order not initialized. Please try again." });
      }

      const amount = parseFloat(order.totalAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid order amount" });
      }

      try {
        const razorpay = getRazorpayClient();
        const upiLink = razorpay.generateUPILink(
          orderId,
          amount,
          req.user.claims.sub || '',
          req.user.email || ''
        );

        if (!upiLink) {
          throw new Error("Failed to generate UPI link");
        }

        res.json({
          orderId,
          razorpayOrderId: order.razorpayOrderId,
          amount: order.totalAmount,
          currency: 'INR',
          upiLink,
        });
      } catch (upiError: any) {
        console.error("UPI link generation error:", upiError);
        res.status(500).json({ error: "Failed to generate payment link. Please try again." });
      }
    } catch (error: any) {
      console.error("Error in QR code endpoint:", error);
      res.status(500).json({ error: "Failed to generate QR code. Please try again." });
    }
  });

  // Get user orders
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userOrders = await db.select().from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));

      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
          const items = await db.select().from(orderItems)
            .where(eq(orderItems.orderId, order.id));
          return { ...order, items };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      const [order] = await db.select().from(orders)
        .where(and(eq(orders.id, id), eq(orders.userId, userId)));

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await db.select().from(orderItems)
        .where(eq(orderItems.orderId, id));

      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // FARMER ROUTES
  // Create/Update farmer profile
  app.post("/api/farmer/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFarmerProfileSchema.parse(req.body);

      const existing = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, userId));
      
      if (existing.length > 0) {
        const updated = await db.update(farmerProfiles)
          .set(data)
          .where(eq(farmerProfiles.userId, userId))
          .returning();
        res.json(updated[0]);
      } else {
        const created = await db.insert(farmerProfiles)
          .values({ ...data, userId })
          .returning();
        await db.update(users).set({ role: "seller" }).where(eq(users.id, userId));
        res.json(created[0]);
      }
    } catch (error: any) {
      console.error("Error managing farmer profile:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get farmer profile
  app.get("/api/farmer/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, userId));
      res.json(profile[0] || null);
    } catch (error) {
      console.error("Error fetching farmer profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Farmer: Add new product
  app.post("/api/farmer/products", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { categoryId, name, description, imageUrl, price, mrp, origin, weight, stock } = req.body;

      const product = await db.insert(products)
        .values({
          categoryId,
          farmerId: userId,
          name,
          description,
          imageUrl,
          price,
          mrp,
          origin,
          weight,
          stock,
          inStock: stock > 0,
          lowStock: stock < 10,
        })
        .returning();

      res.json(product[0]);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Farmer: Get my products
  app.get("/api/farmer/products", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const myProducts = await db.select().from(products).where(eq(products.farmerId, userId));
      res.json(myProducts);
    } catch (error) {
      console.error("Error fetching farmer products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Farmer: Update product
  app.patch("/api/farmer/products/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { price, stock, inStock } = req.body;

      const [product] = await db.select().from(products).where(eq(products.id, id));
      if (!product || product.farmerId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await db.update(products)
        .set({ price, stock, inStock: inStock !== undefined ? inStock : stock > 0, lowStock: stock < 10 })
        .where(eq(products.id, id))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Farmer: Get sales analytics
  app.get("/api/farmer/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmerOrders = await db.select().from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.farmerId, userId));

      const totalSales = farmerOrders.length;
      const totalEarnings = farmerOrders.reduce((sum, record) => {
        return sum + parseFloat(record.order_items.price) * record.order_items.quantity;
      }, 0);

      res.json({
        totalSales,
        totalEarnings: totalEarnings.toFixed(2),
        recentOrders: farmerOrders.slice(-10)
      });
    } catch (error) {
      console.error("Error fetching farmer analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // AGENT ROUTES
  // Create/Update agent profile
  app.post("/api/agent/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertAgentProfileSchema.parse(req.body);

      const existing = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, userId));
      
      if (existing.length > 0) {
        const updated = await db.update(agentProfiles)
          .set(data)
          .where(eq(agentProfiles.userId, userId))
          .returning();
        res.json(updated[0]);
      } else {
        const created = await db.insert(agentProfiles)
          .values({ ...data, userId })
          .returning();
        await db.update(users).set({ role: "agent" }).where(eq(users.id, userId));
        res.json(created[0]);
      }
    } catch (error: any) {
      console.error("Error managing agent profile:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get agent profile
  app.get("/api/agent/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, userId));
      res.json(profile[0] || null);
    } catch (error) {
      console.error("Error fetching agent profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Agent: Get sales
  app.get("/api/agent/sales", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agentOrderSales = await db.select().from(agentSales).where(eq(agentSales.agentId, userId));
      
      const totalSales = agentOrderSales.length;
      const totalCommission = agentOrderSales.reduce((sum, sale) => sum + parseFloat(sale.commission), 0);
      const totalPaid = agentOrderSales.filter(s => s.isPaid).reduce((sum, s) => sum + parseFloat(s.commission), 0);

      res.json({
        totalSales,
        totalCommission: totalCommission.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        pendingCommission: (totalCommission - totalPaid).toFixed(2),
        sales: agentOrderSales
      });
    } catch (error) {
      console.error("Error fetching agent sales:", error);
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  // Agent: Get connected farmers
  app.get("/api/agent/farmers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const relations = await db.select().from(agentFarmerRelations)
        .where(eq(agentFarmerRelations.agentId, userId))
        .innerJoin(farmerProfiles, eq(agentFarmerRelations.farmerId, farmerProfiles.userId));
      
      res.json(relations);
    } catch (error) {
      console.error("Error fetching connected farmers:", error);
      res.status(500).json({ error: "Failed to fetch farmers" });
    }
  });

  // ADMIN ROUTES
  // Admin: Get platform stats
  app.get("/api/admin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const totalUsers = await db.select().from(users);
      const totalOrders = await db.select().from(orders);
      const pendingFarmers = await db.select().from(farmerProfiles).where(eq(farmerProfiles.isVerified, false));
      const pendingProducts = await db.select().from(products).where(eq(products.isApproved, false));
      
      const totalRevenue = totalOrders.reduce((sum: any, order: any) => sum + parseFloat(order.totalAmount), 0);
      
      res.json({
        totalUsers: totalUsers.length,
        totalOrders: totalOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingApprovals: pendingFarmers.length + pendingProducts.length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin: Get pending farmers
  app.get("/api/admin/farmers/pending", isAuthenticated, async (req: any, res) => {
    try {
      const pendingFarmers = await db.select().from(farmerProfiles).where(eq(farmerProfiles.isVerified, false));
      res.json(pendingFarmers);
    } catch (error) {
      console.error("Error fetching pending farmers:", error);
      res.status(500).json({ error: "Failed to fetch pending farmers" });
    }
  });

  // Admin: Approve farmer
  app.post("/api/admin/farmers/:id/approve", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updated = await db.update(farmerProfiles)
        .set({ isVerified: true })
        .where(eq(farmerProfiles.userId, id))
        .returning();
      
      await db.insert(auditLogs).values({
        adminId: req.user.claims.sub,
        action: "APPROVE_FARMER",
        targetType: "farmer",
        targetId: id,
        details: { farmerName: updated[0]?.farmName },
      });
      
      res.json(updated[0]);
    } catch (error) {
      console.error("Error approving farmer:", error);
      res.status(500).json({ error: "Failed to approve farmer" });
    }
  });

  // Admin: Get pending products
  app.get("/api/admin/products/pending", isAuthenticated, async (req: any, res) => {
    try {
      const pendingProducts = await db.select().from(products).where(eq(products.isApproved, false));
      res.json(pendingProducts);
    } catch (error) {
      console.error("Error fetching pending products:", error);
      res.status(500).json({ error: "Failed to fetch pending products" });
    }
  });

  // Admin: Approve product
  app.post("/api/admin/products/:id/approve", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updated = await db.update(products)
        .set({ isApproved: true })
        .where(eq(products.id, id))
        .returning();
      
      await db.insert(auditLogs).values({
        adminId: req.user.claims.sub,
        action: "APPROVE_PRODUCT",
        targetType: "product",
        targetId: id,
        details: { productName: updated[0]?.name },
      });
      
      res.json(updated[0]);
    } catch (error) {
      console.error("Error approving product:", error);
      res.status(500).json({ error: "Failed to approve product" });
    }
  });

  // SUPER ADMIN ROUTES
  // SuperAdmin: Get platform stats
  app.get("/api/superadmin/stats", isAuthenticated, async (req: any, res) => {
    try {
      const totalUsers = await db.select().from(users);
      const totalFarmers = await db.select().from(farmerProfiles).where(eq(farmerProfiles.isVerified, true));
      const activeAdmins = await db.select().from(adminProfiles).where(eq(adminProfiles.isActive, true));
      const totalOrders = await db.select().from(orders);
      
      const totalRevenue = totalOrders.reduce((sum: any, order: any) => sum + parseFloat(order.totalAmount), 0);
      
      res.json({
        totalUsers: totalUsers.length,
        totalFarmers: totalFarmers.length,
        activeAdmins: activeAdmins.length,
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching superadmin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // SuperAdmin: Create admin
  app.post("/api/superadmin/admins", isAuthenticated, async (req: any, res) => {
    try {
      const { email } = req.body;
      
      const [existingUser] = await db.select().from(users).where(eq(users.email, email));
      let userId = existingUser?.id;
      
      if (!userId) {
        const newUser = await db.insert(users).values({
          email,
          role: "admin",
        }).returning();
        userId = newUser[0].id;
      }
      
      const adminProfile = await db.insert(adminProfiles).values({
        userId,
        adminName: email.split("@")[0],
      }).returning();
      
      await db.insert(auditLogs).values({
        adminId: req.user.claims.sub,
        action: "CREATE_ADMIN",
        targetType: "admin",
        targetId: userId,
        details: { email },
      });
      
      res.json(adminProfile[0]);
    } catch (error: any) {
      console.error("Error creating admin:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // SuperAdmin: Get all admins
  app.get("/api/superadmin/admins", isAuthenticated, async (req: any, res) => {
    try {
      const admins = await db.select().from(adminProfiles);
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  // SuperAdmin: Remove admin
  app.delete("/api/superadmin/admins/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      await db.delete(adminProfiles).where(eq(adminProfiles.userId, id));
      await db.update(users).set({ role: "customer" }).where(eq(users.id, id));
      
      await db.insert(auditLogs).values({
        adminId: req.user.claims.sub,
        action: "DELETE_ADMIN",
        targetType: "admin",
        targetId: id,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing admin:", error);
      res.status(500).json({ error: "Failed to remove admin" });
    }
  });

  // SuperAdmin: Get audit logs
  app.get("/api/superadmin/audit-logs", isAuthenticated, async (req: any, res) => {
    try {
      const { limit = 20 } = req.query;
      const logs = await db.select().from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(parseInt(limit));
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // SuperAdmin: Get platform config
  app.get("/api/superadmin/config", isAuthenticated, async (req: any, res) => {
    try {
      res.json({
        enableReplitAuth: isReplitAuthEnabled(),
      });
    } catch (error) {
      console.error("Error fetching config:", error);
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

  // SuperAdmin: Update platform config
  app.post("/api/superadmin/config", isAuthenticated, async (req: any, res) => {
    try {
      const { enableReplitAuth } = req.body;
      
      // Update environment variable
      if (typeof enableReplitAuth === "boolean") {
        process.env.ENABLE_REPLIT_AUTH = enableReplitAuth ? "true" : "false";
      }

      // Log the change (non-critical - don't fail if audit_logs table doesn't exist)
      try {
        await db.insert(auditLogs).values({
          adminId: req.user.claims.sub,
          action: "UPDATE_CONFIG",
          targetType: "config",
          targetId: "auth_mode",
        });
      } catch (logError: any) {
        // Audit logging failed, but config was updated - this is okay
        if (logError.code !== "42P01") {
          console.error("Error logging config change:", logError.message);
        }
      }

      res.json({
        success: true,
        enableReplitAuth: isReplitAuthEnabled(),
      });
    } catch (error) {
      console.error("Error updating config:", error);
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
