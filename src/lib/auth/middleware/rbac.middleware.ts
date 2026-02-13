import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "../utils/token.util";
import { JwtPayload } from "../types";
import { authConfig } from "../config";

/**
 * RBAC Middleware
 * Role-Based Access Control for protecting admin and role-specific routes
 */

/**
 * Extracts and verifies the access token from request
 * Returns the JWT payload if valid, null otherwise
 */
function extractAndVerifyToken(request: NextRequest): JwtPayload | null {
  let token: string | undefined;

  // Check Authorization header first
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Fall back to cookie
    token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  }

  if (!token) {
    return null;
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token) as JwtPayload;

    // Check token type
    if (payload.type !== "access") {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to require admin role
 * Returns NextResponse with error if not admin, null if authorized
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const payload = extractAndVerifyToken(request);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Unauthorized - Please login" },
      { status: 401 },
    );
  }

  if (payload.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden - Admin access required" },
      { status: 403 },
    );
  }

  return null; // Authorized
}

/**
 * Middleware to require specific roles
 * Returns a middleware function that checks if user has one of the allowed roles
 */
export function requireRole(
  allowedRoles: Array<"student" | "teacher" | "admin">,
): (request: NextRequest) => NextResponse | null {
  return (request: NextRequest) => {
    const payload = extractAndVerifyToken(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    if (!allowedRoles.includes(payload.role as any)) {
      return NextResponse.json(
        {
          success: false,
          message: `Forbidden - Requires one of: ${allowedRoles.join(", ")}`,
        },
        { status: 403 },
      );
    }

    return null; // Authorized
  };
}

/**
 * Helper to get authenticated user from request
 * Useful for API routes after RBAC check
 */
export function getAuthenticatedUser(request: NextRequest): {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
} | null {
  const payload = extractAndVerifyToken(request);

  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role as "student" | "teacher" | "admin",
  };
}
