import { NextRequest, NextResponse } from "next/server";
import rateLimit from "express-rate-limit";
import { authConfig } from "../config";

const limiter = rateLimit({
  windowMs: authConfig.rateLimiting.authWindowMs,
  max: authConfig.rateLimiting.authMax,
  message: "Too many requests. Please try again later.",
  standardHeaders: true, 
  legacyHeaders: false, 
  keyGenerator: (req: any) => {
    const forwardedFor =
      req.headers?.get?.("x-forwarded-for") || req.headers?.["x-forwarded-for"];
    if (typeof forwardedFor === "string") {
      return forwardedFor.split(",")[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || "unknown";
  },
});

export async function authLimiter(
  request: NextRequest,
): Promise<NextResponse | null> {
  return new Promise((resolve) => {
    const mockReq: any = {
      headers: {
        get: (key: string) => request.headers.get(key),
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
      },
      socket: {},
    };

    const mockRes: any = {
      status: (code: number) => {
        mockRes.statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        mockRes.jsonData = data;
        return mockRes;
      },
      set: () => mockRes,
      setHeader: () => mockRes,
    };

    const next = (err?: any) => {
      if (err || mockRes.statusCode === 429) {
        // Rate limit exceeded
        const message =
          typeof mockRes.jsonData?.message === "string"
            ? mockRes.jsonData.message
            : "Too many requests. Please try again later.";

        resolve(NextResponse.json({ message }, { status: 429 }));
      } else {
        // Rate limit not exceeded
        resolve(null);
      }
    };

    // Call the rate limiter
    limiter(mockReq, mockRes, next);
  });
}
