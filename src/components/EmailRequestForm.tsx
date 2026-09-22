"use client";

import { FormEvent, useState } from "react";

export function EmailRequestForm({ mode }: { mode: "verification" | "reset" }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setMessage(null);
    setSubmitting(true);
    const email = String(new FormData(form).get("email") ?? "").trim().toLowerCase();
    const endpoint = mode === "verification" ? "/api/auth/resend-verification" : "/api/auth/forgot-password";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setError(payload.message ?? payload.error ?? "Unable to send the email. Please try again.");
      return;
    }

    form.reset();
    setMessage(payload.message ?? "Please check your email for next steps.");
  }

  const verification = mode === "verification";
  return (
    <form className="auth-form" onSubmit={submit}>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Sending..." : verification ? "Send verification email" : "Send reset link"}
      </button>
    </form>
  );
}
