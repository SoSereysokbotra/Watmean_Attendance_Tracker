import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, classes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
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
    const role = payload.role;

    if (role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { classId, startTime, endTime, lat, lng, radius } = body;

    if (!classId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify teacher owns the class
    const classData = await db
      .select()
      .from(classes)
      .where(and(eq(classes.id, classId), eq(classes.teacherId, userId)))
      .then((res) => res[0]);

    if (!classData) {
      return NextResponse.json(
        { error: "Class not found or unauthorized" },
        { status: 404 },
      );
    }

    // Deactivate any existing active sessions for this class (optional rule)
    // For now, let's just create the new session

    // Create new session
    const newSession = await db
      .insert(sessions)
      .values({
        classId,
        teacherId: userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "active",
        lat: lat ? String(lat) : null,
        lng: lng ? String(lng) : null,
        radius: radius ? Number(radius) : 50,
      })
      .returning();

    return NextResponse.json({
      success: true,
      session: newSession[0],
    });
  } catch (error) {
    console.error("Create Session API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
