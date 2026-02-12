"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassJoined?: () => void;
}

export function JoinClassModal({
  isOpen,
  onClose,
  onClassJoined,
}: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateClassCode = (code: string) => {
    // Accept common join-code formats like "X7K-9P2" or "CS-402"
    return /^[A-Z0-9]{2,6}-[A-Z0-9]{2,6}$/.test(code.trim().toUpperCase());
  };

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
        onClassJoined?.();
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
    if (e.key === "Enter" && !loading && validateClassCode(classCode)) {
      handleJoin();
    }
  };

  if (!isOpen) return null;

  const isValid = validateClassCode(classCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-2xl animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Join a Class</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the class code provided by your teacher
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="classCode"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Class Code
            </label>
            <Input
              id="classCode"
              type="text"
              placeholder="e.g., X7K-9P2"
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
            <p className="mt-1 text-xs text-muted-foreground">
              Format: 2–6 letters/numbers, hyphen, 2–6 letters/numbers (e.g.
              X7K-9P2, CS-402)
            </p>
            {!isValid && classCode.length > 0 && (
              <p className="text-xs text-amber-500 mt-1">
                Format looks incomplete.
              </p>
            )}
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
              disabled={loading || !isValid}
            >
              {loading ? "Joining..." : "Join Class"}
            </Button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            💡 You can find the class code in your email invitation or ask your
            teacher to share it with you.
          </p>
        </div>
      </div>
    </div>
  );
}
