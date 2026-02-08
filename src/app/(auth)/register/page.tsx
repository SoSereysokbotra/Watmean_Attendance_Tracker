"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthInput } from "../../../components/ui/AuthInput";
import { FormError } from "../../../components/ui/FormError";
import { ErrorAlert } from "../../../components/ui/ErrorAlert";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [globalError, setGlobalError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setFieldErrors({ name: "", email: "", password: "" });

    // Validation
    let hasError = false;
    if (!email) {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }
    if (!name) {
      setFieldErrors((prev) => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }

    if (hasError) return;

    // Simulate basic validation success/failure for demo
    // For now, we'll just simulate a successful navigation if valid
    // In a real app, you'd call an API here

    // Example: checking if user exists (mock)
    if (email === "test@university.edu") {
      setGlobalError("User already exists.");
      return;
    }

    router.push("/verify");
  };

  return (
    <AuthLayout rightSideTitle="The most reliable way to handle attendance in large lecture halls.">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Join your campus
        </h1>
        <p className="text-muted-foreground">
          Create an account to track or manage attendance.
        </p>
      </div>

      <div className="pt-4">
        <ErrorAlert message={globalError} />
      </div>

      {/* The Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <AuthInput
            label="Full Name"
            icon={User}
            type="text"
            placeholder="e.g. Jordan Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormError message={fieldErrors.name} />
        </div>
        <div>
          <AuthInput
            label="Institutional Email"
            icon={Mail}
            type="email"
            placeholder="jordan@university.edu"
            helperText="Please use your .edu email address for verification."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormError message={fieldErrors.email} />
        </div>

        <div>
          <AuthInput
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormError message={fieldErrors.password} />
        </div>

        {/* Terms Checkbox - Kept inline as it's specific to register */}
        <div className="flex items-start gap-3 pt-2">
          <div className="flex h-6 items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border bg-card text-brand-primary focus:ring-brand-primary/20 mb-2"
            />
          </div>
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground leading-tight"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-brand-primary hover:underline font-medium"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-brand-primary hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:bg-opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200"
        >
          Create Account
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-primary hover:text-foreground transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
