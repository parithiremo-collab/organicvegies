import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { categories, products, cartItems, orders, orderItems, users, farmerProfiles, agentProfiles, agentSales, agentFarmerRelations, adminProfiles, superAdminProfiles, auditLogs } from "@shared/schema";
import { eq, and, or, ilike, gte, lte, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertFarmerProfileSchema, insertAgentProfileSchema, insertAdminProfileSchema, insertSuperAdminProfileSchema } from "@shared/schema";
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
      const { deliveryAddress, deliverySlot, deliveryFee = 0, paymentMethod = 'card' } = req.body;

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
      if (productIds.length === 0) {
        return res.status(400).json({ error: "No items in cart" });
      }
      
      const productDetails = await db.select().from(products)
        .where(or(...productIds.map(id => eq(products.id, id) as any)));

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

      // Add delivery fee to total
      totalAmount += parseFloat(deliveryFee.toString()) || 0;

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
      console.log(`Creating Stripe session for order ${newOrder.id}, amount: ${totalAmount}, paymentMethod: ${paymentMethod}`);
      
      const paymentMethodTypes = paymentMethod === 'upi' ? ['upi'] : ['card'];
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: paymentMethodTypes as any,
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
          paymentMethod,
        },
      });
      
      console.log(`Stripe session created: ${session.id}`);

      // Update order with Stripe session ID
      await db.update(orders)
        .set({ stripeSessionId: session.id })
        .where(eq(orders.id, newOrder.id));

      // Clear cart
      await db.delete(cartItems).where(eq(cartItems.userId, userId));

      res.json({ sessionId: session.id, orderId: newOrder.id });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      const errorMessage = error?.message || error?.toString() || "Failed to create checkout session";
      res.status(500).json({ error: errorMessage });
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

  const httpServer = createServer(app);
  return httpServer;
}
