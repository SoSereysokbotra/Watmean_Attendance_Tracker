"use client";

import { useState } from "react";
import TeacherSidebar from "@/components/Sidebar/TeacherSidebar";
import { Search, Menu } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const router = useRouter();

  const getPageTitle = (path: string) => {
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/classes")) return "My Classes";
    if (path.includes("/active")) return "Attendance";
    if (path.includes("/reports")) return "Reports";
    if (path.includes("/schedule")) return "Schedule";
    if (path.includes("/map")) return "Live Map";
    if (path.includes("/settings")) return "Settings";
    return "Teacher Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block fixed inset-y-0 left-0 z-50`}
      >
        <TeacherSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Header */}
        <header className="h-18 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-lg capitalize text-foreground hidden sm:block">
              {getPageTitle(pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                defaultValue={useSearchParams().get("search") || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value) {
                    params.set("search", e.target.value);
                  } else {
                    params.delete("search");
                  }
                  router.replace(`?${params.toString()}`);
                }}
                className="pl-9 pr-4 py-2 bg-muted border-none rounded-full text-sm focus:ring-2 focus:ring-brand-primary/20 focus:bg-card outline-none w-64 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
