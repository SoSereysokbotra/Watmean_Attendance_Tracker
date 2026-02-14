"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthInput } from "../../../components/ui/AuthInput";
import { FormError } from "../../../components/ui/FormError";
import { ErrorAlert } from "../../../components/ui/ErrorAlert";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setFieldErrors({ email: "", password: "" });
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.data) {
        if (data.data.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
        }

        // If there's a returnUrl, redirect there; otherwise use role-based redirect
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          const role = data.data.user?.role;
          if (role === "teacher") {
            router.push("/teacher");
          } else if (role === "student") {
            router.push("/student");
          } else if (role === "admin") {
            router.push("/admin/dashboard");
          }
        }
      } else {
        setGlobalError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setGlobalError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormContent />
      </Suspense>
    </AuthLayout>
  );
}
