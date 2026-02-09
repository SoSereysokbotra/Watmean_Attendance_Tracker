import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "../utils/token.util";
import { JwtPayload } from "../types";

import { authConfig } from "../config";

export async function authenticate(request: NextRequest) {
  let token: string | undefined;

  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  }

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = TokenUtil.verifyAccessToken(token) as JwtPayload;

    // Check token type
    if (payload.type !== "access") {
      return NextResponse.json(
        { message: "Invalid token type" },
        { status: 401 },
      );
    }

    // Attach user to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

// Helper to extract user from request
export function getAuthUser(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");
  const userRole = request.headers.get("x-user-role");

  if (!userId || !userEmail || !userRole) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
    role: userRole as "student" | "teacher" | "admin",
  };
}
