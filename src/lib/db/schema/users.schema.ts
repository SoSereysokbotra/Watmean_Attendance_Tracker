import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users table - stores all user data for students, teachers, and admins
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: ["student", "teacher", "admin"] })
      .notNull()
      .default("student"),
    isVerified: boolean("is_verified").notNull().default(false),
    status: text("status", {
      enum: ["active", "pending", "blocked", "deleted"],
    })
      .notNull()
      .default("pending"),
    studentId: text("student_id").unique(),
    teacherId: text("teacher_id").unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
    statusIdx: index("idx_users_status").on(table.status),
    studentIdIdx: index("idx_users_student_id").on(table.studentId),
    teacherIdIdx: index("idx_users_teacher_id").on(table.teacherId),
  }),
);

/**
 * Relations for users table
 */
export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  verificationCodes: many(verificationCodes),
}));

/**
 * Refresh tokens table - stores JWT refresh tokens with family tracking
 */
export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    familyId: uuid("family_id").notNull(),
    deviceInfo: text("device_info"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_refresh_tokens_user_id").on(table.userId),
    tokenHashIdx: index("idx_refresh_tokens_token_hash").on(table.tokenHash),
    familyIdIdx: index("idx_refresh_tokens_family_id").on(table.familyId),
    expiresAtIdx: index("idx_refresh_tokens_expires_at").on(table.expiresAt),
    revokedAtIdx: index("idx_refresh_tokens_revoked_at").on(table.revokedAt),
  }),
);

/**
 * Relations for refresh_tokens table
 */
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

/**
 * Verification codes table - stores email verification and password reset codes
 */
export const verificationCodes = pgTable(
  "verification_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    codeHash: text("code_hash").notNull(),
    purpose: text("purpose", {
      enum: ["email_verification", "password_reset"],
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_verification_codes_user_id").on(table.userId),
    expiresAtIdx: index("idx_verification_codes_expires_at").on(
      table.expiresAt,
    ),
    purposeIdx: index("idx_verification_codes_purpose").on(table.purpose),
  }),
);

/**
 * Relations for verification_codes table
 */
export const verificationCodesRelations = relations(
  verificationCodes,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationCodes.userId],
      references: [users.id],
    }),
  }),
);
