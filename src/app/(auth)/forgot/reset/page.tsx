"use client";

import { useState } from "react";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "../../../../components/auth/AuthLayout";
import { ErrorAlert } from "../../../../components/ui/ErrorAlert";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");

  // Validation Logic
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;

  const canSubmit = hasLength && hasNumber && hasSpecial && isMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setGlobalError("");
    // Handle reset logic
    // setGlobalError("Failed to reset password. Please try again.");
  };

  return (
    <AuthLayout
      rightSideTitle={
        <>
          Security is our <br />
          <span className="text-muted-foreground">top priority.</span>
        </>
      }
      rightSideDescription="Once you reset your password, you will be automatically logged out of all other devices to ensure your account integrity and privacy."
      rightSideFeatures={[
        "Automatic Session Termination",
        "Encrypted Password Hashing",
        "Account Integrity Check",
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Set new password
          </h1>
          <p className="text-muted-foreground">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <div className="pt-4">
          <ErrorAlert message={globalError} />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex h-11 w-full rounded-xl border border-input bg-card px-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="flex h-11 w-full rounded-xl border border-input bg-card px-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary transition-all"
              />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-4 rounded-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">
              Password Requirements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ValidationItem label="8+ characters" isValid={hasLength} />
              <ValidationItem label="At least one number" isValid={hasNumber} />
              <ValidationItem
                label="One special character"
                isValid={hasSpecial}
              />
              <ValidationItem label="Passwords match" isValid={isMatch} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Update Password
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </AuthLayout>
  );
}

// Sub-component for the checklist items
function ValidationItem({
  label,
  isValid,
}: {
  label: string;
  isValid: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center transition-colors ${
          isValid ? "bg-green-500/20" : "bg-muted-foreground/10"
        }`}
      >
        {isValid && <Check className="h-2.5 w-2.5 text-green-500" />}
      </div>
      <span
        className={`text-xs ${isValid ? "text-foreground font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}
