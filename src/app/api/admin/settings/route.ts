import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users.schema";
import { eq } from "drizzle-orm";
import {
  requireAdmin,
  getAuthenticatedUser,
} from "@/lib/auth/middleware/rbac.middleware";

export async function GET(request: NextRequest) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
      columns: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Failed to fetch admin settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName } = body;

    // Only allowing name updates for now, as email/role are sensitive
    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 },
      );
    }

    await db
      .update(users)
      .set({
        fullName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, authUser.id));

    const updatedProfile = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
      columns: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Failed to update admin profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
