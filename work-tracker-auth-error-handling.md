# Work Tracker Authentication Error Handling — Implementation Guidance

## Objective

Improve the Work Tracker authentication flow so that:

1. Duplicate registration attempts return a proper client/business error instead of HTTP `500`.
2. Login errors provide useful, structured feedback to the UI.
3. Authentication API responses use predictable status codes and error codes.
4. Email verification and account-status states are handled explicitly.
5. Database-level uniqueness protection remains in place.

---

## 1. Fix the Registration `500` Error

### Current problem

The registration logic currently does something similar to:

```ts
if (existingUser) {
  throw new Error("An account with this email already exists");
}
```

The problem is not the duplicate-email check itself. The API route is allowing this expected application error to bubble up as an HTTP `500`.

A duplicate email is **not a server failure**. It should return:

```text
HTTP 409 Conflict
```

### Recommended API response

When the email already exists:

```json
{
  "success": false,
  "code": "EMAIL_EXISTS",
  "message": "An account with this email already exists."
}
```

with HTTP status:

```text
409
```

### Example registration route

```ts
export async function POST(request: Request) {
  try {
    const input = await request.json();

    const user = await registerUser(input);

    return Response.json(
      {
        success: true,
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      return Response.json(
        {
          success: false,
          code: "EMAIL_EXISTS",
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return Response.json(
      {
        success: false,
        code: "REGISTRATION_FAILED",
        message: "Unable to create your account. Please try again.",
      },
      { status: 500 }
    );
  }
}
```

The frontend can then display:

> An account with this email already exists.

and provide a clear action such as:

> Sign in instead

---

# 2. Use Structured Login Errors

The current UI displays:

> Invalid email or password

for login failures.

Instead of hardcoding one generic error in the frontend, the API should return structured authentication errors.

Recommended states:

| Situation | Code | Suggested UI message |
|---|---|---|
| Email does not exist | `USER_NOT_FOUND` | `No account was found with this email.` |
| Wrong password | `INVALID_PASSWORD` | `The password you entered is incorrect.` |
| Email not verified | `EMAIL_NOT_VERIFIED` | `Please verify your email address before signing in.` |
| Account disabled | `ACCOUNT_DISABLED` | `Your account has been disabled. Please contact an administrator.` |
| Server/database failure | `AUTH_FAILED` | `Something went wrong. Please try again.` |
| Successful login | — | Redirect to dashboard |

---

# 3. Login API Design

The login service should return specific error codes instead of relying only on raw error strings.

Example conceptual type:

```ts
type LoginResult =
  | {
      success: true;
      user: User;
    }
  | {
      success: false;
      code:
        | "USER_NOT_FOUND"
        | "INVALID_PASSWORD"
        | "EMAIL_NOT_VERIFIED"
        | "ACCOUNT_DISABLED";
      message: string;
    };
```

### User lookup

```ts
const user = await prisma.user.findUnique({
  where: {
    email: data.email,
  },
});

if (!user) {
  return {
    success: false,
    code: "USER_NOT_FOUND",
    message: "No account was found with this email.",
  };
}
```

### Password validation

```ts
const passwordValid = await bcrypt.compare(
  data.password,
  user.passwordHash
);

if (!passwordValid) {
  return {
    success: false,
    code: "INVALID_PASSWORD",
    message: "The password you entered is incorrect.",
  };
}
```

### Email verification

```ts
if (!user.emailVerified) {
  return {
    success: false,
    code: "EMAIL_NOT_VERIFIED",
    message: "Please verify your email address before signing in.",
  };
}
```

### Account status

If the database has an account status field, handle disabled/suspended accounts explicitly:

```ts
if (user.status === "DISABLED") {
  return {
    success: false,
    code: "ACCOUNT_DISABLED",
    message: "Your account has been disabled. Please contact an administrator.",
  };
}
```

---

# 4. Login API Response

For example:

```ts
return Response.json(
  {
    success: false,
    code: "INVALID_PASSWORD",
    message: "The password you entered is incorrect.",
  },
  { status: 401 }
);
```

The frontend should consume the API response rather than hardcoding the message:

```ts
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});

const result = await response.json();

if (!response.ok) {
  setError(result.message);
  return;
}
```

---

# 5. Recommended UI Behaviour

## Wrong password

Display:

```text
Email
[ jeruhdixie19@gmail.com ]

Password
[ ••••••••• ]

The password you entered is incorrect.

[              Sign in              ]

Forgot your password?
```

## Email does not exist

Display:

```text
Email
[ jeruhdixie19@gmail.com ]

Password
[ ••••••••• ]

No account was found with this email.
Create an account to get started.

[              Sign in              ]

New to Work Tracker? Create an account
```

## Email not verified

Display:

```text
Email
[ jeruhdixie19@gmail.com ]

Password
[ ••••••••• ]

Please verify your email address before signing in.

Resend verification email

[              Sign in              ]
```

The email-verification state should ideally include a **Resend verification email** action.

---

# 6. Security Consideration: Account Enumeration

There is an important security trade-off.

Showing:

> No account was found with this email.

and:

> The password you entered is incorrect.

allows someone to determine whether an email address has an account. This is called **account enumeration**.

