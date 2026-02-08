import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/lib/auth/services/token.service";
import { refreshTokenSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = refreshTokenSchema.parse(body);

    const result = await TokenService.refreshToken(validatedData.refreshToken);

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
