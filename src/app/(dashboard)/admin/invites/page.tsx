"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  Check,
  Loader2,
  Copy,
  RefreshCw,
  User,
  Send,
} from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  token: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
}

export default function InviteTeacherPage() {
  // --- STATE (Unchanged) ---
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- LOGIC (Unchanged) ---
  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/admin/invitations");
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch invitations", error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "teacher", name }),
      });
      const data = await res.json();

      if (data.success) {
        setEmail("");
        setName("");
        fetchInvitations();
      } else {
        alert(data.message || "Failed to invite teacher");
      }
    } catch (error) {
      console.error("Error inviting teacher", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (id: string) => {
    try {
      setResendingId(id);
      const res = await fetch(`/api/admin/invitations/${id}/resend`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invitation", error);
    } finally {
      setResendingId(null);
    }
  };

  const copyToClipboard = (token: string, id: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Invite Teacher
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate secure invitation links for new teachers to join the
          platform.
        </p>
      </div>

      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Invite Form - Left Column (Stacks on mobile, sticky on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Send Invitation
              </h2>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
                >
                  Teacher's Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="pl-9 w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
                >
                  Teacher's Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. teacher@school.edu"
                    className="pl-9 w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary text-light rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-primary/90 focus:ring-4 focus:ring-brand-primary/20 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Generate Invite Link
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Pending Invites List - Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 sm:py-7 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">
                Invitation History
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted rounded-md text-muted-foreground border border-border">
                {invitations.length} Records
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Created
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invitations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Mail className="h-8 w-8 text-border" />
                          <p className="text-muted-foreground text-sm">
                            No invitations sent yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invitations.map((invite) => (
                      <tr
                        key={invite.id}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                          {invite.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                              invite.status === "accepted"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-400/20"
                                : invite.status === "pending"
                                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 ring-yellow-600/20 dark:ring-yellow-400/20"
                                  : "bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-300 ring-gray-500/10 dark:ring-gray-400/10"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                invite.status === "accepted"
                                  ? "bg-green-600 dark:bg-green-400"
                                  : invite.status === "pending"
                                    ? "bg-yellow-600 dark:bg-yellow-400"
                                    : "bg-gray-500"
                              }`}
                            ></span>
                            {invite.status.charAt(0).toUpperCase() +
                              invite.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(invite.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {invite.status === "pending" && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(invite.token, invite.id)
                                }
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border ${
                                  copiedId === invite.id
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                                }`}
                                title="Copy Invitation Link"
                              >
                                {copiedId === invite.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy Link
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleResend(invite.id)}
                                disabled={resendingId === invite.id}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                                title="Resend Invitation Email"
                              >
                                {resendingId === invite.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
