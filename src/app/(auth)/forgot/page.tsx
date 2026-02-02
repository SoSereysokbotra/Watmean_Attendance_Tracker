"use client";

import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "../../../components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      rightSideTitle="Locked out?"
      rightSideDescription="It happens to the best of us. We'll help you get back into your account safely so you don't miss any attendance check-ins."
      // Overriding the default features for this specific context
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

        {/* Form Section */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            // Handle reset logic here
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              University Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="name@university.edu"
                required
                className="flex h-11 w-full rounded-xl border border-input bg-card px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 transition-all duration-200"
          >
            Reset Password
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Help Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still having trouble?{" "}
          <Link
            href="/support"
            className="font-semibold text-brand-primary hover:underline underline-offset-4"
          >
            Contact support
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
