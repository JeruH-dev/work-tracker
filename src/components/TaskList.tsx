type Task = { title: string; project: string; status: string; tone: "green" | "amber" | "red" };

const tasks: Task[] = [
  { title: "Compile partner onboarding notes", project: "Community Partnerships", status: "In progress", tone: "green" },
  { title: "Resolve Q3 reporting data gap", project: "Programme Reporting", status: "Blocked", tone: "red" },
  { title: "Review implementation timeline", project: "Delivery Operations", status: "In review", tone: "amber" },
  { title: "Prepare steering group brief", project: "Programme Support", status: "In progress", tone: "green" },
];

export function TaskList() {
  return <div>{tasks.map((task) => <div className="task-row" key={task.title}><span className={`task-dot ${task.tone}`} /><div><div className="task-name">{task.title}</div><div className="task-meta">{task.project}</div></div><span className={`task-status status-${task.tone === "green" ? "progress" : task.tone === "red" ? "blocked" : "review"}`}>{task.status}</span></div>)}</div>;
}
