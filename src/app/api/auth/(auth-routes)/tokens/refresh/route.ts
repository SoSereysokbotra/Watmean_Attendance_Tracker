import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/auth/services/token.service";
import { refreshTokenSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const { CookieUtil } = await import("@/lib/auth/utils/cookie.util");
    const refreshToken = await CookieUtil.getRefreshTokenCookie();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token not found" },
        { status: 401 },
      );
    }

    const result = await TokenService.refreshToken(refreshToken);

    if (result.success && result.data) {
      const { accessToken, refreshToken: newRefreshToken, user } = result.data;

      // Set cookies
      await CookieUtil.setAccessTokenCookie(accessToken!);
      await CookieUtil.setRefreshTokenCookie(newRefreshToken!);

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

    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
