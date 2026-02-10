import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";

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

const TARGET_LOCATION = { lat: 12.5657, lon: 104.991 }; // Mock classroom location
const ATTENDANCE_RADIUS = 100; // Meters

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

    // Verify location
    const distance = getDistance(
      latitude,
      longitude,
      TARGET_LOCATION.lat,
      TARGET_LOCATION.lon,
    );

    if (distance > ATTENDANCE_RADIUS) {
      return NextResponse.json(
        { error: `You are too far from the classroom (${distance}m)` },
        { status: 400 },
      );
    }

    // Determine class to check in (Mocking logic: finding the first class scheduled for today)
    // In a real app, logic would match time and class schedule more precisely.
    const todaySchedule = await AcademicRepository.getTodaySchedule(userId);
    const activeClass = todaySchedule[0]; // Simplified: taking first class

    if (!activeClass) {
      return NextResponse.json(
        { error: "No class scheduled for check-in right now" },
        { status: 404 },
      );
    }

    // Create attendance record
    try {
      const record = await AcademicRepository.createAttendanceRecord(
        userId,
        activeClass.classId,
        "present", // Or Calculate 'late' based on time
        "Mobile Check-in",
      );

      return NextResponse.json({
        success: true,
        message: "Checked in successfully!",
        record,
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
