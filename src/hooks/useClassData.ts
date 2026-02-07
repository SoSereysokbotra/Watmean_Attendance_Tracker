/**
 * Custom hook for managing class and session data
 */

import { useState, useEffect } from "react";
import { ClassInfo, Session } from "@/types";

export interface ClassData {
  classInfo: ClassInfo | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export function useClassData(classId?: string) {
  const [data, setData] = useState<ClassData>({
    classInfo: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    // For now, using mock data
    const loadClassData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        // Simulated delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mock data
        const mockClassInfo: ClassInfo = {
          id: classId || "CLASS-001",
          name: "Physics 101: Mechanics",
          subject: "Physics",
          batch: "Batch 13",
          room: "Room A-204",
          building: "Block B",
          professor: "Prof. Davis",
        };

        const mockSession: Session = {
          id: "SESSION-001",
          classId: classId || "CLASS-001",
          date: new Date().toISOString().split("T")[0],
          startTime: "08:00",
          endTime: "10:00",
          status: "active",
          location: {
            room: "Room A-204",
            building: "Block B",
          },
        };

        setData({
          classInfo: mockClassInfo,
          session: mockSession,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setData({
          classInfo: null,
          session: null,
          isLoading: false,
          error:
            err instanceof Error ? err.message : "Failed to load class data",
        });
      }
    };

    loadClassData();
  }, [classId]);

  return data;
}
