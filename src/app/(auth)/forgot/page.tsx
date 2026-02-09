"use client";

import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthInput } from "../../../components/ui/AuthInput";
import { FormError } from "../../../components/ui/FormError";
import { ErrorAlert } from "../../../components/ui/ErrorAlert";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setFieldErrors({ email: "" });

    // Basic client-side validation
    if (!email) {
      setFieldErrors({ email: "Email is required" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/forgot/verify");
      } else {
        setGlobalError(
          data.message || "Failed to send reset code. Please try again.",
        );
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      setGlobalError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      rightSideTitle="Locked out?"
      rightSideDescription="It happens to the best of us. We'll help you get back into your account safely so you don't miss any attendance check-ins."
      rightSideFeatures={[
        "Secure Recovery Link",
        "24/7 Account Support",
        "Identity Protection",
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        {/* Header Section */}
        <div className="space-y-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Forgot password?
          </h1>
          <p className="text-muted-foreground">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="pt-4">
          <ErrorAlert message={globalError} />
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <AuthInput
              label="University Email"
              icon={Mail}
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <FormError message={fieldErrors.email} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Reset Password"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
