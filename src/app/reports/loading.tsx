import { Sidebar } from "@/components/Sidebar";

export default function ReportsLoading() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content report-loading" aria-label="Loading weekly report">
        <div className="report-skeleton-heading"><span /><span /></div>
        <div className="report-skeleton-metrics"><span /><span /><span /><span /></div>
        <div className="report-skeleton-layout"><span /><span /></div>
        <div className="report-skeleton-layout"><span /><span /></div>
      </main>
    </div>
  );
}