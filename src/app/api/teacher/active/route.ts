import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions, classes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

    if (role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find active session for this teacher
    const activeSession = await db
      .select({
        session: sessions,
        class: classes,
      })
      .from(sessions)
      .innerJoin(classes, eq(sessions.classId, classes.id))
      .where(and(eq(sessions.teacherId, userId), eq(sessions.status, "active")))
      .limit(1)
      .then((res) => res[0]);

    if (!activeSession) {
      return NextResponse.json({ activeSession: null });
    }

    // Fetch full details for the active class to match previous expected structure
    // or just return what we have.
    // The frontend likely expects `activeSession` to contain class details.

    // Combining session and class data
    const sessionData = {
      ...activeSession.class,
      ...activeSession.session,
      // Ensure ID is session ID or Class ID depending on what frontend expects.
      // Based on previous code, it returned getClassDetails result.
      // Let's return a merged object where top level has session props but also class info.
      id: activeSession.session.id, // Session ID
      classId: activeSession.class.id,
      className: activeSession.class.name,
      room: activeSession.session.lat
        ? "Geofence Active"
        : activeSession.class.room, // Override room if geofence

      // We might need to fetch students to be consistent with `getClassDetails`
      students: [], // For now empty, or fetch if needed
    };

    // Actually, let's get the full class details including students using the Repo
    const classDetails = await AcademicRepository.getClassDetails(
      activeSession.class.id,
    );

    if (!classDetails) {
      return NextResponse.json(
        { error: "Class details not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      activeSession: {
        ...classDetails, // Class details + students
        sessionId: activeSession.session.id,
        status: activeSession.session.status,
        startTime: activeSession.session.startTime,
        endTime: activeSession.session.endTime,
        lat: activeSession.session.lat,
        lng: activeSession.session.lng,
        radius: activeSession.session.radius,
        room: activeSession.session.room || classDetails.room,
      },
    });
  } catch (error) {
    console.error("Teacher Active Session API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
