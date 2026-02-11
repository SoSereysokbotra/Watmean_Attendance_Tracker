import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { AcademicRepository } from "@/lib/db/repositories/academic.repository";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { classes } from "@/lib/db/schema";
import { generateRandomClassCode } from "@/lib/utils/class-code.util";
import { parseStudentEmailCSV } from "@/lib/utils/csv-parser.util";
import { EmailService } from "@/lib/auth/services/email.service";

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

    const teacherClasses = await AcademicRepository.getTeacherClasses(userId);

    return NextResponse.json({
      classes: teacherClasses,
    });
  } catch (error) {
    console.error("Teacher Classes API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
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

    if (role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      code,
      description,
      room,
      semester,
      schedule,
      studentEmails,
      csvContent,
      sendInvitations,
    } = body;

    // Validate required fields
    if (!name || !semester) {
      return NextResponse.json(
        { error: "Missing required fields: name, semester" },
        { status: 400 },
      );
    }

    // Generate unique class code
    let classCode = generateRandomClassCode();
    let isUnique = false;
    let attempts = 0;

    // Ensure uniqueness (try up to 10 times)
    while (!isUnique && attempts < 10) {
      const existing = await AcademicRepository.getClassByCode(classCode);
      if (!existing) {
        isUnique = true;
      } else {
        classCode = generateRandomClassCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: "Failed to generate unique class code" },
        { status: 500 },
      );
    }

    // Create class
    const newClass = await db
      .insert(classes)
      .values({
        name,
        code: code || classCode, // Use teacher's code or auto-generated classCode
        description: description || null,
        teacherId: userId,
        room: room || null,
        semester,
        schedule: schedule || null,
        classCode,
        lat: body.lat ? String(body.lat) : null,
        lng: body.lng ? String(body.lng) : null,
        radius: body.radius ? Number(body.radius) : 50,
      })
      .returning();

    const createdClass = newClass[0];

    // Handle email invitations
    if (sendInvitations && (studentEmails || csvContent)) {
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

      if (emailList.length > 0) {
        // Create invitation records
        await AcademicRepository.createBulkInvitations(
          createdClass.id,
          emailList,
          userId,
        );

        // Send invitation emails
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const joinUrl = `${baseUrl}/join/${classCode}`;

        // Get teacher name
        const teacher = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, userId),
        });

        const invitationPromises = emailList.map((email) =>
          EmailService.sendClassInvitationEmail(email, {
            className: name,
            classCode: code || classCode, // Subject Code (e.g., "CS101")
            joinCode: classCode, // System Code (e.g., "X7K-9P2")
            teacherName: teacher?.fullName || "Your Teacher",
            schedule: schedule || undefined,
            room: room || undefined,
            joinUrl,
          }).catch((err) => {
            console.error(`Failed to send email to ${email}:`, err);
            return null;
          }),
        );

        await Promise.allSettled(invitationPromises);
      }
    }

    return NextResponse.json({
      success: true,
      class: {
        ...createdClass,
        classCode,
      },
    });
  } catch (error) {
    console.error("Create Class API Error:", error);
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

    let payload;
    try {
      payload = TokenUtil.verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("id");

    if (!classId) {
      return NextResponse.json({ error: "Class ID required" }, { status: 400 });
    }

    // Verify ownership
    // We can use getClassDetails or a simpler query. Re-using repository.
    const classDetails = await AcademicRepository.getClassDetails(classId);

    if (!classDetails) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    if (classDetails.teacherId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await AcademicRepository.deleteClass(classId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Class API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
