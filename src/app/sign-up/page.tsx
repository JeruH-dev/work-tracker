import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/");
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand"><span className="brand-dot" /> Work Tracker</div>
        <div className="eyebrow">New workspace</div>
        <h1>Create your account</h1>
        <p>Set up your workspace and keep your next action clear.</p>
        <AuthForm mode="sign-up" />
        <div className="auth-help"><span>Already registered but need access?</span><Link href="/verify-email/request">Resend verification email</Link></div>
      </section>
    </main>
  );
}
