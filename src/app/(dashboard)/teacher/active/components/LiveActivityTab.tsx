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
          <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed border-border px-4">
            <p>No check-ins yet</p>
          </div>
        ) : (
          presentStudents.map((student) => (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between p-3 sm:p-4 bg-card border border-border rounded-xl shadow-sm gap-2"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
                    }
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Checked in at {student.checkInTime || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 size={12} /> Verified
                </span>
                {student.distance && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
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
