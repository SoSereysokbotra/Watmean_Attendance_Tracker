/**
 * Database Utilities
 *
 * Common helper functions for database operations
 */

import { db } from "./index";
import { users, refreshTokens, verificationCodes } from "./schema";
import { eq, and, lt, isNull, sql } from "drizzle-orm";

/**
 * Database health check
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const [userCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);

  const [tokenCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(refreshTokens);

  const [codeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(verificationCodes);

  const [activeTokenCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(refreshTokens)
    .where(isNull(refreshTokens.revokedAt));

  const [verifiedUserCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.isVerified, true));

  return {
    users: {
      total: userCount.count,
      verified: verifiedUserCount.count,
      unverified: userCount.count - verifiedUserCount.count,
    },
    tokens: {
      total: tokenCount.count,
      active: activeTokenCount.count,
      revoked: tokenCount.count - activeTokenCount.count,
    },
    verificationCodes: {
      total: codeCount.count,
    },
  };
}

/**
 * Cleanup expired data
 */
export async function cleanupExpiredData() {
  const now = new Date();

  const deletedCodes = await db
    .delete(verificationCodes)
    .where(lt(verificationCodes.expiresAt, now))
    .returning();

  const deletedTokens = await db
    .delete(refreshTokens)
    .where(lt(refreshTokens.expiresAt, now))
    .returning();

  return {
    codesDeleted: deletedCodes.length,
    tokensDeleted: deletedTokens.length,
  };
}

/**
 * Get user statistics by role
 */
export async function getUserStatsByRole() {
  const stats = await db
    .select({
      role: users.role,
      count: sql<number>`count(*)::int`,
      verified: sql<number>`count(*) filter (where ${users.isVerified} = true)::int`,
      active: sql<number>`count(*) filter (where ${users.status} = 'active')::int`,
    })
    .from(users)
    .groupBy(users.role);

  return stats;
}

/**
 * Get token statistics by user
 */
export async function getTokenStatsByUser(userId: string) {
  const [result] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${refreshTokens.revokedAt} is null)::int`,
      revoked: sql<number>`count(*) filter (where ${refreshTokens.revokedAt} is not null)::int`,
      expired: sql<number>`count(*) filter (where ${refreshTokens.expiresAt} < now())::int`,
    })
    .from(refreshTokens)
    .where(eq(refreshTokens.userId, userId));

  return result;
}

/**
 * Safely delete user and all related data (cascade)
 */
export async function deleteUserCompletely(userId: string) {
  // Due to CASCADE in foreign keys, this will automatically delete:
  // - All refresh tokens
  // - All verification codes
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning();

  return deletedUser;
}

/**
 * Revoke all sessions for a user (useful for password changes)
 */
export async function revokeAllUserSessions(userId: string) {
  const revokedTokens = await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
    )
    .returning();

  return revokedTokens;
}

/**
 * Get recent user activity (last tokens created)
 */
export async function getRecentUserActivity(userId: string, limit = 10) {
  return await db.query.refreshTokens.findMany({
    where: eq(refreshTokens.userId, userId),
    orderBy: (tokens, { desc }) => [desc(tokens.createdAt)],
    limit,
    columns: {
      id: true,
      deviceInfo: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
      revokedAt: true,
    },
  });
}

/**
 * Check if user has active verification code
 */
export async function hasActiveVerificationCode(
  userId: string,
  purpose: "email_verification" | "password_reset",
): Promise<boolean> {
  const [code] = await db
    .select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.userId, userId),
        eq(verificationCodes.purpose, purpose),
        sql`${verificationCodes.expiresAt} > now()`,
      ),
    )
    .limit(1);

  return !!code;
}

/**
 * Batch update user status
 */
export async function batchUpdateUserStatus(
  userIds: string[],
  status: "active" | "pending" | "blocked" | "deleted",
) {
  if (userIds.length === 0) return [];

  const updatedUsers = await db
    .update(users)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(sql`${users.id} = ANY(${userIds})`)
    .returning();

  return updatedUsers;
}
