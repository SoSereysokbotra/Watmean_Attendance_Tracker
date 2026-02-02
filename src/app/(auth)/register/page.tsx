import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { AuthInput } from "../../../components/ui/AuthInput";

export default function SignupPage() {
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

      {/* The Form */}
      <form className="space-y-5">
        <AuthInput
          label="Full Name"
          icon={User}
          type="text"
          placeholder="e.g. Jordan Smith"
        />

        <AuthInput
          label="Institutional Email"
          icon={Mail}
          type="email"
          placeholder="jordan@university.edu"
          helperText="Please use your .edu email address for verification."
        />

        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
        />

        {/* Terms Checkbox - Kept inline as it's specific to register */}
        <div className="flex items-start gap-3 pt-2">
          <div className="flex h-6 items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border bg-card text-brand-primary focus:ring-brand-primary/20"
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
        <Link href="/verify" className="block">
          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/25 hover:bg-opacity-90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200"
          >
            Create Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
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
