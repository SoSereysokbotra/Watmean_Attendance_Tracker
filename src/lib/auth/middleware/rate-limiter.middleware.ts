import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "../config";

// In-memory store for rate limiting (for demonstration; use Redis in production)
const authAttempts = new Map<string, number[]>();

export function authLimiter(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
  const now = Date.now();
  const windowMs = authConfig.rateLimiting.authWindowMs;
  const max = authConfig.rateLimiting.authMax;

  const attempts = authAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => time > now - windowMs);

  if (recentAttempts.length >= max) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  recentAttempts.push(now);
  authAttempts.set(ip, recentAttempts);

  // Clean up old attempts
  setTimeout(() => {
    const updatedAttempts = authAttempts.get(ip) || [];
    const filteredAttempts = updatedAttempts.filter(
      (time) => time > now - windowMs,
    );
    if (filteredAttempts.length === 0) {
      authAttempts.delete(ip);
    } else {
      authAttempts.set(ip, filteredAttempts);
    }
  }, windowMs);

  return NextResponse.next();
}
