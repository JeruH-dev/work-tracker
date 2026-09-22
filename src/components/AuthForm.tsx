"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function PasswordField({
  name,
  autoComplete,
  minLength,
  label,
}: {
  name: string;
  autoComplete: string;
  minLength?: number;
  label: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}

      <span className="password-input-wrap">
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />

        <button
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          className="password-visibility"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3l18 18" />
              <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
              <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.88c5.05 0 8.63 3.12 10 7.12a10.98 10.98 0 0 1-2.16 3.49" />
              <path d="M6.61 6.61C4.62 7.9 3.24 9.72 2 12c1.37 4 4.95 7.12 10 7.12a10.94 10.94 0 0 0 4.12-.8" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="2.8" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}


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

      <PasswordField
        autoComplete={isSignUp ? "new-password" : "current-password"}
        label="Password"
        minLength={isSignUp ? 8 : undefined}
        name="password"
      />

      {isSignUp && (
        <PasswordField autoComplete="new-password" label="Confirm password" minLength={8} name="confirmPassword" />
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
