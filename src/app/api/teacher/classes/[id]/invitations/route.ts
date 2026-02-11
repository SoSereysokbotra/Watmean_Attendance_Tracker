import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { EmailService } from "@/lib/auth/services/email.service";
import { parseStudentEmailCSV } from "@/lib/utils/csv-parser.util";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    if (payload.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: classId } = await params;

    // Get invitations for this class
    const invitations = await AcademicRepository.getClassInvitations(classId);

    return NextResponse.json({
      invitations,
    });
  } catch (error) {
    console.error("Get Invitations API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    if (payload.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: classId } = await params;
    const body = await request.json();
    const { studentEmails, csvContent } = body;

    let emailList: string[] = [];

    // Parse emails from CSV if provided
    if (csvContent) {
      const parseResult = parseStudentEmailCSV(csvContent);
      emailList = parseResult.valid;
    }

    // Add manual emails
    if (studentEmails && Array.isArray(studentEmails)) {
      emailList = [...emailList, ...studentEmails];
    }

    // Remove duplicates
    emailList = Array.from(new Set(emailList.map((e) => e.toLowerCase())));

    if (emailList.length === 0) {
      return NextResponse.json(
        { error: "No valid emails provided" },
        { status: 400 },
      );
    }

    // Get class details
    const classData = await db.query.classes.findFirst({
      where: (classes, { eq }) => eq(classes.id, classId),
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Create invitation records
    const created = await AcademicRepository.createBulkInvitations(
      classId,
      emailList,
      userId,
    );

    // Send invitation emails
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const joinUrl = `${baseUrl}/join/${classData.classCode}`;

    // Get teacher name
    const teacher = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    const invitationPromises = emailList.map((email) =>
      EmailService.sendClassInvitationEmail(email, {
        className: classData.name,
        classCode: classData.code, // Use teacher's subject code (e.g., "CS101") instead of auto-generated classCode
        teacherName: teacher?.fullName || "Your Teacher",
        schedule: classData.schedule || undefined,
        room: classData.room || undefined,
        joinUrl,
      }).catch((err) => {
        console.error(`Failed to send email to ${email}:`, err);
        return null;
      }),
    );

    await Promise.allSettled(invitationPromises);

    return NextResponse.json({
      success: true,
      invitationsSent: emailList.length,
      created: created.length,
    });
  } catch (error) {
    console.error("Send Invitations API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
