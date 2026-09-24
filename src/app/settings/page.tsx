import { redirect } from "next/navigation";

import { SettingsPage } from "@/components/SettingsPage";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return <SettingsPage user={user} />;
}