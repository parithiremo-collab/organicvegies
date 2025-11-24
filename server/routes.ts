import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { categories, products, cartItems, orders, orderItems } from "@shared/schema";
import { eq, and, or, ilike, gte, lte, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (MANDATORY for Replit Auth)
  await setupAuth(app);

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
      const userId = req.user.claims.sub;
      const { deliveryAddress, deliverySlot } = req.body;

      if (!deliveryAddress || !deliverySlot) {
        return res.status(400).json({ error: "Missing delivery details" });
      }

      // Get cart items
      const cartData = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      }).from(cartItems).where(eq(cartItems.userId, userId));

      if (cartData.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Fetch product details
      const productIds = cartData.map(item => item.productId);
      const productDetails = await db.select().from(products)
        .where(and(...productIds.map(id => eq(products.id, id) as any)));

      let totalAmount = 0;
      const orderItemsData = [];

      for (const cartItem of cartData) {
        const product = productDetails.find(p => p.id === cartItem.productId);
        if (!product) {
          return res.status(400).json({ error: "Product not found" });
        }
        const itemTotal = parseFloat(product.price) * cartItem.quantity;
        totalAmount += itemTotal;
        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          price: product.price,
          quantity: cartItem.quantity,
          weight: product.weight,
        });
      }

      // Create order
      const orderData = {
        userId,
        totalAmount: totalAmount.toString(),
        status: "pending" as const,
        paymentStatus: "pending" as const,
        deliveryAddressLine1: deliveryAddress.line1,
        deliveryAddressLine2: deliveryAddress.line2 || null,
        deliveryCity: deliveryAddress.city,
        deliveryState: deliveryAddress.state,
        deliveryPincode: deliveryAddress.pincode,
        deliverySlot,
      };

      const [newOrder] = await db.insert(orders).values(orderData).returning();

      // Add order items
      for (const item of orderItemsData) {
        await db.insert(orderItems).values({
          orderId: newOrder.id,
          ...item,
        });
      }

      // Create Stripe checkout session
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'FreshHarvest Order',
              description: `Order #${newOrder.id}`,
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders/${newOrder.id}?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout?cancelled=true`,
        metadata: {
          orderId: newOrder.id,
          userId,
        },
      });

      // Update order with Stripe session ID
      await db.update(orders)
        .set({ stripeSessionId: session.id })
        .where(eq(orders.id, newOrder.id));

      // Clear cart
      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      res.json({ sessionId: session.id, orderId: newOrder.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
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

  const httpServer = createServer(app);
  return httpServer;
}
