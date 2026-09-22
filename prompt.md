# Work-Tracker Authentication Implementation

You are working on an existing **Work-Tracker** application built with **Next.js, TypeScript, Prisma, and PostgreSQL**.

Implement a complete, secure, production-oriented **user signup, email verification, login, session management, logout, and protected-route authentication system**.

First inspect the project and report the current architecture. Do not modify files yet.

Proceed with Phase 1: database/authentication schema only. Do not implement the UI or email service yet.

## 1. First: Inspect the Existing Project

Before modifying anything:

* Inspect the existing project structure.
* Inspect `package.json`.
* Inspect `prisma/schema.prisma`.
* Inspect `prisma.config.ts`.
* Inspect existing authentication-related files, if any.
* Inspect existing routes, layouts, components, styling system, and UI conventions.
* Inspect the existing database configuration and `DATABASE_URL` usage.
* Identify the Next.js version and whether the project uses App Router or Pages Router.
* Identify the existing CSS/UI framework and follow the project's current design system.

**Do not replace or restructure existing functionality unnecessarily.**

Reuse existing components, utilities, conventions, and dependencies where appropriate.

---

# 2. Authentication Architecture

Implement authentication using the following flow:

```text
SIGN UP
   ↓
Validate user information
   ↓
Hash password securely
   ↓
Create unverified user
   ↓
Generate secure email-verification token
   ↓
Send verification email
   ↓
User clicks verification link
   ↓
Verify email
   ↓
Account becomes verified
   ↓
LOGIN
   ↓
Create authenticated session
   ↓
Protected Dashboard
```

Also support:

```text
LOGIN
   ↓
Validate credentials
   ↓
Check email verification
   ↓
Create session
   ↓
Redirect to dashboard
```

And:

```text
LOGOUT
   ↓
Invalidate session
   ↓
Redirect to login
```

---

# 3. Database Design

Use Prisma with PostgreSQL.

Preserve the existing `User`, `Project`, `Task`, and `Activity` relationships.

Extend the authentication architecture using a separate verification-token model rather than storing verification tokens directly on the `User` record.

The user model should support:

* ID
* Name
* Email
* Password hash
* Email verification status
* Created timestamp
* Existing relationships

Use a structure similar to:

```prisma
model User {
  id                   String              @id @default(cuid())
  name                 String
  email                String              @unique
  passwordHash         String
  emailVerified        Boolean             @default(false)
  createdAt            DateTime            @default(now())

  activities           Activity[]
  projects             Project[]
  tasks                Task[]
  verificationTokens   VerificationToken[]
}
```

Create a separate verification-token model:

