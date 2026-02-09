import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/auth/services/token.service";
import { refreshTokenSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie and revoke it if it exists
    const { CookieUtil } = await import("@/lib/auth/utils/cookie.util");
    const refreshToken = await CookieUtil.getRefreshTokenCookie();

    if (refreshToken) {
      await TokenService.logout(refreshToken);
    }
    await CookieUtil.clearAllAuthCookies();

    // Always return success for logout
    return NextResponse.json({
      success: true,
      message: "Successfully logged out.",
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

    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
