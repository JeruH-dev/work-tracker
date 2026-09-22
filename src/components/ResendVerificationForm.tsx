"use client";

import { FormEvent, useState } from "react";

export function ResendVerificationForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Unable to send a new verification email.");
      return;
    }

    setSuccess(payload.message ?? "If your account exists, a new verification email has been sent.");
    event.currentTarget.reset();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label>
        Need a new verification email?
        <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <button className="button-quiet" disabled={submitting} type="submit">
        {submitting ? "Sending…" : "Resend verification email"}
      </button>
    </form>
  );
}
