import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  if (await getCurrentUser()) redirect("/");
  const params = await Promise.resolve(searchParams ?? {});
  const verified = params.verified === "1";
  const message = verified ? "Your email has been verified. You can sign in to continue." : null;

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand"><span className="brand-dot" /> Work Tracker</div>
        <div className="eyebrow">Workspace access</div>
        <h1>Welcome back</h1>
        <p>Sign in to pick up where your work left off.</p>
        {message && <p className="form-success">{message}</p>}
        <AuthForm mode="sign-in" />
      </section>
    </main>
  );
}
