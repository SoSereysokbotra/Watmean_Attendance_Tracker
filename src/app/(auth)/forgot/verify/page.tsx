"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "../../../../components/auth/AuthLayout";
import { OTPInput } from "../../../../components/auth/OTPInput";
import { ErrorAlert } from "../../../../components/ui/ErrorAlert";

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    setGlobalError("");
    setIsVerifying(true);

    try {
      const code = otp.join("");
      const response = await fetch("/api/auth/password/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to reset password page
        router.push("/forgot/reset");
      } else {
        setGlobalError(
          data.message || "Verification failed. Please try again.",
        );
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      console.error("Code verification error:", error);
      setGlobalError("An error occurred. Please try again.");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0 && !isResending) {
      setIsResending(true);
      setGlobalError("");

      try {
        // Resend password reset code
        const response = await fetch("/api/auth/password/resend", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          setTimer(30);
        } else {
          setGlobalError(data.message || "Failed to resend code.");
        }
      } catch (error) {
        console.error("Resend error:", error);
        // Reset timer even on error for better UX
        setTimer(30);
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <AuthLayout
      rightSideTitle={
        <>
          Securing your <br />
          <span className="text-muted-foreground">account access.</span>
        </>
      }
      rightSideFeatures={[
        "Identity Verification Required",
        "Automated Security Logging",
        "Encrypted Code Transmission",
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link
          href="/forgot"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to forgot password
        </Link>

        {/* Header */}
        <div className="space-y-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <Fingerprint className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Password reset
          </h1>
          <p className="text-muted-foreground">
            We sent a verification code to your email address
          </p>
        </div>

        <div className="pt-4">
          <ErrorAlert message={globalError} />
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <OTPInput value={otp} onChange={setOtp} disabled={isVerifying} />

          <button
            type="button"
            onClick={handleVerify}
            disabled={otp.some((digit) => digit === "") || isVerifying}
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Resend Logic */}
        <div className="text-center space-y-4 mt-8">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check spam or
          </p>
          {timer > 0 ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Resend code in 00:{timer < 10 ? `0${timer}` : timer}
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-semibold text-brand-primary hover:underline transition-all disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Click to resend"}
            </button>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
}
