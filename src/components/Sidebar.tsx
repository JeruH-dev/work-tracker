const links: [string, string, boolean][] = [
  ["▦", "Dashboard", true],
  ["□", "My tasks", false],
  ["▤", "Task board", false],
  ["◷", "Calendar", false],
  ["◫", "Projects", false],
  ["◌", "Activity log", false],
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">Gideon / PWAT</div><h1>Work Tracker</h1></div>
      <nav aria-label="Main navigation">
        <div className="nav-label">Workspace</div>
        {links.map(([icon, label, active]) => <a className={`nav-link${active ? " active" : ""}`} href={label === "Dashboard" ? "/" : label === "My tasks" ? "/tasks" : label === "Task board" ? "/kanban" : label === "Calendar" ? "/calendar" : label === "Projects" ? "/projects" : "#"} key={label}><span aria-hidden="true">{icon}</span>{label}</a>)}
        <div className="nav-label" style={{ marginTop: 28 }}>Reports</div>
        <a className="nav-link" href="#"><span aria-hidden="true">↗</span>Weekly report</a>
        <a className="nav-link" href="#"><span aria-hidden="true">▤</span>Archive</a>
      </nav>
      <div className="sidebar-footer">A clear record of what moved, what blocked you, and what comes next.</div>
    </aside>
  );
}
