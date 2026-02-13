import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Invitations table - stores invitation tokens for role-based signup
 */
export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  role: text("role", { enum: ["student", "teacher", "admin"] }).notNull(),
  status: text("status", {
    enum: ["pending", "accepted", "expired"],
  })
    .notNull()
    .default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
