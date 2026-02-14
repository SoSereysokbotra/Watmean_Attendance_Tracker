"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  ArrowRight,
  Calendar,
  MapPin,
  ListFilter,
  TrendingUp,
  Archive,
  Plus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { JoinClassModal } from "@/components/student/JoinClassModal";

function StudentClassesContent() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/student/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filterType, setFilterType] = useState<"all" | "active" | "completed">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"name" | "progress">("name");

  const filteredClasses = classes
    .filter((cls) => {
      // Search Filter
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.prof.toLowerCase().includes(searchQuery.toLowerCase());

      // Status Filter (Mock logic as data doesn't have status field yet)
      const matchesStatus =
        filterType === "all"
          ? true
          : filterType === "active"
            ? cls.progress < 100
            : cls.progress === 100;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return b.progress - a.progress; // Higher progress first
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-left-8 duration-700 fill-mode-both"
          style={{ animationDelay: "100ms" }}
        >
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              My Courses
            </h2>
            <p className="text-muted-foreground mt-1">
              Current semester progress and enrollment
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto animate-in slide-in-from-right-4 duration-700 fill-mode-both"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative group w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value) {
                    params.set("search", e.target.value);
                  } else {
                    params.delete("search");
                  }
                  router.replace(`?${params.toString()}`);
                }}
                className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none w-full sm:w-64 transition-all"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl text-sm font-semibold hover:bg-muted hover:border-border/80 transition-all hover:scale-105 active:scale-95 duration-300 w-full sm:w-auto">
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
              onClick={() => setShowJoinModal(true)}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto hover:scale-105 active:scale-95 duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Join Class
            </Button>
          </div>
        </div>

        {/* Search and Filters Row */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground animate-in fade-in duration-500">
            No courses found matching your criteria.
          </div>
        ) : (
          filteredClasses.map((cls) => {
            return (
              <div
                key={cls.id}
                className="bg-card rounded-3xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full animate-in slide-in-from-bottom-6 duration-700 fill-mode-both hover:scale-105 origin-bottom"
                style={{
                  animationDelay: `${200 + filteredClasses.indexOf(cls) * 100}ms`,
                }}
              >
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-brand-primary transition-colors">
                  {cls.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">{cls.prof}</p>

                {/* Schedule and Room Section */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar size={16} className="text-amber-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Schedule
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {cls.schedule}
                    </p>
                  </div>
                  <div className="flex-1 bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MapPin size={16} className="text-rose-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Room
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {cls.room}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="mt-4">
                    {cls.isCheckedIn ? (
                      <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <MapPin size={16} />
                        Checked In
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/student/checkin?classId=${cls.id}`)
                        }
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary-foreground hover:bg-brand-primary transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Check In <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onClassJoined={fetchClasses}
      />
    </>
  );
}

export default function StudentClassesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <StudentClassesContent />
    </Suspense>
  );
}
