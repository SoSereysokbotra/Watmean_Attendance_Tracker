import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  date,
  time,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";
import { sessions } from "./sessions.schema"; // NEW: Import sessions for foreign key reference

/**
 * Classes table - stores class information
 */
export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    description: text("description"),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    room: text("room"),
    semester: text("semester").notNull(), // e.g., "Fall 2024"
    schedule: text("schedule"), // e.g., "Mon, Wed 10:00-11:30"
    classCode: text("class_code").unique(), // Unique code for students to join
    lat: text("lat"), // Storing as text for simplicity, or decimal
    lng: text("lng"),
    radius: integer("radius").default(50),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    teacherIdIdx: index("idx_classes_teacher_id").on(table.teacherId),
    codeIdx: index("idx_classes_code").on(table.code),
    semesterIdx: index("idx_classes_semester").on(table.semester),
  }),
);

/**
 * Relations for classes table
 */
export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  attendanceRecords: many(attendanceRecords),
  invitations: many(classInvitations),
}));

/**
 * Enrollments table - links students to classes
 */
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    studentIdIdx: index("idx_enrollments_student_id").on(table.studentId),
    classIdIdx: index("idx_enrollments_class_id").on(table.classId),
    // Composite unique constraint to prevent duplicate enrollments
    uniqueEnrollment: index("unique_enrollment_idx").on(
      table.studentId,
      table.classId,
    ),
  }),
);

/**
 * Relations for enrollments table
 */
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
}));

/**
 * Attendance Records table - stores daily attendance for students in classes
 */
export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }), // NEW: Link attendance to specific session
    date: date("date").notNull(),
    status: text("status", {
      enum: ["present", "absent", "late", "excused"],
    }).notNull(),
    checkInTime: time("check_in_time"),
    remarks: text("remarks"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    studentIdIdx: index("idx_attendance_student_id").on(table.studentId),
    classIdIdx: index("idx_attendance_class_id").on(table.classId),
    sessionIdIdx: index("idx_attendance_session_id").on(table.sessionId), // NEW: Index for session lookups
    dateIdx: index("idx_attendance_date").on(table.date),
    statusIdx: index("idx_attendance_status").on(table.status),
  }),
);

/**
 * Relations for attendance_records table
 */
export const attendanceRecordsRelations = relations(
  attendanceRecords,
  ({ one }) => ({
    student: one(users, {
      fields: [attendanceRecords.studentId],
      references: [users.id],
    }),
    class: one(classes, {
      fields: [attendanceRecords.classId],
      references: [classes.id],
    }),
    session: one(sessions, {
      fields: [attendanceRecords.sessionId],
      references: [sessions.id],
    }), // NEW: Link to session
  }),
);

/**
 * Class Invitations table - tracks email invitations to join a class
 */
export const classInvitations = pgTable(
  "class_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    status: text("status", {
      enum: ["pending", "accepted", "expired"],
    })
      .notNull()
      .default("pending"),
    invitedAt: timestamp("invited_at", { withTimezone: true }).defaultNow(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    invitedBy: uuid("invited_by").references(() => users.id),
  },
  (table) => ({
    classIdIdx: index("idx_invitations_class").on(table.classId),
    emailIdx: index("idx_invitations_email").on(table.email),
    statusIdx: index("idx_invitations_status").on(table.status),
  }),
);

/**
 * Relations for class_invitations table
 */
export const classInvitationsRelations = relations(
  classInvitations,
  ({ one }) => ({
    class: one(classes, {
      fields: [classInvitations.classId],
      references: [classes.id],
    }),
    inviter: one(users, {
      fields: [classInvitations.invitedBy],
      references: [users.id],
    }),
  }),
);
