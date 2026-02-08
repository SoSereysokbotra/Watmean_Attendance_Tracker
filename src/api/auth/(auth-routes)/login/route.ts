import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import { loginSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authLimiter(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const result = await AuthService.login(validatedData);

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
