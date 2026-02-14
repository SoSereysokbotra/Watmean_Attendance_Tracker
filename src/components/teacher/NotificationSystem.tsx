"use client";

import { useState } from "react";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationType =
  | "attendance"
  | "late"
  | "absent"
  | "system"
  | "reminder";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "late",
      title: "Late Arrival Detected",
      message: "Jane Doe checked in 15 minutes late for Physics 101",
      time: "10 minutes ago",
      read: false,
      priority: "medium",
      action: {
        label: "View Details",
        onClick: () => console.log("View late arrival details"),
      },
    },
    {
      id: "2",
      type: "absent",
      title: "Consecutive Absences",
      message: "John Smith has missed 3 consecutive classes",
      time: "2 hours ago",
      read: false,
      priority: "high",
      action: {
        label: "Contact Student",
        onClick: () => console.log("Contact student"),
      },
    },
    {
      id: "3",
      type: "system",
      title: "System Update",
      message: "Geofence accuracy has been improved to 98.5%",
      time: "1 day ago",
      read: true,
      priority: "low",
    },
    {
      id: "4",
      type: "reminder",
      title: "Upcoming Class",
      message: "Chemistry 201 starts in 30 minutes",
      time: "1 hour ago",
      read: true,
      priority: "medium",
      action: {
        label: "Prepare Session",
        onClick: () => console.log("Prepare session"),
      },
    },
  ]);

  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [showRead, setShowRead] = useState(true);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "late":
        return <Clock className="text-amber-500" size={16} />;
      case "absent":
        return <AlertCircle className="text-rose-500" size={16} />;
      case "system":
        return <Bell className="text-blue-500" size={16} />;
      case "reminder":
        return <Clock className="text-emerald-500" size={16} />;
      default:
        return <Bell className="text-brand-primary" size={16} />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-rose-500";
      case "medium":
        return "border-l-amber-500";
      case "low":
        return "border-l-blue-500";
      default:
        return "border-l-border";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter = filter === "all" || notif.type === filter;
    const matchesRead = showRead || !notif.read;
    return matchesFilter && matchesRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Header - responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="text-foreground" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRead(!showRead)}
          >
            {showRead ? "Hide Read" : "Show Read"}
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs - already has overflow-x-auto */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "attendance", "late", "absent", "system", "reminder"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === type
                  ? "bg-brand-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="mx-auto mb-2 opacity-50" size={32} />
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md ${getPriorityColor(
                notification.priority,
              )} border-l-4 ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/5" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      {notification.action && (
                        <button
                          onClick={notification.action.onClick}
                          className="text-xs font-medium text-brand-primary hover:text-brand-primary/80"
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 hover:bg-muted rounded"
                      title="Mark as read"
                    >
                      <CheckCircle
                        size={14}
                        className="text-muted-foreground"
                      />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 hover:bg-muted rounded"
                    title="Delete"
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-muted/50 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Notification Preferences</p>
            <p className="text-xs text-muted-foreground">
              Manage how you receive notifications
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Mail size={14} className="mr-2" />
            Email Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
