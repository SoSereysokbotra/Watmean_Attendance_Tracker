"use client";

import { useState } from "react";
import StudentSidebar from "../../../components/Sidebar/StudentSidebar";
import { Bell, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/classes")) return "My Classes";
    if (path.includes("/attendance")) return "Attendance";
    if (path.includes("/checkin")) return "Live Check-in";
    if (path.includes("/settings")) return "Settings";
    return "Student Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block fixed inset-y-0 left-0 z-50`}
      >
        <StudentSidebar
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
                className="pl-9 pr-4 py-2 bg-muted border-none rounded-full text-sm focus:ring-2 focus:ring-brand-primary/20 focus:bg-card outline-none w-64 transition-colors"
              />
            </div>
            <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold text-xs shadow-md">
              SA
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
