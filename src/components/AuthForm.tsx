"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setErrorCode(null);
    setSuccess(null);
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (isSignUp) {
      const email = String(payload.email ?? "").trim().toLowerCase();
      const password = String(payload.password ?? "");
      const confirmPassword = String(payload.confirmPassword ?? "");
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      payload.email = email;
    }

    setSubmitting(true);
    const response = await fetch(`/api/auth/${isSignUp ? "register" : "sign-in"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setErrorCode(result.code ?? null);
      setError(result.message ?? result.error ?? "Unable to continue");
      return;
    }

    if (isSignUp) {
      form.reset();
      setSuccess(result.message ?? "Account created. Please verify your email to continue.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {isSignUp && (
        <label>
          Name
          <input name="name" autoComplete="name" minLength={2} required />
        </label>
      )}

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={isSignUp ? 8 : undefined}
          required
        />
      </label>

      {isSignUp && (
        <label>
          Confirm password
          <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
        </label>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
      {errorCode === "EMAIL_NOT_VERIFIED" && <Link className="auth-inline-action" href="/verify-email/request">Resend verification email</Link>}
      {success && <p className="form-success" role="status">{success}</p>}

      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
      </button>

      <p className="auth-switch">
        {isSignUp ? "Already have an account?" : "New to Work Tracker?"}{" "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link>
      </p>
      {!isSignUp && <p className="auth-switch"><Link href="/forgot-password">Forgot your password?</Link></p>}
    </form>
  );
}
