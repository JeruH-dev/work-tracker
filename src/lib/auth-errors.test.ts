import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createAuthError, createAuthSuccess } from "./auth-errors";

describe("auth error helpers", () => {
  it("creates a duplicate-registration auth payload", () => {
    const payload = createAuthError("EMAIL_EXISTS", "An account with this email already exists.");

    assert.deepEqual(payload, {
      success: false,
      code: "EMAIL_EXISTS",
      message: "An account with this email already exists.",
    });
  });

  it("creates a successful auth payload", () => {
    const payload = createAuthSuccess("Signed in successfully.");

    assert.deepEqual(payload, {
      success: true,
      message: "Signed in successfully.",
    });
  });
});
