import assert from "node:assert/strict";
import test from "node:test";

import { validateTaskDependency } from "./dependencies";

test("allows a task to depend on another task", () => {
  assert.equal(validateTaskDependency("task-1", "task-2"), "task-2");
});

test("rejects a task that depends on itself", () => {
  assert.throws(() => validateTaskDependency("task-1", "task-1"), /cannot depend on itself/i);
});
