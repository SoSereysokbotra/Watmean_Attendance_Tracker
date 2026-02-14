import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
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

    if (role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch comprehensive reports
    const [stats, trend, performance] = await Promise.all([
      AcademicRepository.getAttendanceReport(userId),
      AcademicRepository.getAttendanceTrend(userId, 7), // Last 7 days
      AcademicRepository.getClassPerformance(userId),
    ]);

    return NextResponse.json({
      reports: stats, // Keeping 'reports' key for stats as per existing frontend, or rename? Frontend expects 'reports' to be the stats object currently.
      trend,
      performance,
    });
  } catch (error) {
    console.error("Teacher Reports API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
