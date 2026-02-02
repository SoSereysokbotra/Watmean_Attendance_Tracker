"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";

import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthInput } from "../../../components/ui/AuthInput";
import { FormError } from "../../../components/ui/FormError";
import { ErrorAlert } from "../../../components/ui/ErrorAlert";
import { useState } from "react";

export default function LoginPage() {
  const [globalError, setGlobalError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    setGlobalError("Invalid credentials.");
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Please enter your details to access the portal.
          </p>
        </div>

        <div className="pt-4">
          <ErrorAlert message={globalError} />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-1">
            <AuthInput
              label="Email address"
              icon={Mail}
              type="email"
              placeholder="name@university.edu"
            />
            <FormError message={fieldErrors.email} />
          </div>

          {/* Password Input with "Forgot Password" link */}
          <div className="space-y-1">
            <AuthInput
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              rightElement={
                <Link
                  href="/forgot"
                  className="text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              }
            />
            <FormError message={fieldErrors.password} />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-border bg-card text-brand-primary focus:ring-brand-primary/20"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-2">
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* SSO Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-all"
            >
              <Building2 className="h-4 w-4 text-muted-foreground" />
              University ID (SSO)
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-primary hover:underline underline-offset-4 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
