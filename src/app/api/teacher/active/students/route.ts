import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";

import { authConfig } from "@/lib/auth/config";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { db } from "@/lib/db";
import { attendanceRecords, classes, enrollments, sessions } from "@/lib/db/schema";

function todayISODate() {
  return new Date().toISOString().split("T")[0];
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

    let payload: any;
    try {
      payload = TokenUtil.verifyAccessToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { sessionId, classId, studentId, status } = body ?? {};

    if (!sessionId || !classId || !studentId || !status) {
      return NextResponse.json(
        { error: "sessionId, classId, studentId, and status are required" },
        { status: 400 },
      );
    }

    if (!["present", "absent", "late", "excused"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify session belongs to teacher and matches class
    const session = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.teacherId, payload.id)))
      .then((res) => res[0]);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 },
      );
    }

    if (session.classId !== classId) {
      return NextResponse.json(
        { error: "Session does not match class" },
        { status: 400 },
      );
    }

    const date = todayISODate();

    // Prefer updating an existing record for this session if present,
    // otherwise update/insert today's record for the class.
    const existingForSession = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.sessionId, sessionId),
          eq(attendanceRecords.studentId, studentId),
        ),
      )
      .then((res) => res[0]);

    const checkInTime =
      status === "present" || status === "late"
        ? new Date().toTimeString().split(" ")[0]
        : null;

    if (existingForSession) {
      const updated = await db
        .update(attendanceRecords)
        .set({
          status,
          checkInTime,
          updatedAt: new Date(),
        })
        .where(eq(attendanceRecords.id, existingForSession.id))
        .returning();

      return NextResponse.json({ success: true, record: updated[0] });
    }

    const existingForToday = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.studentId, studentId),
          eq(attendanceRecords.classId, classId),
          eq(attendanceRecords.date, date),
        ),
      )
      .then((res) => res[0]);

    if (existingForToday) {
      const updated = await db
        .update(attendanceRecords)
        .set({
          sessionId,
          status,
          checkInTime,
          updatedAt: new Date(),
        })
        .where(eq(attendanceRecords.id, existingForToday.id))
        .returning();

      return NextResponse.json({ success: true, record: updated[0] });
    }

    const inserted = await db
      .insert(attendanceRecords)
      .values({
        studentId,
        classId,
        sessionId,
        date,
        status,
        checkInTime,
        remarks: "Teacher override",
      })
      .returning();

    return NextResponse.json({ success: true, record: inserted[0] });
  } catch (error) {
    console.error("Teacher attendance update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(authConfig.cookies.accessToken)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let payload: any;
    try {
      payload = TokenUtil.verifyAccessToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { classId, studentId } = body ?? {};

    if (!classId || !studentId) {
      return NextResponse.json(
        { error: "classId and studentId are required" },
        { status: 400 },
      );
    }

    // Verify teacher owns the class
    const cls = await db
      .select()
      .from(classes)
      .where(and(eq(classes.id, classId), eq(classes.teacherId, payload.id)))
      .then((res) => res[0]);

    if (!cls) {
      return NextResponse.json(
        { error: "Class not found or unauthorized" },
        { status: 404 },
      );
    }

    // Remove enrollment (removes student from roster)
    await db
      .delete(enrollments)
      .where(and(eq(enrollments.classId, classId), eq(enrollments.studentId, studentId)));

    // Also remove attendance history for this class (optional but keeps data consistent with removal)
    await db
      .delete(attendanceRecords)
      .where(and(eq(attendanceRecords.classId, classId), eq(attendanceRecords.studentId, studentId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Teacher remove student error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

