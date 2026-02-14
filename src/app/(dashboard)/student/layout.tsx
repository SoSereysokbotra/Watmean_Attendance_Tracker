"use client";

import { useState, useEffect, Suspense } from "react";
import StudentSidebar from "../../../components/Sidebar/StudentSidebar";
import { Search, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function StudentSearchInput() {
  const router = useRouter();
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();

  return (
    <div className="relative hidden sm:block">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <input
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("search") || ""}
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
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:block lg:h-screen lg:sticky lg:top-0`}
      >
        <StudentSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <header className="h-18 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-lg capitalize text-foreground">
              {getPageTitle(pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="w-64 h-10" />}>
              <StudentSearchInput />
            </Suspense>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
