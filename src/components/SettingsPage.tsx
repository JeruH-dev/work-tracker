"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";

type User = { name: string; email: string; emailVerified: boolean };
type Settings = Record<string, string | boolean>;

const sections = ["Account", "Appearance", "Accessibility", "Notifications", "Tasks", "Calendar", "Projects", "Data & Privacy", "Security", "Integrations", "About"];

function label(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function SettingsPage({ user }: { user: User }) {
  const [section, setSection] = useState("Account");
  const [settings, setSettings] = useState<Settings>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((response) => response.json()).then(setSettings).catch(() => setStatus("Unable to load preferences."));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = String(settings.theme ?? "system");
    root.dataset.density = String(settings.density ?? "comfortable");
    root.dataset.textSize = String(settings.textSize ?? "default");
    root.classList.toggle("high-contrast", settings.highContrast === true);
    root.classList.toggle("reduce-motion", settings.reduceMotion === true);
    root.classList.toggle("large-targets", settings.largerClickTargets === true);
  }, [settings]);

  async function update(key: string, value: string | boolean) {
    setSettings((current) => ({ ...current, [key]: value }));
    setStatus("Saving...");
    const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: value }) });
    setStatus(response.ok ? "Changes saved" : "Unable to save changes");
    window.setTimeout(() => setStatus(""), 1800);
  }

  const toggle = (key: string, text: string) => <label className="settings-toggle"><input type="checkbox" checked={settings[key] === true} onChange={(event) => update(key, event.target.checked)} /><span>{text}</span></label>;
  const select = (key: string, options: string[]) => <select value={String(settings[key] ?? options[0])} onChange={(event) => update(key, event.target.value)} aria-label={label(key)}>{options.map((option) => <option key={option} value={option}>{label(option)}</option>)}</select>;
  const radio = (key: string, options: string[]) => <div className="settings-radio-group">{options.map((option) => <label key={option}><input type="radio" name={key} checked={settings[key] === option} onChange={() => update(key, option)} />{label(option)}</label>)}</div>;
  const row = (title: string, description: string, control: ReactNode) => <div className="settings-row"><div><strong>{title}</strong><span>{description}</span></div>{control}</div>;

  function content() {
    if (section === "Account") return <><SettingsHeading title="Account" description="Manage your personal details and account preferences." /><div className="settings-card"><div className="settings-profile"><div className="settings-avatar">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div>{row("Full name", "Your authenticated profile name", <span className="settings-value">{user.name}</span>)}{row("Email address", "Used for sign-in and account messages", <span className="settings-value">{user.email}</span>)}{row("Email verification", "Account security status", <span className="settings-status">{user.emailVerified ? "Verified" : "Not verified"}</span>)}</div><div className="settings-card"><h3>Account actions</h3>{row("Change password", "Request a secure password reset link", <a className="button-quiet" href="/forgot-password">Change password</a>)}{row("Delete account", "Permanently remove your Work Tracker data", <button className="button-danger" type="button" disabled>Contact support</button>)}</div></>;
    if (section === "Appearance") return <><SettingsHeading title="Appearance" description="Make Work Tracker feel comfortable across your devices." /><div className="settings-card"><h3>Theme</h3>{radio("theme", ["light", "dark", "system"])}{row("Density", "Choose the amount of space in lists and panels", select("density", ["comfortable", "compact"]))}{row("Sidebar", "Keep the sidebar preference on this device", toggle("rememberSidebarState", "Remember sidebar state"))}</div></>;
    if (section === "Accessibility") return <><SettingsHeading title="Accessibility" description="Adjust the interface for your reading, motion, and input preferences." /><div className="settings-card"><h3>Text size</h3>{radio("textSize", ["small", "default", "large", "extra-large"])}{toggle("reduceMotion", "Reduce animations")}{toggle("highContrast", "Increase contrast")}{toggle("showStatusLabels", "Always show task status labels")}{toggle("largerClickTargets", "Use larger click targets")}<p className="settings-note">System motion preferences are respected automatically.</p></div></>;
    if (section === "Notifications") return <><SettingsHeading title="Notifications" description="Choose which reminders deserve your attention." /><div className="settings-card"><h3>Email notifications</h3>{toggle("emailTaskReminders", "Task reminders")}{toggle("emailTaskAssignments", "Task assignments")}{toggle("emailWeeklySummary", "Weekly work summary")}{toggle("emailProjectUpdates", "Project updates")}<h3>In-app notifications</h3>{toggle("inAppTaskReminders", "Task reminders")}{toggle("inAppDueDateWarnings", "Due-date warnings")}{row("Reminder timing", "When a reminder should arrive", select("reminderTiming", ["immediately", "one_day", "three_days"]))}</div></>;
    if (section === "Tasks") return <><SettingsHeading title="Tasks & workflow" description="Set useful defaults for creating and reviewing work." /><div className="settings-card">{row("Default task status", "Status for new tasks", select("defaultTaskStatus", ["BACKLOG", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "COMPLETED"]))}{row("Default priority", "Priority for new tasks", select("defaultPriority", ["LOW", "MEDIUM", "HIGH", "URGENT"]))}{row("Default view", "Where task links should open", select("defaultTaskView", ["list", "board", "calendar"]))}{toggle("confirmTaskDeletion", "Confirm before deleting")}{toggle("showCompletedTasks", "Show completed tasks")}{toggle("warnOverdueTasks", "Warn me about overdue tasks")}</div></>;
    if (section === "Calendar") return <><SettingsHeading title="Calendar" description="Set calendar conventions that match your working day." /><div className="settings-card">{row("Week starts on", "First day shown in calendar views", select("weekStartsOn", ["monday", "sunday"]))}{row("Time format", "How times are displayed", radio("timeFormat", ["12", "24"]))}{row("Default calendar view", "The view used when opening Calendar", select("defaultCalendarView", ["month", "week", "day"]))}{toggle("showWeekends", "Show weekends")}{toggle("showCompletedCalendarTasks", "Show completed tasks")}</div></>;
    if (section === "Projects") return <><SettingsHeading title="Projects" description="Choose how project work is presented." /><div className="settings-card">{row("Default project view", "The view used when opening Projects", select("defaultProjectView", ["overview", "board", "list"]))}{toggle("enableProjectColours", "Enable project colours")}{toggle("archiveCompletedProjects", "Move completed projects to archive")}{toggle("showProjectProgress", "Show project progress")}</div></>;
    if (section === "Data & Privacy") return <><SettingsHeading title="Data & privacy" description="Export your data or review privacy controls." /><div className="settings-card"><h3>Your data</h3>{row("Export all data", "Download your user-scoped data as JSON", <a className="button-quiet" href="/api/settings/export?format=json">Export JSON</a>)}{row("Export tasks", "Download tasks and projects as CSV", <a className="button-quiet" href="/api/settings/export?format=csv">Export CSV</a>)}{toggle("keepActivityHistory", "Keep activity history")}</div><div className="settings-card danger-zone"><h3>Danger zone</h3><p>Destructive data actions are disabled until a confirmation flow is available.</p><button className="button-danger" type="button" disabled>Delete account</button></div></>;
    if (section === "Security") return <><SettingsHeading title="Security" description="Keep your account protected with the existing authentication tools." /><div className="settings-card">{row("Password", "Change your password through a secure reset flow", <a className="button-quiet" href="/forgot-password">Change password</a>)}{row("Email verification", "Verification is required before sign-in", <span className="settings-status">{user.emailVerified ? "Verified" : "Required"}</span>)}<div className="settings-unavailable"><strong>Two-factor authentication</strong><span>Coming soon. No unsupported security flow has been added.</span></div><div className="settings-unavailable"><strong>Session management</strong><span>Coming soon. Your current session remains protected by the existing session cookie.</span></div></div></>;
    if (section === "Integrations") return <><SettingsHeading title="Integrations" description="Connect external tools when supported by Work Tracker." /><div className="settings-card">{["Google Calendar", "Microsoft Outlook", "Google Drive", "GitHub"].map((name) => <div className="settings-row" key={name}><div><strong>{name}</strong><span>Connection framework planned for a future release.</span></div><button className="button-quiet" type="button" disabled>Coming soon</button></div>)}</div></>;
    return <><SettingsHeading title="About" description="Work Tracker keeps a clear record of what moved, what blocked you, and what comes next." /><div className="settings-card about-card"><div className="settings-avatar">WT</div><h3>Work Tracker</h3><p>Version {process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0"}</p><a href="/reports">Reports</a><a href="/forgot-password">Account help</a></div></>;
  }

  return <div className="dashboard-shell"><Sidebar /><main className="main-content settings-main"><div className="settings-shell"><header className="settings-topbar"><div><div className="eyebrow">Work Tracker</div><h2>Settings</h2><p>Personalize your workspace and account.</p></div>{status && <span className="settings-save-status" role="status">{status}</span>}</header><div className="settings-mobile-select"><label htmlFor="settings-section">Section</label><select id="settings-section" value={section} onChange={(event) => setSection(event.target.value)}>{sections.map((name) => <option key={name}>{name}</option>)}</select></div><div className="settings-layout"><nav className="settings-nav" aria-label="Settings sections">{sections.map((name) => <button className={name === section ? "is-active" : ""} key={name} type="button" onClick={() => setSection(name)} aria-current={name === section ? "page" : undefined}>{name}</button>)}</nav><main className="settings-content" aria-live="polite">{content()}</main></div></div></main></div>;
}

function SettingsHeading({ title, description }: { title: string; description: string }) {
  return <div className="settings-heading"><h1>{title}</h1><p>{description}</p></div>;
}