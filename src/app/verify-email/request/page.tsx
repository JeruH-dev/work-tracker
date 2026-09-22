import Link from "next/link";

import { EmailRequestForm } from "@/components/EmailRequestForm";

export default function RequestVerificationPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-wide">
        <div className="auth-brand"><span className="brand-dot" /> Work Tracker</div>
        <div className="eyebrow">Account verification</div>
        <h1>Verify your email</h1>
        <p>Enter your email and we&apos;ll send a fresh verification link. The link expires after 24 hours.</p>
        <EmailRequestForm mode="verification" />
        <p className="auth-switch"><Link href="/sign-in">Back to sign in</Link></p>
      </section>
    </main>
  );
}
