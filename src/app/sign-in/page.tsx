import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  if (await getCurrentUser()) redirect("/");
  return <main className="auth-page"><section className="auth-panel"><div className="eyebrow">Work Tracker</div><h1>Welcome back</h1><p>Sign in to manage your work.</p><AuthForm mode="sign-in" /></section></main>;
}
