"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Params {
  classCode: string;
}

export default function JoinClassPage({ params }: { params: Promise<Params> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classCode, setClassCode] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setClassCode(resolvedParams.classCode);
      handleAutoJoin(resolvedParams.classCode);
    });
  }, [params]);

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-700">
              Joining class...
            </p>
            <p className="text-sm text-gray-500">Class code: {classCode}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Failed to Join Class
            </h1>
            <p className="text-center text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/student/classes")}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Go to My Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
