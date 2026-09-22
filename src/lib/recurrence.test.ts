import assert from "node:assert/strict";
import test from "node:test";

import { normalizeTaskPayload } from "./recurrence";

test("removes empty optional values and clears recurrence when disabled", () => {
  assert.deepEqual(
    normalizeTaskPayload({
      title: "Follow up",
      projectId: "",
      dueDate: "",
      recurrenceRule: "NONE",
      recurrenceEndDate: "2026-09-25",
    }),
    {
      title: "Follow up",
    },
  );
});

test("keeps recurrence end date when a recurring pattern is selected", () => {
  assert.deepEqual(
    normalizeTaskPayload({
      title: "Weekly review",
      dueDate: "2026-09-24",
      recurrenceRule: "WEEKLY",
      recurrenceEndDate: "2026-10-08",
    }),
    {
      title: "Weekly review",
      dueDate: "2026-09-24",
      recurrenceRule: "WEEKLY",
      recurrenceEndDate: "2026-10-08",
    },
  );
});
