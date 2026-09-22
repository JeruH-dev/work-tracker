import Link from "next/link";

import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const token = typeof params.token === "string" ? params.token : Array.isArray(params.token) ? params.token[0] : null;

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-wide">
        <div className="auth-brand"><span className="brand-dot" /> Work Tracker</div>
        <div className="eyebrow">Account recovery</div>
        <h1>Create a new password</h1>
        <p>Choose a strong password you haven&apos;t used here before.</p>
        {token ? <ResetPasswordForm token={token} /> : <p className="form-error">This reset link is missing or invalid. <Link href="/forgot-password">Request a new link</Link>.</p>}
      </section>
    </main>
  );
}
