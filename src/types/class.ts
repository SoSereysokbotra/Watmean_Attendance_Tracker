/**
 * Class and session-related type definitions
 */

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  batch: string;
  room: string;
  building?: string;
  professor?: string;
}

export interface Session {
  id: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  location: {
    room: string;
    building?: string;
  };
}

export interface SessionStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
  targetPercentage?: number;
}
