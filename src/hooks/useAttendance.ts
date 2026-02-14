/**
 * Custom hook for calculating attendance statistics
 */

import { useMemo } from "react";
import { Student, StudentStatus } from "@/types";

export interface AttendanceStats {
  presentCount: number;
  absentCount: number;
  lateCount: number;
  pendingCount: number;
  totalStudents: number;
  attendancePercentage: number;
}

export function useAttendance(students: Student[]) {
  const stats = useMemo<AttendanceStats>(() => {
    const presentCount = students.filter((s) => s.status === "present").length;
    const absentCount = students.filter((s) => s.status === "absent").length;
    const lateCount = students.filter((s) => s.status === "late").length;
    const pendingCount = students.filter(
      (s) => s.status === "pending" || !s.status,
    ).length;
    const totalStudents = students.length;

    const attendancePercentage =
      totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return {
      presentCount,
      absentCount,
      lateCount,
      pendingCount,
      totalStudents,
      attendancePercentage,
    };
  }, [students]);

  /**
   * Check if attendance meets target percentage
   */
  const meetsTarget = (targetPercentage: number): boolean => {
    return stats.attendancePercentage >= targetPercentage;
  };

  /**
   * Get attendance status color
   */
  const getStatusColor = (): "green" | "yellow" | "red" => {
    if (stats.attendancePercentage >= 90) return "green";
    if (stats.attendancePercentage >= 70) return "yellow";
    return "red";
  };

  return {
    ...stats,
    meetsTarget,
    getStatusColor,
  };
}
