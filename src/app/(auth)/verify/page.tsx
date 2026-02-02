"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "../../../components/auth/AuthLayout";
import { OTPInput } from "../../../components/auth/OTPInput";

export default function SignupVerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      // Add your resend logic here
    }
  };

  return (
    <AuthLayout
      rightSideTitle={
        <>
          Join thousands of <br />
          <span className="text-muted-foreground">verified students.</span>
        </>
      }
      rightSideFeatures={[
        "Official University Verification",
        "Instant Access to Courses",
        "Real-time Attendance Sync",
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link
          href="/signup"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to signup
        </Link>

        {/* Header */}
        <div className="space-y-2 mb-8">
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verify your email
          </h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to your university email
            address.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <OTPInput value={otp} onChange={setOtp} />

          <button
            type="submit"
            disabled={otp.some((digit) => digit === "")}
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Create Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Resend Logic */}
        <div className="text-center space-y-4 mt-8">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your university's junk folder.
          </p>
          {timer > 0 ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Resend available in 00:{timer < 10 ? `0${timer}` : timer}
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-brand-primary hover:underline transition-all"
            >
              Click to resend code
            </button>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
}
