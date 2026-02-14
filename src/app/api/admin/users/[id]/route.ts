import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users.schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/middleware/rbac.middleware";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const { role, status } = body;

    // Validate inputs
    if (role && !["student", "teacher", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 },
      );
    }

    if (
      status &&
      !["active", "pending", "blocked", "deleted"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    await db
      .update(users)
      .set({
        ...(role && { role }),
        ...(status && { status }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true, message: "User updated" });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = await params;

    // Soft delete by setting status to 'deleted'
    await db
      .update(users)
      .set({ status: "deleted", updatedAt: new Date() })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
