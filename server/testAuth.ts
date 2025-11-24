/**
 * Development/Test Authentication
 * Use ONLY for local development and testing
 * Bypass Replit Auth for faster testing during development
 */

import type { Express, RequestHandler } from "express";
import passport from "passport";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { db } from "./db";
import { users, farmerProfiles, agentProfiles, adminProfiles, superAdminProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";

// Test user credentials for local development
export const TEST_USERS = {
  customer: {
    id: "test-customer-1",
    email: "customer@test.local",
    firstName: "Test",
    lastName: "Customer",
    role: "customer",
  },
  farmer: {
    id: "test-farmer-1",
    email: "farmer@test.local",
    firstName: "Test",
    lastName: "Farmer",
    role: "seller",
  },
  agent: {
    id: "test-agent-1",
    email: "agent@test.local",
    firstName: "Test",
    lastName: "Agent",
    role: "agent",
  },
  admin: {
    id: "test-admin-1",
    email: "admin@test.local",
    firstName: "Test",
    lastName: "Admin",
    role: "admin",
  },
  superadmin: {
    id: "test-superadmin-1",
    email: "superadmin@test.local",
    firstName: "Test",
    lastName: "SuperAdmin",
    role: "superadmin",
  },
};

export async function seedTestUsers() {
  try {
    // Create test users
    for (const [role, userData] of Object.entries(TEST_USERS)) {
      try {
        await storage.upsertUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });

        // Update user role
        await db
          .update(users)
          .set({ role: userData.role as any })
          .where(eq(users.id, userData.id));

        // Create role-specific profiles (skip if tables don't exist yet)
        try {
          if (role === "farmer") {
            await db
              .insert(farmerProfiles)
              .values({
                userId: userData.id,
                farmName: "Test Farm",
                farmArea: "5 acres",
                farmingType: "Organic",
                isVerified: true,
              })
              .onConflictDoNothing();
          } else if (role === "agent") {
            await db
              .insert(agentProfiles)
              .values({
                userId: userData.id,
                agentName: userData.firstName,
                companyName: "Test Distribution",
                serviceArea: "All India",
                isVerified: true,
              })
              .onConflictDoNothing();
          } else if (role === "admin") {
            await db
              .insert(adminProfiles)
              .values({
                userId: userData.id,
                adminName: userData.firstName,
                department: "Content Moderation",
                permissions: ["approve_farmers", "approve_products", "manage_content"],
              })
              .onConflictDoNothing();
          } else if (role === "superadmin") {
            await db
              .insert(superAdminProfiles)
              .values({
                userId: userData.id,
                superAdminName: userData.firstName,
                permissions: ["all"],
              })
              .onConflictDoNothing();
          }
        } catch (profileError: any) {
          // Profile tables might not exist yet - that's okay for test users
          if (profileError.code !== "42P01") {
            console.error(`  Error creating ${role} profile:`, profileError.message);
          }
        }
      } catch (userError: any) {
        // If role enum value doesn't exist, just skip this user
        if (userError.code === "22P02") {
          console.log(`  ⚠️  Role '${userData.role}' not in database enum (skipped)`);
        } else {
          console.error(`  Error creating ${role} user:`, userError.message);
        }
      }
    }
    console.log("✅ Test users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding test users:", error);
  }
}

export function setupSessionMiddleware(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  app.set("trust proxy", 1);
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Setup basic serialization
  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));
}

export function setupTestAuth(app: Express) {
  if (process.env.NODE_ENV !== "development") {
    console.log("⏭️  Test auth disabled (not in development mode)");
    return;
  }

  console.log("🧪 Setting up test authentication for development...");

  // Helper: Promisify req.login
  const loginAsync = (req: any, user: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      req.login(user, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  // Helper: Promisify req.logout
  const logoutAsync = (req: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      req.logout((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  // Test login endpoint - creates a fake session with the test user
  app.post("/api/test/login/:role", async (req: any, res) => {
    const { role } = req.params;
    const testUser = TEST_USERS[role as keyof typeof TEST_USERS];

    if (!testUser) {
      return res.status(400).json({
        error: "Invalid role",
        available: Object.keys(TEST_USERS),
      });
    }

    try {
      // Create fake session user object (same format as Replit Auth)
      const fakeUser = {
        claims: {
          sub: testUser.id,
          email: testUser.email,
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          profile_image_url: null,
        },
        access_token: "test-token-" + testUser.id,
        refresh_token: "test-refresh-" + testUser.id,
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 1 week
      };

      // Store in session using async/await
      req.user = fakeUser;
      await loginAsync(req, fakeUser);

      // Return success response
      return res.json({
        success: true,
        message: `✅ Logged in as ${role}: ${testUser.email}`,
        user: {
          id: testUser.id,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          role: testUser.role,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Test login failed",
        details: error.message,
      });
    }
  });

  // Test logout endpoint
  app.post("/api/test/logout", async (req: any, res) => {
    try {
      await logoutAsync(req);
      return res.json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: "Logout failed", details: error.message });
    }
  });

  // Get all test users endpoint
  app.get("/api/test/users", (req, res) => {
    const testUsersList = Object.entries(TEST_USERS).map(([role, user]) => ({
      role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));

    res.json({
      message: "Available test users for local development",
      users: testUsersList,
      loginCommand:
        "curl -X POST http://localhost:5000/api/test/login/{role}",
    });
  });

  // Seed test users on startup
  seedTestUsers();
}
