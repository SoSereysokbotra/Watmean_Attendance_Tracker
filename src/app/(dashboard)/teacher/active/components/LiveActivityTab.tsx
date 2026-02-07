/**
 * Live attendance activity tab component
 * Shows recent student check-ins
 */

import { CheckCircle2 } from "lucide-react";
import { Student } from "@/types";

interface LiveActivityTabProps {
  students: Student[];
}

export function LiveActivityTab({ students }: LiveActivityTabProps) {
  const presentStudents = students.filter((s) => s.status === "present");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-3">
        <h3 className="font-bold text-foreground">Recent Activity</h3>
        {presentStudents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
            <p>No check-ins yet</p>
          </div>
        ) : (
          presentStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                  <img
                    src={
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
                    }
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Checked in at {student.checkInTime || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verified
                </span>
                {student.distance && (
                  <span className="text-xs text-muted-foreground">
                    {student.distance} away
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
