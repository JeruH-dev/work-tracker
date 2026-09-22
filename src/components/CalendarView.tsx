"use client";

import { useState } from "react";

type Status = "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "COMPLETED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type CalendarTask = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  project: { name: string } | null;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const statusLabels: Record<Status, string> = { BACKLOG: "Backlog", IN_PROGRESS: "In progress", BLOCKED: "Blocked", IN_REVIEW: "In review", COMPLETED: "Completed" };

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfCalendar(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
}

export function CalendarView({ tasks }: { tasks: CalendarTask[] }) {
  const [month, setMonth] = useState(() => new Date());
  const todayKey = dateKey(new Date());
  const calendarStart = startOfCalendar(month);
  const days = Array.from({ length: 42 }, (_, index) => new Date(calendarStart.getFullYear(), calendarStart.getMonth(), calendarStart.getDate() + index));
  const monthLabel = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function moveMonth(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  function tasksForDay(day: Date) {
    return tasks.filter((task) => task.dueDate && dateKey(new Date(task.dueDate)) === dateKey(day));
  }

  const undatedTasks = tasks.filter((task) => !task.dueDate);

  return (
    <section aria-label="Task calendar">
      <div className="calendar-toolbar"><div className="calendar-month">{monthLabel}</div><div className="calendar-controls"><button className="button-quiet" onClick={() => moveMonth(-1)} type="button" aria-label="Previous month">←</button><button className="button-quiet" onClick={() => setMonth(new Date())} type="button">Today</button><button className="button-quiet" onClick={() => moveMonth(1)} type="button" aria-label="Next month">→</button></div></div>
      <div className="calendar-grid calendar-weekdays">{weekdayLabels.map((label) => <div key={label}>{label}</div>)}</div>
      <div className="calendar-grid calendar-days">
        {days.map((day) => {
          const dayTasks = tasksForDay(day);
          const inMonth = day.getMonth() === month.getMonth();
          return <div className={`calendar-day${inMonth ? "" : " is-outside"}`} key={dateKey(day)}><div className={`calendar-day-number${dateKey(day) === todayKey ? " is-today" : ""}`}>{day.getDate()}</div><div className="calendar-day-tasks">{dayTasks.map((task) => <div className={`calendar-task task-${task.status.toLowerCase()}`} key={task.id} title={`${task.title} - ${statusLabels[task.status]}`}><span>{task.title}</span></div>)}</div></div>;
        })}
      </div>
      {undatedTasks.length > 0 && <div className="undated-tasks"><div className="panel-title">No due date</div><div className="undated-list">{undatedTasks.map((task) => <div className="undated-task" key={task.id}><span>{task.title}</span><span className="task-meta">{task.project?.name ?? "No project"}</span></div>)}</div></div>}
    </section>
  );
}
