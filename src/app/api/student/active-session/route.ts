import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, classes, enrollments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/student/active-session
 * Returns the current active session for the student's enrolled classes
 */
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
    const role = payload.role;

    if (role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classIdParam = searchParams.get("classId");

    // Find active session for student's enrolled classes
    // If classId is provided, filter by it.
    const activeSessions = await db
      .select({
        sessionId: sessions.id,
        sessionStartTime: sessions.startTime,
        sessionEndTime: sessions.endTime,
        sessionLat: sessions.lat,
        sessionLng: sessions.lng,
        sessionRadius: sessions.radius,
        sessionRoom: sessions.room,
        classId: classes.id,
        className: classes.name,
        classCode: classes.code,
        classLat: classes.lat,
        classLng: classes.lng,
        classRadius: classes.radius,
        classRoom: classes.room,
      })
      .from(sessions)
      .innerJoin(classes, eq(sessions.classId, classes.id))
      .innerJoin(enrollments, eq(enrollments.classId, classes.id))
      .where(
        and(
          eq(enrollments.studentId, userId),
          eq(sessions.status, "active"),
          classIdParam ? eq(sessions.classId, classIdParam) : undefined,
        ),
      );

    // Filter out expired sessions and update their status
    const now = new Date();
    const validSessions = [];
    const GRACE_PERIOD_MINUTES = 10; // Allow check-in up to 30 minutes after session ends

    for (const session of activeSessions) {
      const endTime = new Date(session.sessionEndTime);
      const graceEndTime = new Date(
        endTime.getTime() + GRACE_PERIOD_MINUTES * 60 * 1000,
      );

      if (graceEndTime < now) {
        // Session expired beyond grace period, update status to ended
        await db
          .update(sessions)
          .set({ status: "ended" })
          .where(eq(sessions.id, session.sessionId));
      } else {
        // Session is still valid (either active or in grace period)
        validSessions.push(session);
      }
    }

    if (validSessions.length === 0) {
      return NextResponse.json({ activeSession: null });
    }

    const activeSession = validSessions[0];

    // Determine geofence location: use session location if set, otherwise class location
    const geofenceLat = activeSession.sessionLat
      ? Number(activeSession.sessionLat)
      : activeSession.classLat
        ? Number(activeSession.classLat)
        : null;
    const geofenceLng = activeSession.sessionLng
      ? Number(activeSession.sessionLng)
      : activeSession.classLng
        ? Number(activeSession.classLng)
        : null;
    const geofenceRadius =
      activeSession.sessionRadius || activeSession.classRadius || 50;
    const room = activeSession.sessionRoom || activeSession.classRoom || "TBD";

    return NextResponse.json({
      activeSession: {
        sessionId: activeSession.sessionId,
        classId: activeSession.classId,
        className: activeSession.className,
        classCode: activeSession.classCode,
        room,
        startTime: activeSession.sessionStartTime,
        endTime: activeSession.sessionEndTime,
        geofence: {
          lat: geofenceLat,
          lng: geofenceLng,
          radius: geofenceRadius,
        },
      },
    });
  } catch (error) {
    console.error("Active Session API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
