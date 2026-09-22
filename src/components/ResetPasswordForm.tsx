"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);
    if (!response.ok) {
      setError(payload.message ?? "Unable to reset your password. Please request a new link.");
      return;
    }
    setComplete(true);
  }

  if (complete) {
    return (
      <div className="auth-complete">
        <p className="form-success" role="status">Your password has been reset successfully.</p>
        <Link className="button-primary auth-button-link" href="/sign-in">Continue to sign in</Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label>New password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
      <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button-primary" disabled={submitting} type="submit">{submitting ? "Saving..." : "Set new password"}</button>
    </form>
  );
}
