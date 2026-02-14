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
        profileImage: user.profile_image,
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
    const body = await request.json();
    const { fullName } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "Full Name is required" },
        { status: 400 },
      );
    }

    const updatedUser = await UserRepository.update(userId, {
      full_name: fullName,
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.is_verified,
        status: updatedUser.status,
        teacherId: updatedUser.teacher_id,
        profileImage: updatedUser.profile_image,
      },
    });
  } catch (error) {
    console.error("Update Settings API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
