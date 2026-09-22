import Link from "next/link";

import { EmailRequestForm } from "@/components/EmailRequestForm";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-wide">
        <div className="auth-brand"><span className="brand-dot" /> Work Tracker</div>
        <div className="eyebrow">Account recovery</div>
        <h1>Reset your password</h1>
        <p>Enter the email address on your account. We&apos;ll send instructions to create a new password.</p>
        <EmailRequestForm mode="reset" />
        <p className="auth-switch"><Link href="/sign-in">Back to sign in</Link></p>
      </section>
    </main>
  );
}
