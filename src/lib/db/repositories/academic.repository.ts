import { eq, and, desc, sql, gt, or, ne } from "drizzle-orm";
import { db } from "../index";
import {
  classes,
  enrollments,
  attendanceRecords,
  users,
  classInvitations,
  sessions,
} from "../schema";

export class AcademicRepository {
  /**
   * Get attendance history for a student
   */
  static async getAttendanceHistory(userId: string) {
    const records = await db
      .select({
        id: attendanceRecords.id,
        className: classes.name,
        date: attendanceRecords.date,
        status: attendanceRecords.status,
        checkInTime: attendanceRecords.checkInTime,
        room: classes.room,
      })
      .from(attendanceRecords)
      .innerJoin(classes, eq(attendanceRecords.classId, classes.id))
      .where(eq(attendanceRecords.studentId, userId))
      .orderBy(desc(attendanceRecords.date));

    return records;
  }

  /**
   * Create attendance record for a student check-in
   */
  static async createAttendanceRecord(
    userId: string,
    classId: string,
    status: string,
    remarks?: string,
    sessionId?: string,
  ) {
    const today = new Date().toISOString().split("T")[0];

    // Check for duplicate check-in today
    const existing = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.studentId, userId),
          eq(attendanceRecords.classId, classId),
          eq(attendanceRecords.date, today),
        ),
      )
      .then((res) => res[0]);

    if (existing) {
      throw new Error("Already checked in for this class today");
    }

    // Create attendance record
    const now = new Date();
    const record = await db
      .insert(attendanceRecords)
      .values({
        studentId: userId,
        classId,
        sessionId: sessionId || null,
        date: today,
        status: status as "present" | "absent" | "late" | "excused",
        checkInTime: now.toTimeString().split(" ")[0], // HH:MM:SS format
        remarks: remarks || null,
      })
      .returning();

    return record[0];
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

    // Get today's attendance records for this student
    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = await db
      .select({
        classId: attendanceRecords.classId,
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.studentId, studentId),
          eq(attendanceRecords.date, today),
        ),
      );

    // Map to simple check-in status map
    const attendanceMap = new Map();
    todayAttendance.forEach((record) => {
      attendanceMap.set(record.classId, record.status);
    });

    // For the prototype, we add mock progress and colorTheme, plus actual check-in status
    return studentClasses.map((cls) => {
      const status = attendanceMap.get(cls.id);
      return {
        ...cls,
        progress: Math.floor(Math.random() * 101), // Mock progress 0-100
        colorTheme: "blue", // Default color theme
        isCheckedIn: !!status, // True if any record exists for today
        attendanceStatus: status || null,
      };
    });
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

    if (studentClasses.length === 0) return null;

    const nextClass = studentClasses[0];

    // Check if student has checked in for this class today
    const today = new Date().toISOString().split("T")[0];
    const existing = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.studentId, studentId),
          eq(attendanceRecords.classId, nextClass.id),
          eq(attendanceRecords.date, today),
          or(
            eq(attendanceRecords.status, "present"),
            eq(attendanceRecords.status, "late"),
          ),
        ),
      )
      .then((res) => res[0]);

    return {
      ...nextClass,
      isCheckedIn: !!existing,
    };
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
      return { percentage: 100, late: 0, absent: 0, excused: 0 };
    }

    const present = records.filter((r) => r.status === "present").length;
    const late = records.filter((r) => r.status === "late").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const excused = records.filter((r) => r.status === "excused").length;
    // Attendance rate counts both present and late as attended
    const attended = present + late;

    return {
      percentage: Math.round((attended / total) * 100),
      late,
      absent,
      excused,
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
        status: attendance ? attendance.status : "upcoming", // Changed from "pending" to "upcoming"
        isFinished: !!attendance,
      };
    });
  }

  static async getTeacherClasses(teacherId: string) {
    // We need to count students per class. This requires a group by.
    const classRows = await db
      .select({
        // Class Fields
        id: classes.id,
        name: classes.name,
        code: classes.code,
        room: classes.room,
        semester: classes.semester,
        schedule: classes.schedule,
        classCode: classes.classCode,
        lat: classes.lat,
        lng: classes.lng,
        radius: classes.radius,

        // Session Fields
        activeSessionRoom: sql<string>`MAX(${sessions.room})`,
        activeSessionStatus: sql<string>`MAX(${sessions.status})`,

        // Count
        studentCount: sql<number>`count(distinct ${users.id})`.mapWith(Number),
      })
      .from(classes)
      .leftJoin(
        sessions,
        and(eq(sessions.classId, classes.id), eq(sessions.status, "active")),
      )
      .leftJoin(enrollments, eq(enrollments.classId, classes.id))
      .leftJoin(
        users,
        and(eq(enrollments.studentId, users.id), ne(users.status, "deleted")),
      )
      .where(eq(classes.teacherId, teacherId))
      .groupBy(classes.id);

    // Map results
    return classRows.map((row) => ({
      ...row,
      // Override room only if active session has a room set
      room: row.activeSessionRoom || row.room,
      // Add status based on active session
      status: row.activeSessionStatus ? "active" : "upcoming",

      activeStudents: row.studentCount, // Using enrolled count as active count for now
      totalStudents: row.studentCount,
      progress: 0, // Todo: Calculate actual progress based on sessions held vs total
      nextSession: row.schedule ? row.schedule.split(",")[0] : "No schedule", // Simple parse
      colorTheme: "blue",
    }));
  }

  /**
   * Get dashboard stats for teacher
   */
  static async getTeacherStats(teacherId: string) {
    // 1. Total Classes
    const classesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .where(eq(classes.teacherId, teacherId))
      .then((res) => Number(res[0].count));

    // 2. Active Students (Unique students enrolled in teacher's classes)
    const studentsCount = await db
      .select({ count: sql<number>`count(distinct ${enrollments.studentId})` })
      .from(classes)
      .innerJoin(enrollments, eq(classes.id, enrollments.classId))
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(and(eq(classes.teacherId, teacherId), ne(users.status, "deleted")))
      .then((res) => Number(res[0].count));

    // 3. Average Attendance
    // Logic: (Total Present / Total Records) * 100
    // Get all class IDs for teacher first
    const teacherClasses = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    let avgAttendance = 0;

    if (teacherClasses.length > 0) {
      const classIds = teacherClasses.map((c) => c.id);

      // Count total records for these classes
      const totalRecordsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendanceRecords)
        .where(sql`${attendanceRecords.classId} IN ${classIds}`);

      const totalRecords = Number(totalRecordsResult[0].count);

      // Count present records
      const presentRecordsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendanceRecords)
        .where(
          and(
            sql`${attendanceRecords.classId} IN ${classIds}`,
            sql`${attendanceRecords.status} IN ('present', 'late')`,
          ),
        );

      const presentRecords = Number(presentRecordsResult[0].count);

      if (totalRecords > 0) {
        avgAttendance = Math.round((presentRecords / totalRecords) * 100);
      }
    }

    // 4. At Risk Students - Calculate students with attendance < 75%
    let atRiskCount = 0;

    if (studentsCount > 0 && teacherClasses.length > 0) {
      const classIds = teacherClasses.map((c) => c.id);

      // Get all unique students for this teacher
      const teacherStudents = await db
        .selectDistinct({ studentId: enrollments.studentId })
        .from(enrollments)
        .where(sql`${enrollments.classId} IN ${classIds}`);

      // For each student, calculate attendance and check if at-risk (< 75%)
      for (const enrollment of teacherStudents) {
        const studentRecords = await db
          .select({
            status: attendanceRecords.status,
          })
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.studentId, enrollment.studentId),
              sql`${attendanceRecords.classId} IN ${classIds}`,
            ),
          );

        const total = studentRecords.length;
        if (total === 0) continue; // Skip students with no attendance records

        const attendedCount = studentRecords.filter(
          (r) => r.status === "present" || r.status === "late",
        ).length;

        const attendancePercentage = Math.round((attendedCount / total) * 100);

        if (attendancePercentage < 75) {
          atRiskCount++;
        }
      }
    }

    return {
      totalClasses: classesCount,
      activeStudents: studentsCount,
      averageAttendance: avgAttendance, // Renaming to match frontend expectation
      atRiskCount,
    };
  }

  /**
   * Get recent activity (ended sessions)
   */
  static async getRecentSessions(teacherId: string, limit: number = 5) {
    const recentSessions = await db
      .select({
        id: sessions.id,
        title: classes.name,
        endTime: sessions.endTime,
        status: sessions.status,
        room: sessions.room,
        classId: classes.id,
      })
      .from(sessions)
      .innerJoin(classes, eq(sessions.classId, classes.id))
      .where(
        and(
          eq(sessions.teacherId, teacherId),
          or(eq(sessions.status, "ended"), eq(sessions.status, "active")),
        ),
      )
      .orderBy(desc(sessions.endTime))
      .limit(limit);

    // For each session, get attendance count
    const result = [];
    for (const session of recentSessions) {
      // Count present
      const present = await db
        .select({ count: sql<number>`count(*)` })
        .from(attendanceRecords)
        // Assuming attendance records date matches session date roughly,
        // but actually attendance records don't link to session ID directly in schema, only class and date.
        // This is a schema limitation. We'll link by classId and Date = session.endTime date.
        .where(
          and(
            eq(attendanceRecords.classId, session.classId),
            // sql`date(${attendanceRecords.date}) = date(${session.endTime})` // simplified date match
            eq(
              attendanceRecords.date,
              session.endTime.toISOString().split("T")[0],
            ),
          ),
        )
        .then((res) => Number(res[0].count));

      // Count total enrolled (approximate expected)
      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(eq(enrollments.classId, session.classId))
        .then((res) => Number(res[0].count));

      result.push({
        id: session.id,
        title: session.title,
        time: session.endTime.toISOString(), // Formatting needed on frontend
        status: session.status,
        attendance: present,
        total: total,
        room: session.room,
      });
    }

    return result;
  }

  /**
   * Delete a class
   */
  static async deleteClass(classId: string) {
    return await db.delete(classes).where(eq(classes.id, classId));
  }

  /**
   * Get class details with enrolled students and stats
   */
  static async getClassDetails(classId: string) {
    const classData = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId))
      .then((res) => res[0]);

    if (!classData) return null;

    // Get next session
    const nextSession = await db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.classId, classId), gt(sessions.startTime, new Date())),
      )
      .orderBy(sessions.startTime)
      .limit(1)
      .then((res) => res[0]);

    // Get all enrollments with student details
    const enrolledStudents = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        studentId: users.studentId, // Ensure unique user ID if needed
        avatar: users.fullName,
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(
        and(eq(enrollments.classId, classId), ne(users.status, "deleted")),
      );

    // Calculate stats for each student
    const studentWithStats = await Promise.all(
      enrolledStudents.map(async (student) => {
        // Fetch attendance records for this student in this class
        const records = await db
          .select()
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.studentId, student.id),
              eq(attendanceRecords.classId, classId),
            ),
          )
          .orderBy(desc(attendanceRecords.date));

        const total = records.length;
        const present = records.filter(
          (r) => r.status === "present" || r.status === "late",
        ).length; // Treating late as present-ish for simple calc, or stricter
        const attendanceRate =
          total > 0 ? Math.round((present / total) * 100) : 100; // Default 100 if no sessions? Or 0? Let's say 100 start.

        const lastRecord = records[0];
        const status = lastRecord ? lastRecord.status : "excused"; // Default status if no record

        return {
          id: student.id,
          name: student.fullName,
          email: student.email,
          avatar: student.fullName.charAt(0).toUpperCase(),
          attendance: attendanceRate,
          grade: "N/A", // Mock
          gradeScore: 0, // Mock
          status: status as "present" | "absent" | "late" | "excused",
        };
      }),
    );

    // Calculate Average Attendance for Class
    const totalAttendanceSum = studentWithStats.reduce(
      (sum, s) => sum + s.attendance,
      0,
    );
    const avgAttendance =
      studentWithStats.length > 0
        ? Math.round(totalAttendanceSum / studentWithStats.length)
        : 0;

    return {
      ...classData,
      nextSession: nextSession ? nextSession.startTime : null,
      totalStudents: studentWithStats.length,
      avgAttendance: avgAttendance,
      avgGrade: 0, // Mock
      students: studentWithStats, // Return processed list
    };
  }

  /**
   * Get teacher schedule
   */
  static async getTeacherSchedule(teacherId: string) {
    // Fetch classes with full details including createdAt
    const teacherClassesData = await db
      .select()
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    // Generate schedule events for the next 4 weeks based on class schedule string
    const events: any[] = [];

    // Helper to normalize day checking
    const dayMap = [
      { short: "Sun", full: "Sunday", dayIndex: 0 },
      { short: "Mon", full: "Monday", dayIndex: 1 },
      { short: "Tue", full: "Tuesday", dayIndex: 2 },
      { short: "Wed", full: "Wednesday", dayIndex: 3 },
      { short: "Thu", full: "Thursday", dayIndex: 4 },
      { short: "Fri", full: "Friday", dayIndex: 5 },
      { short: "Sat", full: "Saturday", dayIndex: 6 },
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeRangeRegex =
      /(\d{1,2}(?::\d{2})?)\s*(?:AM|PM|am|pm)?\s*-\s*(\d{1,2}(?::\d{2})?)\s*(?:AM|PM|am|pm)?/i;

    teacherClassesData.forEach((cls) => {
      if (!cls.schedule) return;
      const scheduleLower = cls.schedule.toLowerCase();

      // Get the class creation date (start generating schedules from this date)
      const classCreatedAt = cls.createdAt ? new Date(cls.createdAt) : today;
      classCreatedAt.setHours(0, 0, 0, 0); // Reset to start of day

      // Check for time range in the string ONCE per class
      const timeMatch = cls.schedule.match(timeRangeRegex);
      let startHours = 9,
        startMinutes = 0;
      let endHours = 10,
        endMinutes = 30;

      if (timeMatch) {
        // Naive parse of "10:00" or "10"
        const [startStr, endStr] = [timeMatch[1], timeMatch[2]];

        // Helper to safely split time string
        const parseTimeString = (t: string) => {
          if (t.includes(":")) {
            return t.split(":").map(Number);
          }
          return [Number(t), 0];
        };

        const [sh, sm] = parseTimeString(startStr);
        const [eh, em] = parseTimeString(endStr);

        startHours = sh;
        startMinutes = sm;
        endHours = eh;
        endMinutes = em;

        // adjustment for PM if "PM" exists in string and hours < 12?
        // Very rough heuristic: if end time < start time, add 12 to end time (e.g. 10 - 2)
        // Or if 'pm' is in string.
        if (scheduleLower.includes("pm")) {
          if (endHours < 12) endHours += 12;
          // If start is also small and 'pm' covers it (e.g. 2-4 pm), add to start too
          // if start < 12 and (end - start) < 0 ... wait.
          // Let's leave as is - 24h format preferred or simple inputs.
          if (startHours < 12 && startHours < endHours - 6) {
            // e.g. 1:00 - 2:00 PM -> 13:00 - 14:00
            startHours += 12;
          }
        }
      }

      // Determine the start date for schedule generation
      // Use whichever is later: today or the class creation date
      const scheduleStartDate = new Date(
        Math.max(today.getTime(), classCreatedAt.getTime()),
      );
      scheduleStartDate.setHours(0, 0, 0, 0);

      // Generate events for the next 4 weeks (28 days) from the start date
      for (let i = 0; i < 28; i++) {
        const date = new Date(scheduleStartDate);
        date.setDate(scheduleStartDate.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const dayIndex = date.getDay();
        const dayInfo = dayMap.find((d) => d.dayIndex === dayIndex);

        if (
          dayInfo &&
          (scheduleLower.includes(dayInfo.short.toLowerCase()) ||
            scheduleLower.includes(dayInfo.full.toLowerCase()))
        ) {
          const startTime = new Date(date);
          startTime.setHours(startHours, startMinutes, 0, 0);

          const endTime = new Date(date);
          endTime.setHours(endHours, endMinutes, 0, 0);

          events.push({
            id: `${cls.id}-${date.toISOString()}`,
            title: cls.name,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            room: cls.room,
            type: "Lecture",
            classId: cls.id,
          });
        }
      }
    });

    return events;
  }

  /**
   * Get attendance reports/stats for a teacher
   */
  static async getAttendanceReport(teacherId: string) {
    // Get all stats including calculated at-risk students
    const stats = await this.getTeacherStats(teacherId);

    // Return report with actual calculated values (not mocked)
    return {
      totalClasses: stats.totalClasses,
      averageAttendance: stats.averageAttendance,
      totalStudents: stats.activeStudents,
      lowAttendanceStudents: stats.atRiskCount, // Now uses actual calculation from getTeacherStats
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
   * Get attendance trend (daily average) for the last N days
   */
  static async getAttendanceTrend(teacherId: string, days: number = 7) {
    // 1. Get class IDs for this teacher
    const teacherClasses = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    if (teacherClasses.length === 0) return [];

    const classIds = teacherClasses.map((c) => c.id);

    // 2. Get attendance records for these classes within range
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const records = await db
      .select({
        date: attendanceRecords.date,
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .where(
        and(
          sql`${attendanceRecords.classId} IN ${classIds}`,
          sql`${attendanceRecords.date} >= ${startDateStr}`,
        ),
      )
      .orderBy(attendanceRecords.date);

    // 3. Group by date and fill missing days
    const groupedByDate: Record<string, { present: number; total: number }> =
      {};

    // Initialize all days in the range with 0
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      groupedByDate[dStr] = { present: 0, total: 0 };
    }

    records.forEach((r) => {
      // Ensure date exists (it should if logic is correct, but safety check)
      if (!groupedByDate[r.date]) {
        // If record date is outside our initialized range for some reason, ignore or init
        // strict range check above should prevent this, but just in case of timezone weirdness
        return;
      }
      groupedByDate[r.date].total++;
      if (r.status === "present" || r.status === "late") {
        groupedByDate[r.date].present++;
      }
    });

    // 4. Transform to array
    return Object.entries(groupedByDate)
      .map(([date, counts]) => ({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date,
        rate:
          counts.total > 0
            ? Math.round((counts.present / counts.total) * 100)
            : 0,
      }))
      .sort((a, b) => (a.fullDate > b.fullDate ? 1 : -1));
  }

  /**
   * Get performance metrics per class
   */
  static async getClassPerformance(teacherId: string) {
    const teacherClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
      })
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    const performance = await Promise.all(
      teacherClasses.map(async (cls) => {
        // Get records for this class
        const records = await db
          .select({
            status: attendanceRecords.status,
            date: attendanceRecords.date,
            sessionId: attendanceRecords.sessionId,
          })
          .from(attendanceRecords)
          .where(eq(attendanceRecords.classId, cls.id));

        const total = records.length;
        const present = records.filter(
          (r) => r.status === "present" || r.status === "late",
        ).length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        // Count unique sessions (by sessionId if available, else by date as fallback)
        const uniqueSessions = new Set(
          records.map((r) => r.sessionId || r.date),
        ).size;

        return {
          id: cls.id,
          className: cls.name,
          rate,
          totalSessions: uniqueSessions,
        };
      }),
    );

    return performance.sort((a, b) => b.rate - a.rate);
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

  /**
   * Get all students for a teacher with aggregated stats
   */
  static async getTeacherStudents(teacherId: string) {
    // 1. Get all students enrolled in any class taught by this teacher
    const studentsData = await db
      .selectDistinct({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        studentId: users.studentId,
      })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(
        and(eq(classes.teacherId, teacherId), ne(users.status, "deleted")),
      );

    // 2. For each student, calculate stats across ALL classes taught by this teacher
    const studentsWithStats = await Promise.all(
      studentsData.map(async (student) => {
        // Get all class IDs for this teacher
        const teacherClassIds = await db
          .select({ id: classes.id })
          .from(classes)
          .where(eq(classes.teacherId, teacherId))
          .then((res) => res.map((c) => c.id));

        if (teacherClassIds.length === 0) {
          return {
            ...student,
            classesCount: 0,
            attendanceRate: 100,
            status: "Good",
          };
        }

        // Count enrollments for this student in these classes
        const enrolledCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(enrollments)
          .where(
            and(
              eq(enrollments.studentId, student.id),
              sql`${enrollments.classId} IN ${teacherClassIds}`,
            ),
          )
          .then((res) => Number(res[0].count));

        // Calculate attendance stats for this student in these classes
        const records = await db
          .select({ status: attendanceRecords.status })
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.studentId, student.id),
              sql`${attendanceRecords.classId} IN ${teacherClassIds}`,
            ),
          );

        const totalRecords = records.length;
        const present = records.filter(
          (r) => r.status === "present" || r.status === "late",
        ).length;
        const attendanceRate =
          totalRecords > 0 ? Math.round((present / totalRecords) * 100) : 100;

        // Determine status
        let status = "Good";
        if (attendanceRate < 75) status = "At Risk";
        else if (attendanceRate < 85) status = "Warning";

        return {
          id: student.id,
          name: student.fullName,
          avatar: student.fullName.charAt(0).toUpperCase(),
          email: student.email,
          studentId: student.studentId || "N/A",
          classesCount: enrolledCount,
          attendanceRate,
          status,
        };
      }),
    );

    return studentsWithStats;
  }

  /**
   * Get analytics data for a teacher
   */
  static async getTeacherAnalytics(teacherId: string) {
    // 1. Attendance Trends (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    // Get all classes for teacher
    const teacherClasses = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.teacherId, teacherId));

    const classIds = teacherClasses.map((c) => c.id);

    let trendData: any[] = [];
    let classPerformanceData: any[] = [];

    if (classIds.length > 0) {
      // Fetch daily attendance sums
      const dailyStats = await db
        .select({
          date: attendanceRecords.date,
          present: sql<number>`sum(case when ${attendanceRecords.status} in ('present', 'late') then 1 else 0 end)`,
          absent: sql<number>`sum(case when ${attendanceRecords.status} in ('absent') then 1 else 0 end)`,
          total: sql<number>`count(*)`,
        })
        .from(attendanceRecords)
        .where(
          and(
            sql`${attendanceRecords.classId} IN ${classIds}`,
            sql`${attendanceRecords.date} >= ${thirtyDaysAgoStr}`,
          ),
        )
        .groupBy(attendanceRecords.date)
        .orderBy(attendanceRecords.date);

      trendData = dailyStats.map((stat) => ({
        date: stat.date, // string YYYY-MM-DD
        attendance:
          Number(stat.total) > 0
            ? Math.round((Number(stat.present) / Number(stat.total)) * 100)
            : 0,
        presentCount: Number(stat.present),
        absentCount: Number(stat.absent),
      }));

      // 2. Class Performance (Average Attendance per Class)
      const classStats = await db
        .select({
          classId: classes.id,
          className: classes.name,
          present: sql<number>`sum(case when ${attendanceRecords.status} in ('present', 'late') then 1 else 0 end)`,
          total: sql<number>`count(*)`,
        })
        .from(attendanceRecords)
        .innerJoin(classes, eq(attendanceRecords.classId, classes.id))
        .where(eq(classes.teacherId, teacherId))
        .groupBy(classes.id, classes.name);

      classPerformanceData = classStats.map((stat) => ({
        name: stat.className,
        attendance:
          Number(stat.total) > 0
            ? Math.round((Number(stat.present) / Number(stat.total)) * 100)
            : 0,
        totalClasses: Number(stat.total), // Actually total records
      }));
    }

    return {
      trends: trendData,
      classPerformance: classPerformanceData,
    };
  }
}
