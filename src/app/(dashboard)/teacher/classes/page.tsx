"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Users,
  Loader2,
  TrendingUp,
  ListFilter,
  Archive,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { CreateClassModal } from "@/components/teacher/CreateClassModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// --- Types ---
interface Class {
  id: string;
  name: string;
  code: string;
  activeStudents?: number;
  totalStudents?: number;
  progress?: number;
  schedule: string;
  location?: string;
  room?: string;
  status?: "active" | "upcoming" | "ended";
  colorTheme?: string;
}

interface DeleteClassButtonProps {
  id: string;
  onDeleteSuccess: (id: string) => void;
}

// --- Specialized Components ---
export function DeleteClassButton({
  id,
  onDeleteSuccess,
}: DeleteClassButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/teacher/classes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Class deleted successfully");
        setOpen(false);
        onDeleteSuccess(id);
      } else {
        toast.error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 h-9 px-2"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Class
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the class
            and all associated student data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- Main Page ---
export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "progress">("name");
  const [filterType, setFilterType] = useState<"all" | "active" | "completed">(
    "all",
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/teacher/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Could not load classes");
    } finally {
      setLoading(false);
    }
  };

  const handleOnDeleteSuccess = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredClasses = classes
    .filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "all") return matchesSearch;
      if (filterType === "active")
        return matchesSearch && cls.status === "active";
      if (filterType === "completed")
        return matchesSearch && cls.status === "ended";
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return (b.progress || 0) - (a.progress || 0);
      return 0;
    });

  const getStatusColor = (status: string = "active") => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "upcoming":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "ended":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400";
      default:
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-left-8 duration-700 fill-mode-both"
        style={{ animationDelay: "100ms" }}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your classes
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={18} /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  Sort By
                </p>
                <Button
                  variant={sortBy === "name" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy("name")}
                >
                  <ListFilter className="mr-2 h-4 w-4" /> Name (A-Z)
                </Button>
                <Button
                  variant={sortBy === "progress" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy("progress")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" /> Progress
                </Button>
                <div className="h-px bg-border my-1" />
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </p>
                <Button
                  variant={filterType === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("all")}
                >
                  All Courses
                </Button>
                <Button
                  variant={filterType === "active" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setFilterType("active")}
                >
                  Active
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" /> New Class
          </Button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls, idx) => (
          <div
            key={cls.id}
            className="bg-card rounded-2xl border border-border p-6 hover:border-brand-primary/30 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-brand-primary/20 animate-in slide-in-from-bottom-6 duration-700 fill-mode-both"
            style={{ animationDelay: `${200 + idx * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(cls.status)}`}
                >
                  {cls.status?.toUpperCase() || "ACTIVE"}
                </span>
                <h3 className="font-bold text-xl text-foreground mt-2">
                  {cls.name}
                </h3>
                <p className="text-sm text-muted-foreground">{cls.code}</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1" align="end">
                  <DeleteClassButton
                    id={cls.id}
                    onDeleteSuccess={handleOnDeleteSuccess}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>
                  {cls.activeStudents || 0} / {cls.totalStudents || 0} students
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{cls.schedule || "No schedule"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{cls.room || cls.location || "No location"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href={`/teacher/active?classId=${cls.id}`}
                className="flex-1 py-2 text-center bg-brand-primary text-white rounded-lg font-medium text-sm transition-all hover:bg-brand-primary/90 hover:scale-105 active:scale-95 duration-300"
              >
                Take Attendance
              </Link>
              <Link
                href={`/teacher/classes/${cls.id}`}
                className="flex-1 py-2 text-center border border-border rounded-lg font-medium text-sm transition-all hover:bg-muted hover:border-brand-primary/50 hover:scale-105 active:scale-95 duration-300"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredClasses.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed animate-in fade-in zoom-in-95 duration-500">
          <div className="animate-in bounce duration-700 fill-mode-both">
            <Calendar
              className="mx-auto text-muted-foreground mb-4"
              size={48}
            />
          </div>
          <h3
            className="text-lg font-medium animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: "100ms" }}
          >
            No classes found
          </h3>
          <p
            className="text-muted-foreground mb-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: "200ms" }}
          >
            Try adjusting your filters or create a new class.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            style={{ animationDelay: "300ms" }}
          >
            Create First Class
          </Button>
        </div>
      )}

      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchClasses();
        }}
      />
    </div>
  );
}
