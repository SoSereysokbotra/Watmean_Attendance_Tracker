import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { UserRepository } from "@/lib/auth/repositories/user.repository";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(authConfig.cookies.accessToken)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let payload;
    try {
      payload = TokenUtil.verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const user = await UserRepository.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return safe user data
    return NextResponse.json({
      profile: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        status: user.status,
        teacherId: user.teacher_id,
      },
    });
  } catch (error) {
    console.error("Teacher Settings API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  // Implementation for updating settings would go here
  // For now, just a placeholder
  return NextResponse.json({ message: "Settings update not implemented yet" });
}
