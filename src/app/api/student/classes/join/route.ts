import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { normalizeClassCode } from "@/lib/utils/class-code.util";
import { db } from "@/lib/db";

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
      return NextResponse.json(
        { error: "Only students can join classes" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { classCode } = body;

    if (!classCode) {
      return NextResponse.json(
        { error: "Class code is required" },
        { status: 400 },
      );
    }

    // Normalize and validate class code
    const normalizedCode = normalizeClassCode(classCode);

    // Find class by code
    const classData = await AcademicRepository.getClassByCode(normalizedCode);

    if (!classData) {
      return NextResponse.json(
        { error: "Invalid class code" },
        { status: 404 },
      );
    }

    // Try to enroll the student
    const result = await AcademicRepository.createEnrollment(
      userId,
      classData.id,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Get student's email to update invitation status
    const student = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (student?.email) {
      // Update invitation status if they were invited
      await AcademicRepository.updateInvitationStatus(
        classData.id,
        student.email,
        "accepted",
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined class",
      class: {
        id: classData.id,
        name: classData.name,
        code: classData.code,
      },
    });
  } catch (error) {
    console.error("Join Class API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
