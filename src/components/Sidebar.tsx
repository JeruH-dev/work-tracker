"use client";

import { useState } from "react";

const links: [string, string, boolean][] = [
  ["▦", "Dashboard", true],
  ["□", "My tasks", false],
  ["▤", "Task board", false],
  ["◷", "Calendar", false],
  ["◫", "Projects", false],
  ["◌", "Activity log", false],
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

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
        {links.map(([icon, label, active]) => <a className={`nav-link${active ? " active" : ""}`} href={label === "Dashboard" ? "/" : label === "My tasks" ? "/tasks" : label === "Task board" ? "/kanban" : label === "Calendar" ? "/calendar" : label === "Projects" ? "/projects" : "#"} key={label} onClick={closeMenu}><span aria-hidden="true">{icon}</span>{label}</a>)}
        <div className="nav-label" style={{ marginTop: 28 }}>Reports</div>
        <a className="nav-link" href="/reports" onClick={closeMenu}><span aria-hidden="true">↗</span>Report</a>
        <a className="nav-link" href="#" onClick={closeMenu}><span aria-hidden="true">▤</span>Archive</a>
      </nav>
      <div className="sidebar-footer">A clear record of what moved, what blocked you, and what comes next.</div>
    </aside>
    </>
  );
}
