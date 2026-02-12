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
  Trash,
  Users,
  Loader2,
  TrendingUp,
  ListFilter,
  Archive,
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
// import { toast } from "sonner"; // Sonner not available

interface Class {
  id: string;
  name: string;
  code: string;
  activeStudents?: number;
  totalStudents?: number;
  progress?: number;
  schedule: string;
  location?: string; // API might return 'room'
  room?: string;
  status?: "active" | "upcoming" | "ended";
  colorTheme?: string;
}

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
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      // toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
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
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "progress") {
        return (b.progress || 0) - (a.progress || 0);
      }
      return 0;
    });

  const deleteClass = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this class? This action cannot be undone.",
      )
    )
      return;

    try {
      const response = await fetch(`/api/teacher/classes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setClasses(classes.filter((c) => c.id !== id));
        // toast.success("Class deleted successfully");
      } else {
        console.error("Failed to delete class");
        // toast.error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      // toast.error("Error deleting class");
    }
  };

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your classes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search classes..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value) {
                  params.set("search", e.target.value);
                } else {
                  params.delete("search");
                }
                router.replace(`?${params.toString()}`);
              }}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl text-sm font-semibold hover:bg-muted hover:border-border/80 transition-all w-full sm:w-auto">
                <Filter size={18} /> Filters
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Sort By
                </div>
                <Button
                  variant={sortBy === "name" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8 font-normal"
                  onClick={() => setSortBy("name")}
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Name (A-Z)
                </Button>
                <Button
                  variant={sortBy === "progress" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8 font-normal"
                  onClick={() => setSortBy("progress")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress (High-Low)
                </Button>

                <div className="h-px bg-border my-1" />

                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Status
                </div>
                <Button
                  variant={filterType === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8 font-normal"
                  onClick={() => setFilterType("all")}
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  All Courses
                </Button>
                <Button
                  variant={filterType === "active" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8 font-normal"
                  onClick={() => setFilterType("active")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Active
                </Button>
                <Button
                  variant={filterType === "completed" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-8 font-normal"
                  onClick={() => setFilterType("completed")}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Completed
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            New Class
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-card rounded-2xl border border-border p-6 hover:border-brand-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(
                    cls.status || "active",
                  )}`}
                >
                  {(cls.status || "Active").charAt(0).toUpperCase() +
                    (cls.status || "active").slice(1)}
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
                <PopoverContent className="w-40 p-1" align="end">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 h-9"
                    onClick={() => deleteClass(cls.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete Class
                  </Button>
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

            <div className="mb-6">
              {/* <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Attendance Rate</span>
                 <span className="font-bold">{cls.attendanceRate}%</span>
              </div> */}
              {/* <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cls.attendanceRate >= 90
                      ? "bg-emerald-500"
                      : cls.attendanceRate >= 80
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                  style={{ width: `${cls.attendanceRate}%` }}
                />
              </div> */}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/teacher/active?classId=${cls.id}`}
                className="flex-1 py-2.5 text-center bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors text-sm"
              >
                Take Attendance
              </Link>
              <Link
                href={`/teacher/classes/${cls.id}`}
                className="flex-1 py-2.5 text-center border border-border rounded-lg font-medium hover:bg-muted transition-colors text-sm"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No classes found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or create a new class
          </p>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Create Class
          </Button>
        </div>
      )}

      {/* Create Class Modal */}
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
