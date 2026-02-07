/**
 * Student-related type definitions
 */

export type StudentStatus = "present" | "absent" | "late";

export interface Student {
  id: string;
  name: string;
  avatar: string | null;
  checkInTime: string | null;
  distance: string | null;
  status: StudentStatus;
}

export interface CheckInData {
  studentId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  verified: boolean;
}

export interface StudentFilter {
  status?: StudentStatus | "All";
  searchTerm?: string;
}
