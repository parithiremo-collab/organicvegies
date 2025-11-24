// Storage interface for the application
// We'll use Drizzle ORM directly in routes for database operations

export interface IStorage {
  // Placeholder for future storage methods if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Memory storage no longer used - using PostgreSQL
  }
}

export const storage = new MemStorage();
