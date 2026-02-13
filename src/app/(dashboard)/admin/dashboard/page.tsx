"use client";

import { useEffect, useState } from "react";
import { Users, Mail, UserCheck, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // --- STATE (Unchanged) ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingInvites: 0,
    activeTeachers: 0,
  });

  // --- LOGIC (Unchanged) ---
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
        console.error("Failed to fetch stats", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Users Card */}
        <div className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Users
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2">
                {stats.totalUsers}
              </h2>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
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
        <div className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pending Invites
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2">
                {stats.pendingInvites}
              </h2>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
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
        <div className="relative overflow-hidden bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Teachers
              </p>
              <h2 className="text-3xl font-bold text-foreground mt-2">
                {stats.activeTeachers}
              </h2>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
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
        {/* Quick Actions Panel */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-1 h-fit">
          <h3 className="font-semibold text-foreground mb-1">Quick Actions</h3>
          <p className="text-xs text-muted-foreground mb-5">
            Common tasks and management tools.
          </p>

          <div className="space-y-3">
            <Link
              href="/admin/invites"
              className="group flex items-center justify-between w-full p-3 bg-brand-primary text-light rounded-lg text-sm font-medium hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/20 transition-all"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Invite New Teacher
              </span>
              <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/users"
              className="group flex items-center justify-between w-full p-3 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/50 hover:border-muted-foreground/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
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
