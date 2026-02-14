import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * PostgreSQL connection
 * Using the postgres-js library for the connection
 */
const connectionString = process.env.DATABASE_URL;

// Create a postgres client for migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// Create a postgres client for regular operations
const queryClient = postgres(connectionString);

/**
 * Drizzle database instance
 * This is the main database instance used throughout the application
 */
export const db = drizzle(queryClient, { schema });

// Export schema and types for convenience
export { schema };
export type Database = typeof db;
