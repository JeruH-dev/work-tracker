"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["▦", "Dashboard", "/"],
  ["□", "My tasks", "/tasks"],
  ["▤", "Task board", "/kanban"],
  ["◷", "Calendar", "/calendar"],
  ["◫", "Projects", "/projects"],
  ["◌", "Activity log", "#"],
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/session").then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user ?? null)).catch(() => setUser(null));
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="main-sidebar" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
      {open && <button className="sidebar-overlay" type="button" aria-label="Close navigation" onClick={closeMenu} />}
    <aside className={`sidebar${open ? " is-open" : ""}`} id="main-sidebar">
      <div className="brand"><div className="brand-mark">Gideon / PWAT</div><h1>Work Tracker</h1></div>
      <nav aria-label="Main navigation">
        <div className="nav-label">Workspace</div>
        {links.map(([icon, label, href]) => <a className={`nav-link${pathname === href ? " active" : ""}`} href={href} key={label} onClick={closeMenu}><span aria-hidden="true">{icon}</span>{label}</a>)}
        <div className="nav-label" style={{ marginTop: 28 }}>Reports</div>
        <a className="nav-link" href="/reports" onClick={closeMenu}><span aria-hidden="true">↗</span>Report</a>
        <a className="nav-link" href="#" onClick={closeMenu}><span aria-hidden="true">▤</span>Archive</a>
      </nav>
      <div className="sidebar-footer"><a className={`nav-link${pathname === "/settings" ? " active" : ""}`} href="/settings" onClick={closeMenu}><span aria-hidden="true">⚙</span>Settings</a><div className="sidebar-user"><span className="sidebar-user-avatar" aria-hidden="true">{user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?"}</span><span>{user?.name || "Account"}</span></div></div>
    </aside>
    </>
  );
}
