import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import { loginSchema } from "@/lib/auth/schemas/auth.schemas";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import z from "zod";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const result = await AuthService.login(validatedData);

    if (result.success && result.data) {
      const { accessToken, refreshToken, user } = result.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Failed to generate tokens");
      }
      await CookieUtil.setAccessTokenCookie(accessToken);
      await CookieUtil.setRefreshTokenCookie(refreshToken);

      // Return user data without tokens in body
      return NextResponse.json({
        success: true,
        data: { user },
      });
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 401,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
