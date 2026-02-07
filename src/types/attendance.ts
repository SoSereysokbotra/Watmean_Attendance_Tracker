/**
 * Attendance tracking type definitions
 */

import { StudentStatus } from "./student";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  status: StudentStatus;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface AttendanceHistory {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export type AttendanceFilterType = "All" | "Present" | "Absent" | "Late";

export interface AttendanceStats {
  totalClasses: number;
  attended: number;
  missed: number;
  late: number;
  overallPercentage: number;
}
