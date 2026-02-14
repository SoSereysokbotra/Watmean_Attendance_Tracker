"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

interface AdminSidebarProps {
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
      } py-2 rounded-lg cursor-pointer mb-5 transition-colors relative group ${
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
  <div className="mb-8">
    {isOpen && (
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 px-3">
        {title}
      </h3>
    )}
    {!isOpen && <div className="h-px bg-border/15 mx-2 mb-3" />}
    {children}
  </div>
);

export default function AdminSidebar({
  isOpen,
  toggleSidebar,
}: AdminSidebarProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    id: string;
    name: string;
    initials: string;
    role: string;
    profileImage?: string;
  } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          const fullName = data.profile.fullName || "Admin";
          const initials = fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          setUser({
            id: data.profile.id,
            name: fullName,
            initials: initials,
            role: "Administrator",
            profileImage: data.profile.profileImage,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data for sidebar", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const adminName = user?.name || "Loading...";
  const adminInitials = user?.initials || "...";
  const role = user?.role || "Administrator";
  const profileImage = user?.profileImage;

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20 lg:w-20"
      } bg-brand-dark dark:bg-background h-screen lg:h-full border-r border-border flex flex-col z-40 overflow-y-auto transition-all duration-300 ease-in-out`}
    >
      {/* Profile Area */}
      <div
        className={`flex items-center ${
          isOpen ? "px-6 py-4 gap-3" : "justify-center py-4"
        } border-b border-border sticky top-0 bg-brand-dark/80 dark:bg-background/80 backdrop-blur-md z-10`}
      >
        <div className="relative shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={adminName}
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-blue-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
              {adminInitials}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
        </div>

        {isOpen && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-light text-sm truncate">
              {adminName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{role}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        <SidebarSection title="Menu" isOpen={isOpen}>
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/admin/dashboard"
            isOpen={isOpen}
            exact
          />
          <SidebarItem
            icon={Users}
            label="User Directory"
            href="/admin/users"
            isOpen={isOpen}
          />
          <SidebarItem
            icon={UserPlus}
            label="Invite Teacher"
            href="/admin/invites"
            isOpen={isOpen}
          />
        </SidebarSection>

        <SidebarSection title="System" isOpen={isOpen}>
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/admin/settings"
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
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center ${
            isOpen ? "gap-2 justify-start" : "justify-center"
          } text-xs font-medium text-muted-foreground hover:text-brand-primary transition-colors w-full ${
            isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <LogOut size={isOpen ? 14 : 18} />
          {isOpen && (
            <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
