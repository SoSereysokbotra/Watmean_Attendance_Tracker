/**
 * Student list tab component
 * Displays filterable table of students with attendance actions
 */

import { useState } from "react";
import {
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Trash,
  FileText,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Student, StudentStatus } from "@/types";

interface StudentListTabProps {
  students: Student[];
  onToggleStatus: (id: string, status: StudentStatus) => void;
  onRemoveStudent: (id: string) => void;
}

export function StudentListTab({
  students,
  onToggleStatus,
  onRemoveStudent,
}: StudentListTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "All" | "Present" | "Absent" | "Excused"
  >("All");

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "All"
        ? true
        : s.status.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search students..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter size={16} className="mr-2" /> Filter: {filterType}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="end">
            <div className="space-y-1">
              <Button
                variant={filterType === "All" ? "secondary" : "ghost"}
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => setFilterType("All")}
              >
                All Students
              </Button>
              <Button
                variant={filterType === "Present" ? "secondary" : "ghost"}
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => setFilterType("Present")}
              >
                Present Only
              </Button>
              <Button
                variant={filterType === "Absent" ? "secondary" : "ghost"}
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => setFilterType("Absent")}
              >
                Absent Only
              </Button>
              <Button
                variant={filterType === "Excused" ? "secondary" : "ghost"}
                className="w-full justify-start h-8 text-sm font-normal"
                onClick={() => setFilterType("Excused")}
              >
                Excused Only
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                    <img
                      src={
                        student.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
                      }
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {student.name}
                </td>
                <td className="px-6 py-4">
                  {student.status === "present" && (
                    <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md text-xs font-bold">
                      Present
                    </span>
                  )}
                  {student.status === "late" && (
                    <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md text-xs font-bold">
                      Late
                    </span>
                  )}
                  {student.status === "excused" && (
                    <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-xs font-bold">
                      Excused
                    </span>
                  )}
                  {student.status === "absent" && (
                    <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md text-xs font-bold">
                      Absent
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {student.checkInTime || "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="end">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm font-normal"
                          onClick={() => onToggleStatus(student.id, "present")}
                        >
                          <CheckCircle2
                            size={14}
                            className="mr-2 text-green-600"
                          />
                          Mark Present
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm font-normal"
                          onClick={() => onToggleStatus(student.id, "excused")}
                        >
                          <FileText
                            size={14}
                            className="mr-2 text-blue-600"
                          />
                          Mark Excused
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm font-normal"
                          onClick={() => onToggleStatus(student.id, "absent")}
                        >
                          <XCircle size={14} className="mr-2 text-red-600" />
                          Mark Absent
                        </Button>
                        <div className="h-px bg-border my-1" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8 text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => onRemoveStudent(student.id)}
                        >
                          <Trash size={14} className="mr-2" />
                          Remove Student
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
