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
  PanelLeft,
  PanelLeftClose,
  User,
  Bell,
} from "lucide-react";

interface StudentSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  onClick,
  isOpen,
  exact = false,
}: {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
  isOpen: boolean;
  exact?: boolean;
}) => {
  const pathname = usePathname();

  const isActive = href
    ? exact
      ? pathname === href
      : pathname.startsWith(href)
    : false;

  const content = (
    <div
      className={`flex items-center ${
        isOpen ? "gap-3 px-3" : "justify-center px-2"
      } py-2 rounded-lg cursor-pointer mb-1 transition-colors relative group ${
        isActive
          ? "bg-brand-primary/10 text-brand-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon
        size={20}
        className={!isOpen && isActive ? "text-brand-primary" : ""}
      />
      {isOpen && <span className="text-sm whitespace-nowrap">{label}</span>}

      {!isOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
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
  isOpen,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
}) => (
  <div className="mb-6">
    {isOpen && (
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
    )}
    {!isOpen && <div className="h-px bg-border/15 mx-2 mb-3" />}
    {children}
  </div>
);

export default function StudentSidebar({
  isOpen,
  toggleSidebar,
}: StudentSidebarProps) {
  const studentName = "Alex Johnson";
  const studentId = "STU-2024-789";
  const studentInitials = "AJ";

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-brand-dark dark:bg-background h-screen fixed left-0 top-0 border-r border-border flex flex-col z-40 overflow-y-auto transition-all duration-300 ease-in-out`}
    >
      {/* Profile Area */}
      <div
        className={`flex items-center ${
          isOpen ? "px-6 py-4 gap-3" : "justify-center py-4"
        } border-b border-border sticky top-0 bg-brand-dark/80 dark:bg-background/80 backdrop-blur-md z-10`}
      >
        {/* Profile Avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-purple-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
            {studentInitials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
        </div>

        {isOpen && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white dark:text-foreground text-sm truncate">
              {studentName}
            </h3>
            <p className="text-xs text-white/70 dark:text-muted-foreground truncate">
              {studentId}
            </p>
          </div>
        )}

        {isOpen && (
          <button
            className="ml-2 p-1.5 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
            aria-label="Edit profile"
          >
            <User size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        <SidebarSection title="Menu" isOpen={isOpen}>
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/student"
            isOpen={isOpen}
            exact
          />
          <SidebarItem
            icon={BookOpen}
            label="My Classes"
            href="/student/classes"
            isOpen={isOpen}
          />
          <SidebarItem
            icon={CalendarCheck}
            label="Attendance"
            href="/student/attendance"
            isOpen={isOpen}
          />
          <SidebarItem
            icon={MapPin}
            label="Live Check-in"
            href="/student/checkin"
            isOpen={isOpen}
          />
        </SidebarSection>

        <SidebarSection title="Support" isOpen={isOpen}>
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/student/settings"
            isOpen={isOpen}
          />
        </SidebarSection>
      </div>

      {/* Collapse Sidebar Button */}
      <div className="p-4 border-t border-border/15">
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-full py-2 text-muted-foreground hover:text-brand-primary transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          {isOpen && <span className="ml-2 text-xs">Collapse Sidebar</span>}
        </button>
      </div>

      {/* Footer with Sign Out */}
      <div className="p-4 border-t border-border/15">
        <button
          className={`flex items-center ${
            isOpen ? "gap-2 justify-start" : "justify-center"
          } text-xs font-medium text-muted-foreground hover:text-brand-primary transition-colors w-full`}
        >
          <LogOut size={isOpen ? 14 : 18} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
