import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";
import { verificationSchema } from "@/lib/auth/schemas/auth.schemas";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verificationSchema.parse(body);

    const result = await AuthService.verifyEmail(validatedData);

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

    console.error("Email verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
