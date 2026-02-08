import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { authLimiter } from "@/lib/auth/middleware/rate-limiter.middleware";
import { signupSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authLimiter(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const result = await AuthService.signup(validatedData);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
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

    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
