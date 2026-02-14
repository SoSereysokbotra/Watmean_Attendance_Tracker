"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  MoreVertical,
  Search,
  Filter,
  User as UserIcon,
  Shield,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  Trash2,
  UserCog,
  Ban,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  // --- STATE (Unchanged) ---
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");

  // --- EFFECTS (Unchanged) ---
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  // --- LOGIC (Unchanged) ---
  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterUsers() {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }

  async function updateUserRole(userId: string, role: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsers();
        setShowRoleModal(false);
        setSelectedUser(null);
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role", error);
      alert("Failed to update role");
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  }

  function openRoleModal(user: User) {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
    setActiveMenu(null);
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3.5 h-3.5 mr-1" />;
      case "teacher":
        return <Briefcase className="w-3.5 h-3.5 mr-1" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-left-8 duration-700 fill-mode-both"
        style={{ animationDelay: "100ms" }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user access, roles, and account statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      {/* Toolbar Section */}
      <div
        className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center animate-in slide-in-from-right-4 duration-700 fill-mode-both"
        style={{ animationDelay: "200ms" }}
      >
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full md:w-96 pl-10 pr-4 py-2 text-sm text-foreground bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 hover:scale-105 active:scale-95 duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-3">
          {/* Role Filter */}
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10 pointer-events-none" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40 pl-9 bg-card border-border text-muted-foreground focus:ring-primary/20">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-muted-foreground/50 z-10 pointer-events-none" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 pl-8 bg-card border-border text-muted-foreground focus:ring-primary/20">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />{" "}
                    Active
                  </span>
                </SelectItem>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />{" "}
                    Pending
                  </span>
                </SelectItem>
                <SelectItem value="blocked">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Blocked
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div
        className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
        style={{ animationDelay: "300ms" }}
      >
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading users...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-800px">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserIcon className="h-10 w-10 text-border" />
                        <h3 className="text-foreground font-medium">
                          No users found
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Try adjusting your filters or search terms.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-muted/50 transition-colors animate-in fade-in duration-500 fill-mode-both"
                      style={{ animationDelay: `${350 + idx * 50}ms` }}
                    >
                      {/* Name Column with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm border border-primary/20">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                            user.role === "admin"
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : user.role === "teacher"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-1 ring-green-600/20 dark:ring-green-400/20"
                              : user.status === "pending"
                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-600/20 dark:ring-yellow-400/20"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ring-1 ring-red-600/20 dark:ring-red-400/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              user.status === "active"
                                ? "bg-green-600 dark:bg-green-400"
                                : user.status === "pending"
                                  ? "bg-yellow-600 dark:bg-yellow-400"
                                  : "bg-red-600 dark:bg-red-400"
                            }`}
                          ></span>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(
                                activeMenu === user.id ? null : user.id,
                              );
                            }}
                            className={`p-2 rounded-lg hover:bg-card hover:shadow-sm hover:ring-1 hover:ring-border transition-all ${
                              activeMenu === user.id
                                ? "bg-muted ring-1 ring-border"
                                : ""
                            }`}
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>

                          {activeMenu === user.id && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-popover shadow-lg ring-1 ring-black/5 focus:outline-none z-20 animate-in fade-in zoom-in-95 duration-100">
                              <div className="p-1">
                                <div className="px-3 py-2 border-b border-border mb-1">
                                  <p className="text-xs font-semibold text-foreground">
                                    Manage Account
                                  </p>
                                </div>
                                <button
                                  onClick={() => openRoleModal(user)}
                                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-colors flex items-center gap-2"
                                >
                                  <UserCog className="h-4 w-4" /> Change Role
                                </button>
                                <button
                                  onClick={() => {
                                    toggleUserStatus(user.id, user.status);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary rounded-md transition-colors flex items-center gap-2"
                                >
                                  {user.status === "active" ? (
                                    <Ban className="h-4 w-4" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )}
                                  {user.status === "active"
                                    ? "Deactivate User"
                                    : "Activate User"}
                                </button>
                                <div className="h-px bg-border my-1 mx-2" />
                                <button
                                  onClick={() => {
                                    deleteUser(user.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete Account
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Update User Role
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a new access level for {selectedUser.fullName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {[
                  {
                    id: "student",
                    label: "Student",
                    desc: "Access to course materials only.",
                    icon: GraduationCap,
                  },
                  {
                    id: "teacher",
                    label: "Teacher",
                    desc: "Can create content and grade students.",
                    icon: Briefcase,
                  },
                  {
                    id: "admin",
                    label: "Administrator",
                    desc: "Full system access and user management.",
                    icon: Shield,
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${
                      newRole === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.id}
                      checked={newRole === option.id}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`mt-0.5 mr-3 p-1.5 rounded-lg ${
                        newRole === option.id
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            newRole === option.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {option.label}
                        </span>
                        {newRole === option.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          newRole === option.id
                            ? "text-primary/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {option.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-muted/30 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted focus:ring-2 focus:ring-border transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => updateUserRole(selectedUser.id, newRole)}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 shadow-md transition-all flex justify-center items-center gap-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu handler */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
