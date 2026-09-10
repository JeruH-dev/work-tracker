import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { getDashboardStats } from "@/lib/services/dashboard";

const activities = [
  ["09:42", "Updated the implementation timeline with delivery dependencies."],
  ["Yesterday", "Added a blocker to the Q3 reporting data task."],
  ["Yesterday", "Marked partner onboarding notes as in progress."],
];

const workstreams = [["Programme support", 78], ["Operations", 54], ["Reporting", 42]];

export default async function Home() {
  let stats = { total: 12, inProgress: 5, blocked: 2, completed: 8 };
  try {
    stats = await getDashboardStats();
  } catch {
    // Render the dashboard before a local database is configured.
  }

  return <div className="dashboard-shell"><Sidebar /><main className="main-content">
    <header className="topbar"><div><div className="eyebrow">Wednesday, 09 September 2026</div><h2>Good morning, Gideon</h2><div className="date-label">Here is the shape of your work today.</div></div><div className="user-chip"><div className="avatar">GO</div><span>Gideon O.</span><button className="button-primary">+ New task</button></div></header>
    <section className="stats-grid" aria-label="Work summary">
      <div className="stat-card"><div className="stat-label">Open tasks</div><div className="stat-value">{stats.total - stats.completed}</div><div className="stat-note">Across 4 projects</div></div>
      <div className="stat-card"><div className="stat-label">In progress</div><div className="stat-value">{stats.inProgress}</div><div className="stat-note">Keep the momentum</div></div>
      <div className="stat-card"><div className="stat-label">Blocked</div><div className="stat-value">{stats.blocked}</div><div className="stat-note" style={{ color: "var(--red)" }}>Needs attention</div></div>
      <div className="stat-card"><div className="stat-label">Completed this month</div><div className="stat-value">{stats.completed}</div><div className="stat-note">+18% from last month</div></div>
    </section>
    <div className="dashboard-grid"><div className="panel"><div className="panel-heading"><div className="panel-title">Active work</div><a className="panel-link" href="#">View all tasks →</a></div><TaskList /></div>
      <div className="panel"><div className="panel-heading"><div className="panel-title">Recent activity</div><a className="panel-link" href="#">Activity log →</a></div>{activities.map(([time, text]) => <div className="activity-item" key={time + text}><div className="activity-time">{time}</div><div className="activity-text">{text}</div></div>)}</div>
      <div className="panel"><div className="panel-heading"><div className="panel-title">Workstream pulse</div><span className="date-label">This month</span></div>{workstreams.map(([name, value]) => <div className="workstream-row" key={name}><div className="workstream-head"><span>{name}</span><span>{value}%</span></div><div className="progress-track"><div className="progress-bar" style={{ width: `${value}%` }} /></div></div>)}</div>
      <div className="panel"><div className="panel-heading"><div className="panel-title">Next action</div></div><div style={{ color: "var(--ink-muted)", fontSize: 12, lineHeight: 1.6 }}>Turn today&apos;s evidence into tomorrow&apos;s clarity.</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>Follow up with the reporting team on the data gap.</div><div style={{ color: "var(--green)", fontSize: 11, fontWeight: 600, marginTop: 18 }}>Due today · Programme Reporting</div></div>
    </div>
  </main></div>;
}
