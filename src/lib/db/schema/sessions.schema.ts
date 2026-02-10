import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";
import { classes } from "./academic.schema";

/**
 * Sessions table - tracks active attendance sessions
 */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    status: text("status", { enum: ["active", "ended", "cancelled"] })
      .notNull()
      .default("active"),
    lat: text("lat"),
    lng: text("lng"),
    radius: integer("radius").default(50),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    classIdIdx: index("idx_sessions_class_id").on(table.classId),
    teacherIdIdx: index("idx_sessions_teacher_id").on(table.teacherId),
    statusIdx: index("idx_sessions_status").on(table.status),
  }),
);

/**
 * Relations for sessions table
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
  class: one(classes, {
    fields: [sessions.classId],
    references: [classes.id],
  }),
  teacher: one(users, {
    fields: [sessions.teacherId],
    references: [users.id],
  }),
}));
