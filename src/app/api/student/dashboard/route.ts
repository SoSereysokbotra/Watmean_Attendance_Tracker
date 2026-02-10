import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { UserRepository } from "@/lib/db/repositories/example.repository"; 
import { cookies } from "next/headers";

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

    const [user, stats, nextClass, todaySchedule] = await Promise.all([
      UserRepository.findById(userId),
      AcademicRepository.getStudentAttendanceStats(userId),
      AcademicRepository.getNextClass(userId),
      AcademicRepository.getTodaySchedule(userId),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.fullName,
        studentId: user.studentId || (user as any).student_id || null,
        email: user.email,
        initials: user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
      stats: {
        attendancePercentage: stats.percentage,
        lateArrivals: stats.late,
        todayClasses: todaySchedule.length,
      },
      nextClass,
      todaySchedule,
      currentSession: "Fall Semester 2026",
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
