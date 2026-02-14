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
    const { classId, startTime, endTime, lat, lng, radius, room } = body;

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

    // Check for existing active session for this class
    const existingSession = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.classId, classId), eq(sessions.status, "active")))
      .then((res) => res[0]);

    if (existingSession) {
      return NextResponse.json(
        {
          error: "An active session already exists for this class.",
          session: existingSession,
        },
        { status: 409 }, // Conflict
      );
    }

    // Create new session
    const newSession = await db
      .insert(sessions)
      .values({
        classId,
        teacherId: userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "active",
        room: room || classData.room, // Use provided room or fallback to class default
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

export async function PATCH(request: NextRequest) {
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
    const { sessionId, radius, room, lat, lng } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Verify session matches teacher and exists
    const session = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.teacherId, userId)))
      .then((res) => res[0]);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 },
      );
    }

    // Update
    const updated = await db
      .update(sessions)
      .set({
        radius: radius ? Number(radius) : undefined,
        room: room || undefined,
        lat: lat ? String(lat) : undefined,
        lng: lng ? String(lng) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId))
      .returning();

    return NextResponse.json({
      success: true,
      session: updated[0],
    });
  } catch (error) {
    console.error("Update Session API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
