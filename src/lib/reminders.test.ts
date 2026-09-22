import assert from "node:assert/strict";
import test from "node:test";

import { normalizeReminderInput } from "./reminders";

test("accepts a valid reminder payload", () => {
  const input = normalizeReminderInput({
    message: "Follow up with the client",
    scheduledFor: "2026-10-01T09:00:00.000Z",
  });

  assert.equal(input.message, "Follow up with the client");
  assert.equal(input.scheduledFor instanceof Date, true);
});

test("rejects an empty reminder message", () => {
  assert.throws(() => normalizeReminderInput({ message: "   ", scheduledFor: "2026-10-01T09:00:00.000Z" }), /message/i);
});
