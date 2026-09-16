import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/");
  return <main className="auth-page"><section className="auth-panel"><div className="eyebrow">Work Tracker</div><h1>Create your account</h1><p>Start with a clear record of your work.</p><AuthForm mode="sign-up" /></section></main>;
}
