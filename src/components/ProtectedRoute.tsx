"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { useAuth } from "@/hooks/useAuth"; // You'll need to create this hook

=======
import { useAuth } from "@/hooks/useAuth"; 
>>>>>>> feature/backend-auth
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "teacher" | "admin")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (
    !isAuthenticated ||
    (allowedRoles && user?.role && !allowedRoles.includes(user.role))
  ) {
    return null;
  }

  return <>{children}</>;
}
