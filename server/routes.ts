import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { categories, products } from "@shared/schema";
import { eq, and, or, ilike, gte, lte, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
