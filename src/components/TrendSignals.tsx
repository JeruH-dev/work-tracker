"use client";

import { useState } from "react";

type TrendSignalsProps = {
  periodLabel: string;
  completedTasks: number;
  activityCount: number;
  trackedMinutes: number;
  overdueTasks: number;
  previousCompletedTasks: number;
  previousActivities: number;
  previousTrackedMinutes: number;
  previousOverdueTasks: number;
  completedTasksDelta: number;
  activityCountDelta: number;
  trackedMinutesDelta: number;
  overdueTasksDelta: number;
  completionRateDelta: number;
};

function formatDelta(value: number, suffix = "") {
  if (value === 0) return "No change";
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

function deltaClass(value: number, positiveWhenLower = false) {
  return positiveWhenLower ? (value <= 0 ? "trend-positive" : "trend-negative") : value >= 0 ? "trend-positive" : "trend-negative";
}

export function TrendSignals(props: TrendSignalsProps) {
  const [view, setView] = useState<"signals" | "chart">("signals");
  const max = Math.max(props.completedTasks, props.previousCompletedTasks, props.activityCount, props.previousActivities, 1);
  const chartY = (value: number) => 184 - (value / max) * 140;
  const currentPoints = `72,${chartY(props.completedTasks)} 448,${chartY(props.activityCount)}`;
  const previousPoints = `72,${chartY(props.previousCompletedTasks)} 448,${chartY(props.previousActivities)}`;

  return (
    <section className="panel report-panel report-trend-panel">
      <div className="panel-heading trend-heading">
        <div><div className="panel-title">Trend signals</div><div className="report-subtitle">Compared with the previous {props.periodLabel === "Daily" ? "day" : props.periodLabel.toLowerCase().replace("ly", "")}</div></div>
        <div className="trend-view-switch" role="group" aria-label="Trend view">
          <button className={view === "signals" ? "is-active" : ""} type="button" aria-pressed={view === "signals"} onClick={() => setView("signals")}>Signals</button>
          <button className={view === "chart" ? "is-active" : ""} type="button" aria-pressed={view === "chart"} onClick={() => setView("chart")}>Line chart</button>
        </div>
      </div>
      {view === "signals" ? <div className="report-trend-grid">
        <div className="report-trend-item"><span>Completed tasks</span><strong className={deltaClass(props.completedTasksDelta)}>{formatDelta(props.completedTasksDelta)}</strong></div>
        <div className="report-trend-item"><span>Completion rate</span><strong className={deltaClass(props.completionRateDelta)}>{formatDelta(props.completionRateDelta, " pts")}</strong></div>
        <div className="report-trend-item"><span>Activity recorded</span><strong className={deltaClass(props.activityCountDelta)}>{formatDelta(props.activityCountDelta)}</strong></div>
        <div className="report-trend-item"><span>Time recorded</span><strong className={deltaClass(props.trackedMinutesDelta)}>{formatDelta(props.trackedMinutesDelta, " min")}</strong></div>
        <div className="report-trend-item"><span>Overdue tasks</span><strong className={deltaClass(props.overdueTasksDelta, true)}>{formatDelta(props.overdueTasksDelta)}</strong></div>
      </div> : <div className="trend-chart-view">
        <div className="report-chart-legend"><span><i className="report-chart-key report-chart-key-current" />Current {props.periodLabel.toLowerCase()}</span><span><i className="report-chart-key report-chart-key-previous" />Previous {props.periodLabel.toLowerCase()}</span></div>
        <div className="trend-line-chart">
          <svg viewBox="0 0 520 220" role="img" aria-label="Line chart comparing completed tasks and activity recorded between the current and previous period">
            <line className="trend-axis" x1="52" x2="52" y1="24" y2="190" /><line className="trend-axis" x1="52" x2="482" y1="190" y2="190" />
            <line className="trend-gridline" x1="52" x2="482" y1="48" y2="48" /><line className="trend-gridline" x1="52" x2="482" y1="96" y2="96" /><line className="trend-gridline" x1="52" x2="482" y1="142" y2="142" />
            <polyline className="trend-line trend-line-previous" points={previousPoints} /><polyline className="trend-line trend-line-current" points={currentPoints} />
            <circle className="trend-point trend-point-previous" cx="72" cy={chartY(props.previousCompletedTasks)} r="4" /><circle className="trend-point trend-point-previous" cx="448" cy={chartY(props.previousActivities)} r="4" />
            <circle className="trend-point trend-point-current" cx="72" cy={chartY(props.completedTasks)} r="5" /><circle className="trend-point trend-point-current" cx="448" cy={chartY(props.activityCount)} r="5" />
            <text className="trend-axis-label" x="72" y="211">Completed</text><text className="trend-axis-label" x="448" y="211" textAnchor="end">Activity</text>
          </svg>
          <div className="trend-chart-note">Values are plotted on a shared scale to show movement between the two work signals.</div>
        </div>
      </div>}
    </section>
  );
}
