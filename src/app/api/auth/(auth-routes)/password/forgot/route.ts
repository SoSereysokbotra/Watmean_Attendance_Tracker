import { NextRequest, NextResponse } from "next/server";
import { PasswordService } from "@/lib/auth/services/password.service";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import { passwordResetRequestSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await authLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = passwordResetRequestSchema.parse(body);

    const result = await PasswordService.requestReset(validatedData);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
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

    console.error("Password reset request error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
