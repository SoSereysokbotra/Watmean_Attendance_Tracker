"use client";

import { useEffect, useState, Suspense } from "react";
import { Users, Mail, UserCheck, ArrowRight, Plus, Search } from "lucide-react";
import Link from "next/link";

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingInvites: 0,
    activeTeachers: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, invitesRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/invitations"),
        ]);
        const usersData = await usersRes.json();
        const invitesData = await invitesRes.json();

        if (usersData.success && invitesData.success) {
          const users = usersData.data;
          const invites = invitesData.data;

          setStats({
            totalUsers: users.length,
            pendingInvites: invites.filter((i: any) => i.status === "pending")
              .length,
            activeTeachers: users.filter(
              (u: any) => u.role === "teacher" && u.status === "active",
            ).length,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch stats: ${error}`);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-8 space-y-8 transition-all duration-500 ease-in-out animate-in fade-in">
      {/* Header Section: Slides in from Top-Left */}
      <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-700 fill-mode-both">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* Search Bar: Smooth focus transition */}
        <div className="relative max-w-md transition-all duration-300 focus-within:scale-[1.02]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search users, teachers, or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Stats Grid: Staggered entrance via delay */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Users Card */}
        <div
          className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Users
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2 transition-transform duration-500 group-hover:scale-110 origin-left">
                {stats.totalUsers}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300 group-hover:rotate-12">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <span className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded mr-2">
              Active
            </span>
            <span>Registered accounts</span>
          </div>
        </div>

        {/* Pending Invites Card */}
        <div
          className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pending Invites
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2 transition-transform duration-500 group-hover:scale-110 origin-left">
                {stats.pendingInvites}
              </h2>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all duration-300 group-hover:rotate-12">
              <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <span className="text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded mr-2">
              Action Needed
            </span>
            <span>Awaiting acceptance</span>
          </div>
        </div>

        {/* Active Teachers Card */}
        <div
          className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Teachers
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2 transition-transform duration-500 group-hover:scale-110 origin-left">
                {stats.activeTeachers}
              </h2>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <span className="text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded mr-2">
              Staff
            </span>
            <span>Instructors online</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-1 h-fit animate-in slide-in-from-left-4 fade-in duration-700 fill-mode-both"
          style={{ animationDelay: "400ms" }}
        >
          <h3 className="font-semibold text-foreground mb-1">Quick Actions</h3>
          <p className="text-xs text-muted-foreground mb-5">
            Common tasks and management tools.
          </p>

          <div className="space-y-3">
            <Link
              href="/admin/invites"
              className="group flex items-center justify-between w-full p-3 bg-brand-primary text-light rounded-lg text-sm font-medium hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/20 transition-all duration-300 hover:pl-4 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />{" "}
                Invite New Teacher
              </span>
              <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/users"
              className="group flex items-center justify-between w-full p-3 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-300 hover:pl-4 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                Manage Users
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/40 p-6 md:p-8 flex items-center justify-center">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