```prisma
model VerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

Adapt the exact schema to the existing project where necessary.

Do not blindly overwrite the existing schema.

After modifying the schema:

* Generate the appropriate Prisma migration.
* Apply the migration to the development database.
* Run `prisma generate`.
* Verify that the existing Project, Task, and Activity relationships remain intact.

---

# 4. Signup

Create a professional signup interface.

Required fields:

* Full name
* Email
* Password
* Confirm password

Requirements:

* Validate all fields.
* Normalize email addresses where appropriate.
* Reject invalid email addresses.
* Require a sufficiently strong password.
* Confirm that passwords match.
* Prevent duplicate email registration.
* Never store plaintext passwords.
* Hash passwords using a secure password-hashing algorithm such as Argon2id or bcrypt.
* Create users with `emailVerified = false`.
* Generate a cryptographically secure verification token.
* Give the token an expiration time.
* Send a verification email.
* Do not automatically authenticate an unverified account unless there is a deliberate security reason.

Display clear user-friendly validation errors.

Do not expose sensitive database or authentication errors to the user.

---

# 5. Email Verification

Implement email verification using a transactional email provider.

Use an environment-variable-based configuration rather than hardcoding credentials.

Preferred provider:

**Resend**

Create an email utility/service that handles verification emails.

Use environment variables similar to:

```env
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=
```

Do not commit API keys or secrets to Git.

The verification email should contain:

* Work-Tracker branding
* User's name
* Clear explanation that the account needs to be verified
* Verification button/link
* Expiration information
* Fallback plain-text verification URL where appropriate

The verification URL should use a secure token.

Example:

```text
https://your-domain.com/verify-email?token=...
```

When the user opens the link:

1. Validate the token.
2. Check whether it exists.
3. Check whether it has expired.
4. Identify the associated user.
5. Mark the user's email as verified.
6. Invalidate/delete the token.
7. Redirect the user to the login page or dashboard as appropriate.

Expired or invalid tokens must produce a clear, non-sensitive error message.

---

# 6. Resend Verification Email

Provide a "Resend verification email" capability.

Requirements:

* Accept the user's email.
* Do not reveal whether an account exists in a way that enables account enumeration.
* Generate a new secure token.
* Expire or invalidate previous verification tokens where appropriate.
* Send a new verification email.
* Implement reasonable rate limiting or cooldown protection.

---

# 7. Login

Create a professional login interface.

Fields:

* Email
* Password

Authentication requirements:

* Validate credentials securely.
* Retrieve the user using Prisma.
* Compare the supplied password against the stored password hash.
* Reject incorrect credentials using a generic error message.
* Check `emailVerified`.
* Prevent unverified accounts from accessing protected application areas.
* Create a secure authenticated session after successful login.
* Redirect authenticated users to the appropriate dashboard.

Do not expose whether an email exists in the database through overly specific error messages.

---

# 8. Session Management

Implement secure session-based authentication.

Sessions must:

* Be securely stored.
* Use HTTP-only cookies where applicable.
* Use appropriate `Secure` and `SameSite` settings.
* Have an appropriate expiration period.
* Be invalidated on logout.
* Be validated on protected server-side requests.

Use the authentication approach that best fits the existing Next.js architecture.

If an authentication library is already installed, evaluate whether it should be used rather than introducing a second authentication system.

Do not install unnecessary authentication libraries without first checking the existing dependencies.

---

# 9. Protected Routes

Protect authenticated application routes.

Unauthenticated users attempting to access the dashboard or protected application pages should be redirected to:

```text
/login
```

Authenticated users should be prevented from unnecessarily accessing authentication pages such as:

```text
/login
/signup
```

unless the existing application architecture requires otherwise.

Server-side authorization must be enforced.

Do not rely solely on client-side route protection.

---

# 10. Logout

Implement logout functionality.

Logout should:

* Invalidate the active session.
* Clear the authentication cookie/session.
* Redirect the user to `/login`.

Add the logout action to the appropriate application navigation.

---

# 11. UI/UX

Use the existing Work-Tracker design language.

The authentication screens should be:

* Clean
* Professional
* Responsive
* Accessible
* Consistent with the existing application
* Appropriate for an internal professional work-management platform

Create appropriate states for:

* Loading
* Validation errors
* Authentication errors
* Email sent
* Email verification success
* Expired verification link
* Invalid verification link
* Already verified account
* Resend verification
* Logout

Do not introduce an unrelated visual design system.

---

# 12. Security Requirements

Follow secure authentication practices.

Specifically:

* Never store plaintext passwords.
* Never expose passwords or password hashes to the client.
* Never hardcode API keys or secrets.
* Never commit `.env` secrets.
* Use cryptographically secure random verification tokens.
* Store only what is necessary.
* Expire verification tokens.
* Invalidate tokens after successful verification.
* Prevent authentication-related account enumeration where practical.
* Validate all user input server-side.
* Use parameterized/database-safe queries through Prisma.
* Protect authentication endpoints from abuse/rate-limit where appropriate.
* Use secure cookies for sessions.
* Ensure protected data is only accessible to authenticated users.

---

# 13. Environment Configuration

Update `.env.example` with placeholders only.

Example:

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
EMAIL_FROM=
```

Never put actual secrets in `.env.example`.

Ensure `.env` remains ignored by Git.

---

# 14. Error Handling

Implement centralized or reusable error handling where appropriate.

User-facing errors should be understandable.

Avoid exposing:

* Database errors
* Stack traces
* Password information
* Internal implementation details
* Authentication secrets

Log useful server-side diagnostic information without exposing sensitive data.

---

# 15. Validation

After implementation:

Run appropriate checks such as:

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

```bash
npm run lint
```

and, if available:

```bash
npm run build
```

Fix all TypeScript, Prisma, linting, and build errors introduced by the implementation.

Verify that:

1. A new user can sign up.
2. Passwords are securely hashed.
3. The user initially has `emailVerified = false`.
4. A verification email is generated/sent.
5. The verification link works.
6. The verification token expires correctly.
7. A verified user can log in.
8. An unverified user cannot access protected routes.
9. An authenticated user can access the dashboard.
10. Logout invalidates the session.
11. Existing Project, Task, and Activity functionality remains intact.

---

# 16. Implementation Rules

Work incrementally.

Before making major changes, inspect the existing implementation and explain briefly what you found.

Prefer modifying existing files over creating unnecessary duplicates.

Do not:

* Replace the entire project.
* Rewrite unrelated components.
* Remove existing functionality.
* Change the database schema unnecessarily.
* Introduce multiple competing authentication systems.
* Hardcode credentials.
* Create mock authentication when real PostgreSQL authentication is available.

At the end, provide a concise implementation summary containing:

* Files created
* Files modified
* Packages added
* Database schema changes
* Environment variables required
* Commands executed
* Any remaining configuration required
* Any security considerations
* How to test signup, verification, login, and logout locally

Implement the authentication system now, starting with inspection of the existing codebase before making changes.
