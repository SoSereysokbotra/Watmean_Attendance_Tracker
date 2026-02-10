import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../index";
import {
  classes,
  enrollments,
  attendanceRecords,
  users,
  classInvitations,
} from "../schema";

export class AcademicRepository {
  static getAttendanceHistory(userId: string) {
    throw new Error("Method not implemented.");
  }
  static createAttendanceRecord(
    userId: string,
    classId: string,
    arg2: string,
    arg3: string,
  ) {
    throw new Error("Method not implemented.");
  }
  /**
   * Get all classes for a student with details
   */
  static async getStudentClassesWithDetails(studentId: string) {
    const studentClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
        code: classes.code,
        room: classes.room,
        schedule: classes.schedule,
        prof: users.fullName, // Mapping teacher fullName to 'prof' for frontend
      })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .innerJoin(users, eq(classes.teacherId, users.id))
      .where(eq(enrollments.studentId, studentId));

    // For the prototype, we add mock progress and colorTheme since they're not in the schema yet
    return studentClasses.map((cls) => ({
      ...cls,
      progress: Math.floor(Math.random() * 101), // Mock progress 0-100
      colorTheme: "blue", // Default color theme
    }));
  }
  /**
   * Get all classes for a student
   */
  static async getStudentClasses(studentId: string) {
    const studentClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
        code: classes.code,
        room: classes.room,
        schedule: classes.schedule,
        teacherName: users.fullName,
      })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .innerJoin(users, eq(classes.teacherId, users.id)) // Join to get teacher name
      .where(eq(enrollments.studentId, studentId));

    return studentClasses;
  }

  /**
   * Get next class for a student
   */
  static async getNextClass(studentId: string) {
    // This is a simplified logic. In a real app, we'd parse schedule strings or have a better schedule model.
    // For now, returning the first class for demonstration.
    const studentClasses = await this.getStudentClasses(studentId);
    return studentClasses[0] || null;
  }

  /**
   * Get attendance stats for a student
   */
  static async getStudentAttendanceStats(studentId: string) {
    const records = await db
      .select({
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .where(eq(attendanceRecords.studentId, studentId));

    const total = records.length;
    if (total === 0) {
      return { percentage: 100, late: 0 };
    }

    const present = records.filter((r) => r.status === "present").length;
    const late = records.filter((r) => r.status === "late").length;
    // Assuming late counts as present for percentage, or maybe not. Let's just do pure present/total.
    // Or (present + late) / total.
    const attended = present + late;

    return {
      percentage: Math.round((attended / total) * 100),
      late,
    };
  }

  /**
   * Get today's schedule for a student
   */
  static async getTodaySchedule(studentId: string) {
    // Simplified: fetching all classes and attendance for today
    const today = new Date().toISOString().split("T")[0];

    const allEnrollments = await db
      .select({
        classId: classes.id,
        className: classes.name,
        classCode: classes.code,
        room: classes.room,
        schedule: classes.schedule,
      })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .where(eq(enrollments.studentId, studentId));

    // Get attendance for today to check status
    const todayAttendance = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.studentId, studentId),
          eq(attendanceRecords.date, today),
        ),
      );

    // Map classes to schedule items (mocking time for now as schedule is just a string)
    // In a real app, we would parse `schedule` (e.g., "Mon 10:00") and filter by current day.
    // For this prototype, we'll return all enrolled classes as "today's schedule".

    return allEnrollments.map((cls) => {
      const attendance = todayAttendance.find((a) => a.classId === cls.classId);
      return {
        ...cls,
        status: attendance ? attendance.status : "pending",
        isFinished: !!attendance,
      };
    });
  }
  /**
   * Get all classes for a teacher
   */
  static async getTeacherClasses(teacherId: string) {
    const teacherClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    // Calculate mock progress for now
    return teacherClasses.map((cls) => ({
      ...cls,
      activeStudents: Math.floor(Math.random() * 30), // Mock active count
      totalStudents: 30, // Mock total
      progress: Math.floor(Math.random() * 101),
      nextSession: "Today, 10:00 AM", // Mock next session
      colorTheme: "blue",
    }));
  }

  /**
   * Get class details with enrolled students
   */
  static async getClassDetails(classId: string) {
    const classData = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId))
      .then((res) => res[0]);

    if (!classData) return null;

    const enrolledStudents = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        studentId: users.studentId,
        email: users.email,
        avatar: users.fullName, // Mock avatar
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(eq(enrollments.classId, classId));

    return {
      ...classData,
      students: enrolledStudents,
    };
  }

  /**
   * Get teacher schedule
   */
  static async getTeacherSchedule(teacherId: string) {
    // Similar simplified logic as student schedule
    const teacherClasses = await this.getTeacherClasses(teacherId);

    // Mocking schedule data structure for frontend
    return teacherClasses.map((cls) => ({
      id: cls.id,
      title: cls.name,
      start: new Date().toISOString(), // Mock start time
      end: new Date(Date.now() + 90 * 60000).toISOString(), // Mock end time
      room: cls.room,
      type: "Lecture",
    }));
  }

  /**
   * Get attendance reports/stats for a teacher
   */
  static async getAttendanceReport(teacherId: string) {
    // This would be a complex aggregation in a real app
    // For now returning mock stats
    return {
      totalClasses: 12,
      averageAttendance: 85,
      totalStudents: 150,
      lowAttendanceStudents: 5,
    };
  }

  /**
   * Get class by class code
   */
  static async getClassByCode(classCode: string) {
    const classData = await db
      .select()
      .from(classes)
      .where(eq(classes.classCode, classCode))
      .then((res) => res[0]);

    return classData || null;
  }

  /**
   * Create enrollment for a student in a class
   */
  static async createEnrollment(studentId: string, classId: string) {
    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, studentId),
          eq(enrollments.classId, classId),
        ),
      )
      .then((res) => res[0]);

    if (existing) {
      return { success: false, message: "Already enrolled in this class" };
    }

    // Create enrollment
    const enrollment = await db
      .insert(enrollments)
      .values({
        studentId,
        classId,
      })
      .returning();

    return { success: true, enrollment: enrollment[0] };
  }

  /**
   * Create bulk class invitations
   */
  static async createBulkInvitations(
    classId: string,
    emails: string[],
    invitedBy: string,
  ) {
    const invitations = emails.map((email) => ({
      classId,
      email: email.toLowerCase(),
      invitedBy,
    }));

    try {
      const created = await db
        .insert(classInvitations)
        .values(invitations)
        .onConflictDoNothing()
        .returning();

      return created;
    } catch (error) {
      console.error("Error creating invitations:", error);
      return [];
    }
  }

  /**
   * Update invitation status to accepted
   */
  static async updateInvitationStatus(
    classId: string,
    email: string,
    status: "accepted" | "expired",
  ) {
    await db
      .update(classInvitations)
      .set({
        status,
        acceptedAt: status === "accepted" ? new Date() : null,
      })
      .where(
        and(
          eq(classInvitations.classId, classId),
          eq(classInvitations.email, email.toLowerCase()),
        ),
      );
  }

  /**
   * Get all invitations for a class
   */
  static async getClassInvitations(classId: string) {
    const invitations = await db
      .select()
      .from(classInvitations)
      .where(eq(classInvitations.classId, classId))
      .orderBy(desc(classInvitations.invitedAt));

    return invitations;
  }

  /**
   * Check if email has pending invitation for a class
   */
  static async hasPendingInvitation(classId: string, email: string) {
    const invitation = await db
      .select()
      .from(classInvitations)
      .where(
        and(
          eq(classInvitations.classId, classId),
          eq(classInvitations.email, email.toLowerCase()),
          eq(classInvitations.status, "pending"),
        ),
      )
      .then((res) => res[0]);

    return !!invitation;
  }
}
