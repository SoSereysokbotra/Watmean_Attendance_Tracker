import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, classes, enrollments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Distance calculation helper (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

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

    if (role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Location data required" },
        { status: 400 },
      );
    }

    // Find active session for student's enrolled classes
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
        classLat: classes.lat,
        classLng: classes.lng,
        classRadius: classes.radius,
      })
      .from(sessions)
      .innerJoin(classes, eq(sessions.classId, classes.id))
      .innerJoin(enrollments, eq(enrollments.classId, classes.id))
      .where(
        and(eq(enrollments.studentId, userId), eq(sessions.status, "active")),
      );

    if (activeSessions.length === 0) {
      return NextResponse.json(
        { error: "No active session available for check-in right now" },
        { status: 404 },
      );
    }

    // Use the first active session (in a real app, might need logic for multiple simultaneous sessions)
    const activeSession = activeSessions[0];

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
    const geofenceRadius = activeSession.sessionRadius || 50;

    if (!geofenceLat || !geofenceLng) {
      return NextResponse.json(
        {
          error:
            "Session location not configured. Please contact your teacher.",
        },
        { status: 400 },
      );
    }

    // Verify location
    const distance = getDistance(latitude, longitude, geofenceLat, geofenceLng);

    if (distance > geofenceRadius) {
      return NextResponse.json(
        {
          error: `You are too far from the classroom (${distance}m away, need to be within ${geofenceRadius}m)`,
        },
        { status: 400 },
      );
    }

    // Determine status based on check-in time vs session start time
    const now = new Date();
    const sessionStart = new Date(activeSession.sessionStartTime);
    const lateThresholdMinutes = 15; // Consider late if checking in more than 15 min after start
    const minutesAfterStart =
      (now.getTime() - sessionStart.getTime()) / (1000 * 60);

    const status =
      minutesAfterStart > lateThresholdMinutes ? "late" : "present";

    // Create attendance record with session ID
    try {
      const record = await AcademicRepository.createAttendanceRecord(
        userId,
        activeSession.classId,
        status,
        "Mobile Check-in",
        activeSession.sessionId,
      );

      return NextResponse.json({
        success: true,
        message: "Checked in successfully!",
        record: {
          ...record,
          className: activeSession.className,
          status,
        },
      });
    } catch (err: any) {
      if (err.message === "Already checked in for this class today") {
        return NextResponse.json(
          { error: "You have already checked in for this class." },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Check-in API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
