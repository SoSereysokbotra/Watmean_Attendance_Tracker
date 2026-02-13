import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users.schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/middleware/rbac.middleware";

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authError = requireAdmin(request);
    if (authError) return authError;

    const allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({ success: true, data: allUsers });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
