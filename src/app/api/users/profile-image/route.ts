import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users.schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { CookieUtil } from "@/lib/auth/utils/cookie.util";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { JwtPayload } from "@/lib/auth/types";

export async function PATCH(req: Request) {
  try {
    const accessToken = await CookieUtil.getAccessTokenCookie();

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = TokenUtil.verifyAccessToken(accessToken);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, imageUrl } = body;

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Authorization check: User can only update their own profile, unless admin
    if (decoded.id !== userId && decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .update(users)
      .set({ profileImage: imageUrl })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
