"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Params {
  classCode: string;
}

export default function JoinClassPage({ params }: { params: Promise<Params> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = use(params);
  const classCode = resolvedParams.classCode;

  useEffect(() => {
    handleAutoJoin(classCode);
  }, [classCode]);

  const handleAutoJoin = async (code: string) => {
    try {
      // Try to join the class
      const response = await fetch("/api/student/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classCode: code }),
      });

      if (response.status === 401) {
        // Not authenticated, redirect to login with return URL
        const returnUrl = encodeURIComponent(`/join/${code}`);
        router.push(`/login?returnUrl=${returnUrl}`);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Successfully joined, redirect to classes page
        router.push("/student/classes");
      } else {
        setError(data.error || "Failed to join class");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred while joining the class");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <p className="text-muted-foreground animate-pulse">
            Joining class...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-sm text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Unable to Join Class
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't process your request to join this class."}
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/student/classes")}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Go to My Classes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
