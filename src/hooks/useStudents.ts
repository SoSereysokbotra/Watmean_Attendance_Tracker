/**
 * Custom hook for managing student data and operations
 */

import { useState, useCallback, useMemo } from "react";
import { Student, StudentStatus, StudentFilter } from "@/types";

export function useStudents(initialStudents: Student[] = []) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filter, setFilter] = useState<StudentFilter>({
    status: "All",
    searchTerm: "",
  });

  /**
   * Toggle student attendance status
   */
  const toggleStatus = useCallback((id: string, status: StudentStatus) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student,
      ),
    );
  }, []);

  /**
   * Remove student from the list
   */
  const removeStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }, []);

  /**
   * Update filter criteria
   */
  const updateFilter = useCallback((newFilter: Partial<StudentFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  /**
   * Get filtered students based on current filter
   */
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Filter by status
      const matchesStatus =
        !filter.status || filter.status === "All"
          ? true
          : student.status === filter.status.toLowerCase();

      // Filter by search term
      const matchesSearch = !filter.searchTerm
        ? true
        : student.name.toLowerCase().includes(filter.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [students, filter]);

  /**
   * Add or update student
   */
  const upsertStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const index = prev.findIndex((s) => s.id === student.id);
      if (index >= 0) {
        // Update existing
        const updated = [...prev];
        updated[index] = student;
        return updated;
      } else {
        // Add new
        return [...prev, student];
      }
    });
  }, []);

  return {
    students,
    filteredStudents,
    filter,
    setStudents,
    toggleStatus,
    removeStudent,
    updateFilter,
    upsertStudent,
  };
}
