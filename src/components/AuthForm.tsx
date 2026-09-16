"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${isSignUp ? "register" : "sign-in"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);
    if (!response.ok) return setError(payload.error ?? "Unable to continue");
    router.replace("/");
    router.refresh();
  }

  return <form className="auth-form" onSubmit={submit}>{isSignUp && <label>Name<input name="name" autoComplete="name" minLength={2} required /></label>}<label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={isSignUp ? 12 : undefined} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary" disabled={submitting} type="submit">{submitting ? "Please wait" : isSignUp ? "Create account" : "Sign in"}</button><p className="auth-switch">{isSignUp ? "Already have an account?" : "New to Work Tracker?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link></p></form>;
}
