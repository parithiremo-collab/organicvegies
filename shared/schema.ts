import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["customer", "seller", "agent", "admin", "superadmin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

// Session storage table (MANDATORY for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("customer"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  productCount: integer("product_count").notNull().default(0),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  sellerId: varchar("seller_id").references(() => users.id),
  farmerId: varchar("farmer_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  mrp: decimal("mrp", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  origin: text("origin").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  lowStock: boolean("low_stock").notNull().default(false),
  stock: integer("stock").notNull().default(0),
  weight: text("weight").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Farmer profile
export const farmerProfiles = pgTable("farmer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  farmName: text("farm_name").notNull(),
  farmArea: text("farm_area"),
  farmingType: text("farming_type"),
  certifications: text("certifications").array(),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  totalProductsSold: integer("total_products_sold").notNull().default(0),
  earnings: decimal("earnings", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Agent profile
export const agentProfiles = pgTable("agent_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  agentName: text("agent_name").notNull(),
  companyName: text("company_name"),
  serviceArea: text("service_area"),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).notNull().default("5.00"),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  totalSales: integer("total_sales").notNull().default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin profile
export const adminProfiles = pgTable("admin_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  adminName: text("admin_name").notNull(),
  department: text("department"),
  permissions: text("permissions").array(),
  bio: text("bio"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Super Admin profile
export const superAdminProfiles = pgTable("super_admin_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  superAdminName: text("super_admin_name").notNull(),
  bio: text("bio"),
  permissions: text("permissions").array(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin audit log
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: varchar("target_id").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Agent-Farmer relationship
export const agentFarmerRelations = pgTable("agent_farmer_relations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  farmerId: varchar("farmer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Agent sales commission tracking
export const agentSales = pgTable("agent_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  deliveryAddressLine1: text("delivery_address_line1").notNull(),
  deliveryAddressLine2: text("delivery_address_line2"),
  deliveryCity: text("delivery_city").notNull(),
  deliveryState: text("delivery_state").notNull(),
  deliveryPincode: text("delivery_pincode").notNull(),
  deliverySlot: text("delivery_slot").notNull(),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  weight: text("weight").notNull(),
});

// Schema validators
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
}).partial();

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertFarmerProfileSchema = createInsertSchema(farmerProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertAgentProfileSchema = createInsertSchema(agentProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertAdminProfileSchema = createInsertSchema(adminProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertSuperAdminProfileSchema = createInsertSchema(superAdminProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addresses.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertFarmerProfile = z.infer<typeof insertFarmerProfileSchema>;
export type FarmerProfile = typeof farmerProfiles.$inferSelect;

export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type AgentProfile = typeof agentProfiles.$inferSelect;

export type InsertAdminProfile = z.infer<typeof insertAdminProfileSchema>;
export type AdminProfile = typeof adminProfiles.$inferSelect;

export type InsertSuperAdminProfile = z.infer<typeof insertSuperAdminProfileSchema>;
export type SuperAdminProfile = typeof superAdminProfiles.$inferSelect;

export type AgentSale = typeof agentSales.$inferSelect;
export type AgentFarmerRelation = typeof agentFarmerRelations.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