For a public-facing application, the safer approach is to use one generic message for credential failures:

> Invalid email or password.

This should apply to both:

- unknown email
- incorrect password

However, non-credential states can still be handled explicitly, especially:

> Please verify your email address before signing in.

and:

> Your account has been disabled. Please contact an administrator.

For Work Tracker, if the application is primarily internal/organizational, more informative login messages may be acceptable. If the application becomes a public SaaS product, consider reverting credential failures to the generic message.

A reasonable compromise is:

```text
Unable to sign in. Check your email and password.
```

while keeping verification/account-status messages specific.

---

# 7. Database-Level Duplicate Protection

Do not rely only on:

```ts
findUnique()
```

followed by:

```ts
create()
```

There is a race-condition possibility:

```text
Request A → check email → doesn't exist
Request B → check email → doesn't exist

Request A → create user
Request B → create user → UNIQUE constraint error
```

The database should therefore continue enforcing the unique email constraint.

The Prisma schema should have:

```prisma
email String @unique
```

The user creation operation should also handle Prisma's unique constraint error.

Example:

```ts
import { Prisma } from "@prisma/client";

try {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  return user;
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new Error("An account with this email already exists");
  }

  throw error;
}
```

This provides:

- application-level duplicate detection
- database-level uniqueness enforcement
- protection against race conditions

---

# 8. Recommended Authentication Architecture

```text
                    ┌──────────────────┐
                    │   Registration   │
                    └────────┬─────────┘
                             │
                    Validate input
                             │
                    Check email
                             │
                 ┌───────────┴───────────┐
                 │                       │
              Exists?                 New email
                 │                       │
            409 Conflict                 ▼
                 │                 Create account
                 │                       │
                 │                 Send verification
                 │                       │
                 │                       ▼
                 │                Verify email
                 │                       │
                 └──────────────┐        │
                                ▼        ▼
                           Login / Session
                                │
                                ▼
                            Dashboard
```

---

# 9. Standard API Response Structure

Use a consistent response structure across authentication endpoints.

### Error

```json
{
  "success": false,
  "code": "EMAIL_EXISTS",
  "message": "An account with this email already exists."
}
```

### Email not verified

```json
{
  "success": false,
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email address before signing in."
}
```

### Successful registration

```json
{
  "success": true,
  "message": "Account created successfully."
}
```

### Successful login

```json
{
  "success": true,
  "message": "Signed in successfully."
}
```

---

# 10. HTTP Status Code Recommendations

| Scenario | HTTP Status |
|---|---:|
| Successful registration | `201 Created` |
| Successful login | `200 OK` |
| Invalid login credentials | `401 Unauthorized` |
| Email already registered | `409 Conflict` |
| Email not verified | `403 Forbidden` or a project-specific authentication response |
| Account disabled | `403 Forbidden` |
| Validation error | `400 Bad Request` |
| Unexpected server/database error | `500 Internal Server Error` |

Keep the exact status mapping consistent throughout the application.

---

# 11. Implementation Priorities

Implement in this order:

### Priority 1 — Fix duplicate registration

Change:

```text
POST /api/auth/register → 500
```

to:

```text
POST /api/auth/register → 409
```

with:

```json
{
  "success": false,
  "code": "EMAIL_EXISTS",
  "message": "An account with this email already exists."
}
```

### Priority 2 — Standardize authentication responses

Introduce:

```text
success
code
message
```

for authentication API responses.

### Priority 3 — Update login UI

Make the frontend consume:

```ts
result.message
```

instead of hardcoding:

```ts
"Invalid email or password"
```

### Priority 4 — Handle email verification

Support:

- `EMAIL_NOT_VERIFIED`
- resend verification email
- successful verification
- login after verification

### Priority 5 — Handle account status

Support disabled/suspended accounts if the user model contains account-status fields.

### Priority 6 — Preserve database protection

Ensure:

```prisma
email String @unique
```

remains in the Prisma schema and handle Prisma `P2002` errors.

---

# 12. Important Implementation Principle

Do not expose raw backend errors directly to users.

Avoid:

```ts
setError(error.message);
```

for arbitrary server errors.

Prefer controlled API responses:

```ts
setError(result.message);
```

where `result.message` comes from a deliberately defined authentication error response.

Log unexpected technical errors on the server:

```ts
console.error("Authentication error:", error);
```

but show the user a safe message:

```text
Something went wrong. Please try again.
```

---

# Final Recommendation

The core fix for the current issue is:

**Duplicate email → `409 Conflict`, not `500 Internal Server Error`.**

Then restructure authentication around predictable error codes:

```text
EMAIL_EXISTS
USER_NOT_FOUND
INVALID_PASSWORD
EMAIL_NOT_VERIFIED
ACCOUNT_DISABLED
REGISTRATION_FAILED
AUTH_FAILED
```

The frontend should render the server-provided safe message rather than maintaining its own hardcoded authentication error.

This gives the Work Tracker authentication system a cleaner separation:

```text
Database
   ↓
Auth Service
   ↓
Structured API Response
   ↓
Frontend UI
```

and will make the authentication system significantly easier to maintain as features such as password reset, email verification, account management, roles, and admin controls are added.
