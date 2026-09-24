import { Sidebar } from "@/components/Sidebar";
import { TrendSignals } from "@/components/TrendSignals";
import { getCurrentUser } from "@/lib/auth";
import { getWorkReport, type ReportPeriod } from "@/lib/services/reports";
import { redirect } from "next/navigation";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

const statusLabels: Record<string, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In progress",
  BLOCKED: "Blocked",
  IN_REVIEW: "In review",
  COMPLETED: "Completed",
};

const workstreamLabels: Record<string, string> = {
  PROGRAMME_SUPPORT: "Programme support",
  OPERATIONS: "Operations",
  REPORTING: "Reporting",
  PARTNERSHIPS: "Partnerships",
  PROFESSIONAL_DEVELOPMENT: "Professional development",
  OTHER: "Other",
};

type ReportsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

const periodLabels: Record<ReportPeriod, string> = { day: "Daily", week: "Weekly", month: "Monthly" };

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const params = await Promise.resolve(searchParams ?? {});
  const requestedPeriod = Array.isArray(params.period) ? params.period[0] : params.period;
  const period: ReportPeriod = requestedPeriod === "day" || requestedPeriod === "month" ? requestedPeriod : "week";
  const report = await getWorkReport(user.id, period);
  const periodLabel = periodLabels[period];

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar report-topbar">
          <div>
            <div className="eyebrow">Reporting &amp; analytics</div>
            <h2>{periodLabel} work report</h2>
            <div className="date-label">{formatDate(report.periodStart)} - {formatDate(report.periodEnd)} · A clear view of what moved this {period === "day" ? "day" : period}.</div>
          </div>
          <div className="report-header-actions"><nav className="report-period-tabs" aria-label="Report period">
            {(Object.entries(periodLabels) as [ReportPeriod, string][]).map(([value, label]) => <a className={`report-period-tab${period === value ? " is-active" : ""}`} href={`/reports?period=${value}`} key={value}>{label}</a>)}
          </nav><a className="report-export-button" href={`/api/reports/export?period=${period}`} download>Export CSV</a></div>
        </header>

        <section className="report-metric-grid" aria-label="Weekly totals">
          <div className="report-metric"><span>Completion rate</span><strong>{report.totals.completionRate}%</strong><small>{report.totals.completedTasks} completed this {period === "day" ? "day" : period}</small></div>
          <div className="report-metric"><span>Work completed</span><strong>{report.totals.completedTasks}</strong><small>of {report.totals.totalTasks} total tasks</small></div>
          <div className="report-metric"><span>Time recorded</span><strong>{formatMinutes(report.totals.trackedMinutes)}</strong><small>across your tasks</small></div>
          <div className="report-metric report-metric-alert"><span>Needs attention</span><strong>{report.totals.overdueTasks}</strong><small>{report.totals.openTasks} open tasks overall</small></div>
        </section>

        <div className="report-layout">
          <section className="panel report-panel">
            <div className="panel-heading"><div><div className="panel-title">Workload snapshot</div><div className="report-subtitle">Current task distribution</div></div></div>
            <div className="report-status-list">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = report.statusCounts[status] ?? 0;
                const percentage = report.totals.totalTasks ? Math.round((count / report.totals.totalTasks) * 100) : 0;
                return <div className="report-status-row" key={status}><div className="report-status-label"><span>{label}</span><strong>{count}</strong></div><div className="report-progress-track"><div className={`report-progress-bar report-progress-${status.toLowerCase()}`} style={{ width: `${percentage}%` }} /></div></div>;
              })}
            </div>
          </section>

          <section className="panel report-panel">
            <div className="panel-heading"><div><div className="panel-title">Project momentum</div><div className="report-subtitle">Top active projects</div></div></div>
            {report.projects.length ? <div className="report-project-list">{report.projects.map((project) => <div className="report-project-row" key={project.id}><div className="report-project-heading"><span>{project.name}</span><small>{project.completionRate}% complete</small></div><div className="report-progress-track"><div className="report-progress-bar" style={{ width: `${project.completionRate}%` }} /></div><div className="report-project-stats"><span>{project.completedTasks}/{project._count.tasks} done</span><span className={project.blockedTasks ? "project-risk" : ""}>{project.blockedTasks} blocked</span><span className={project.overdueTasks ? "project-risk" : ""}>{project.overdueTasks} overdue</span></div></div>)}</div> : <p className="empty-state">Projects will appear here as you create them.</p>}
          </section>
        </div>

        <section className="panel report-panel report-workstream-panel">
          <div className="panel-heading"><div><div className="panel-title">Workstream workload</div><div className="report-subtitle">Where your current task volume is concentrated</div></div></div>
          {Object.keys(report.workstreams).length ? <div className="report-workstream-list">{Object.entries(report.workstreams).sort(([, first], [, second]) => second.taskCount - first.taskCount).map(([workstream, summary]) => { const maximum = Math.max(...Object.values(report.workstreams).map((item) => item.taskCount), 1); return <div className="report-workstream-row" key={workstream}><div className="report-workstream-heading"><span>{workstreamLabels[workstream] ?? workstream.replaceAll("_", " ")}</span><strong>{summary.taskCount} tasks</strong></div><div className="report-progress-track"><div className="report-progress-bar" style={{ width: `${(summary.taskCount / maximum) * 100}%` }} /></div><div className="report-workstream-meta"><span>{summary.completedTasks} completed</span><span className={summary.blockedTasks ? "project-risk" : ""}>{summary.blockedTasks} blocked</span></div></div>; })}</div> : <p className="empty-state">Assign tasks to projects to see workload by workstream.</p>}
        </section>

        <TrendSignals periodLabel={periodLabel} completedTasks={report.totals.completedTasks} activityCount={report.totals.activityCount} trackedMinutes={report.totals.trackedMinutes} overdueTasks={report.totals.overdueTasks} previousCompletedTasks={report.comparison.previousCompletedTasks} previousActivities={report.comparison.previousActivities} previousTrackedMinutes={report.comparison.previousTrackedMinutes} previousOverdueTasks={report.comparison.previousOverdueTasks} completedTasksDelta={report.comparison.completedTasksDelta} activityCountDelta={report.comparison.activityCountDelta} trackedMinutesDelta={report.comparison.trackedMinutesDelta} overdueTasksDelta={report.comparison.overdueTasksDelta} completionRateDelta={report.comparison.completionRateDelta} />

        <div className="report-layout report-layout-bottom">
          <section className="panel report-panel"><div className="panel-heading"><div><div className="panel-title">Completed this {period === "day" ? "day" : period}</div><div className="report-subtitle">Outcomes recorded between {formatDate(report.periodStart)} and {formatDate(report.periodEnd)}</div></div></div>{report.completedTasks.length ? <div className="report-completed-list">{report.completedTasks.map((task) => <div className="report-completed-row" key={task.id}><span className="report-check">✓</span><div><strong>{task.title}</strong><small>{task.project?.name ?? "Unassigned project"}</small></div><time>{formatDate(task.updatedAt)}</time></div>)}</div> : <p className="empty-state">Completed work will build your report here.</p>}</section>
          <section className="panel report-panel"><div className="panel-heading"><div><div className="panel-title">Recent activity</div><div className="report-subtitle">The evidence behind your progress</div></div><span className="report-count">{report.totals.activityCount}</span></div>{report.activities.length ? <div className="report-activity-list">{report.activities.map((activity) => <div className="report-activity-row" key={activity.id}><time>{formatDate(activity.occurredAt)}</time><p>{activity.note}</p><small>{activity.task?.title ?? "Workspace activity"}</small></div>)}</div> : <p className="empty-state">Activity notes will appear here as work is recorded.</p>}</section>
        </div>
      </main>
    </div>
  );
}