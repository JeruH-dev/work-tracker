import Link from "next/link";
import { redirect } from "next/navigation";

import { verifyEmailToken } from "@/lib/verification";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const token = typeof params.token === "string" ? params.token : Array.isArray(params.token) ? params.token[0] : null;

  if (!token) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Work Tracker</div>
          <h1>Verification link missing</h1>
          <p>The verification link looks incomplete or expired.</p>
          <Link className="button-primary" href="/sign-in">Back to sign in</Link>
        </section>
      </main>
    );
  }

  const result = await verifyEmailToken(token);

  if (!result) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Work Tracker</div>
          <h1>Invalid verification link</h1>
          <p>This verification link is no longer valid. Request a new one to continue.</p>
          <Link className="button-primary" href="/sign-in">Back to sign in</Link>
        </section>
      </main>
    );
  }

  if (result.expired) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="eyebrow">Work Tracker</div>
          <h1>Verification link expired</h1>
          <p>Your verification link has expired. Please request a new one.</p>
          <Link className="button-primary" href="/sign-in">Back to sign in</Link>
        </section>
      </main>
    );
  }

  redirect("/sign-in?verified=1");
}
