"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  CalendarCheck,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  // Check if active (matches exact path or sub-paths for nested routes)
  const isActive = href ? pathname.startsWith(href) : false;

  const content = (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-1 transition-colors ${
        isActive
          ? "bg-orange-50 text-brand-primary font-medium"
          : "text-brand-muted hover:bg-gray-100 hover:text-brand-dark"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
};

const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3 px-3">
      {title}
    </h3>
    {children}
  </div>
);

export default function StudentSidebar() {
  return (
    <aside className="w-64 bg-brand-dark h-screen fixed left-0 top-0 border-r border-brand-border flex flex-col z-40 overflow-y-auto">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-brand-border">
        <div className="flex items-center gap-2 text-brand-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <span className="text-lg">S</span>
          </div>
          StudentApp
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        <SidebarSection title="Menu">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/student"
          />
          <SidebarItem
            icon={BookOpen}
            label="My Classes"
            href="/student/classes"
          />
          <SidebarItem
            icon={CalendarCheck}
            label="Attendance"
            href="/student/attendance"
          />
          <SidebarItem
            icon={MapPin}
            label="Live Check-in"
            href="/student/checkin"
          />
        </SidebarSection>

        <SidebarSection title="Support">
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/student/settings"
          />
          <SidebarItem icon={LifeBuoy} label="Help Center" href="#" />
        </SidebarSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-brand-border">
        <button className="flex items-center gap-2 text-xs font-medium text-brand-muted hover:text-brand-primary transition-colors w-full">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
