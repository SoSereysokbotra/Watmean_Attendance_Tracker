"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinClassModal({ isOpen, onClose }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async () => {
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/student/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classCode: classCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - close modal and refresh page
        onClose();
        setClassCode("");
        router.refresh();
      } else {
        setError(data.error || "Failed to join class");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleJoin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Join a Class</h2>
          <p className="mt-1 text-sm text-gray-600">
            Enter the class code provided by your teacher
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="classCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Class Code
            </label>
            <Input
              id="classCode"
              type="text"
              placeholder="e.g., PHY-1234"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value.toUpperCase());
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              className="text-center text-lg font-mono uppercase tracking-wider"
              disabled={loading}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Format: XXX-1234 (3 letters/numbers - 4 digits)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              className="flex-1"
              disabled={loading || !classCode.trim()}
            >
              {loading ? "Joining..." : "Join Class"}
            </Button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            💡 You can find the class code in your email invitation or ask your
            teacher to share it with you.
          </p>
        </div>
      </div>
    </div>
  );
}
