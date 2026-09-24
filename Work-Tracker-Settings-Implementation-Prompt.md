# Work Tracker — Settings & Accessibility Implementation Prompt

## Role

Act as a senior full-stack developer and UI/UX engineer working inside the existing **Work Tracker** codebase.

Implement a professional, accessible, maintainable **Settings experience** based on the existing application's design system and architecture.

Do not rebuild or unnecessarily refactor unrelated parts of the application.

---

# 1. Existing Dashboard UI — Preserve the Design Language

The current Work Tracker dashboard has:

- A dark forest/teal-green fixed sidebar.
- Work Tracker branding at the top of the sidebar.
- Main navigation: Dashboard, My tasks, Task board, Calendar, Projects, Activity log.
- Reports: Report, Archive.
- A light gray/off-white main dashboard background.
- White content cards with subtle borders.
- Rounded cards and buttons.
- Green as the primary action/brand colour.
- Clean, modern productivity-app styling.

The Settings implementation must visually belong to this existing application. Do not introduce a completely different visual language.

---

# 2. Sidebar — Add Settings at the Bottom

Add a **Settings** menu item at the bottom of the sidebar.

Recommended structure:

```text
WORKSPACE
  Dashboard
  My tasks
  Task board
  Calendar
  Projects
  Activity log

REPORTS
  Report
  Archive

────────────────────
⚙  Settings
👤  Gideon
```

Requirements:

- Settings remains visually pinned to the bottom of the sidebar.
- It must not move with dashboard content scrolling.
- The sidebar itself remains stationary while the main dashboard/content area scrolls.
- Preserve existing sidebar styling and use the project's existing icon library/components.
- Do not hard-code the user's name; use authenticated user data.
- The profile area may contain account actions such as profile, security, and sign out.
- Settings has a clear active state.

---

# 3. Settings Page Architecture

Create a dedicated Settings page rather than putting every configuration option in the sidebar.

Use a two-column settings layout:

```text
Settings

┌─────────────────┬────────────────────────────────────┐
│ Account         │ Account                            │
│ Appearance      │ Manage your personal details      │
│ Accessibility   │ and account preferences.          │
│ Notifications   │                                    │
│ Tasks           │ [ Settings content ]               │
│ Calendar        │                                    │
│ Projects        │                                    │
│ Data & Privacy  │                                    │
│ Security        │                                    │
│ Integrations    │                                    │
│ About           │                                    │
└─────────────────┴────────────────────────────────────┘
```

Requirements:

- Responsive layout.
- Desktop: left settings navigation + right content panel.
- Tablet/mobile: stacked or select-based navigation.
- Clearly indicate the active section.
- Use reusable components.
- Preserve accessibility semantics.
- Prefer URL-based settings sections if compatible with current routing, e.g. `/settings`, `/settings/appearance`, etc.
- Follow existing routing conventions if different.

---

# 4. Account

Support:

### Profile

- Full name
- Email address
- Profile/avatar
- Job title
- Organisation
- Time zone
- Date format

### Account actions

- Change email
- Change password
- Email verification status
- Delete account

Use the existing authentication/database implementation. Do not create a second authentication system. Reuse existing validation and security patterns. Sensitive changes require appropriate confirmation.

---

# 5. Appearance

Provide:

```text
APPEARANCE

Theme
○ Light
○ Dark
● System default

Accent colour
Default [ Green ]


Sidebar
☑ Remember sidebar state [to be toggled on/off]

Density
○ Comfortable
○ Compact
```

Implement where practical:

- Light / dark / system theme
- Existing green brand/accent colour
- Future-ready accent-colour architecture
- Remember sidebar collapsed/expanded state
- Comfortable/compact interface density

Persist preferences appropriately. Respect OS theme when System is selected. Maintain adequate contrast.

---

# 6. Accessibility

Create a dedicated Accessibility section:

```text
ACCESSIBILITY

Text size
○ Small
● Default
○ Large
○ Extra large

☑ Reduce animations
☑ Increase contrast
☐ Always show task status labels
☐ Highlight keyboard focus
☐ Use larger click targets

Motion
☑ Respect system motion preferences
```

Implement where practical:

- Scalable text size using CSS rather than per-element overrides.
- Reduced motion and `prefers-reduced-motion`.
- Increased contrast mode.
- Visible keyboard focus.
- Larger interactive targets.
- Never communicate task state through colour alone.

Prefer status labels such as `Completed`, `In Progress`, and `Blocked` alongside visual indicators.

Follow practical WCAG principles: semantic HTML, keyboard navigation, visible focus, adequate contrast, proper labels, accessible errors/status messages, logical headings, and ARIA only where necessary.

---

# 7. Notifications

Create notification preferences:

```text
NOTIFICATIONS

Email notifications
☑ Task reminders
☑ Task assignments
☐ Weekly work summary
☐ Project updates

In-app notifications
☑ Task reminders
☑ Due-date warnings

Reminder timing
[ 1 day before ▼ ]
```

Potential categories:

- Task due reminders
- Overdue task notifications
- Project deadlines
- Recurring-task reminders
- Weekly productivity summaries

Only implement functionality supported by the existing architecture. Do not build unnecessary external notification infrastructure.

---

# 8. Tasks & Workflow

Create task preferences:

```text
TASKS & WORKFLOW

Default task status
[ Not started ▼ ]

Default priority
[ Medium ▼ ]

Default view
[ My tasks ▼ ]

Task behaviour
☑ Confirm before deleting
☑ Show completed tasks
☑ Automatically archive completed tasks

Due dates
☑ Warn me about overdue tasks
```

Potential values:

- Status: Not started, In progress, Blocked, Completed
- Priority: Low, Medium, High, Urgent
- Default view: List, Board, Calendar
- Completed-task behaviour: Keep visible, Hide after completion, Archive automatically

Reuse existing task enums/models. Do not create duplicates. If a setting requires backend support that does not exist, implement it properly or document it as future work rather than creating unsafe shortcuts.

---

# 9. Calendar

Create calendar preferences:

```text
CALENDAR

Week starts on
[ Monday ▼ ]

Time format
● 12-hour
○ 24-hour

Default calendar view
[ Month ▼ ]

Working hours
09:00 ───── 17:00

☑ Show weekends
☑ Show completed tasks
```

Support week start, time format, default view, working hours, weekend visibility, and completed-task visibility.

Use `Africa/Lagos (WAT, UTC+1)` as an appropriate default only if the application does not already detect/store a user timezone. Do not force it over an existing user preference.

---

# 10. Projects

Create project preferences:

```text
PROJECTS

Default project view
[ Overview ▼ ]

Project colours
☑ Enable project colours

Completed projects
○ Keep visible
● Move to archive

☑ Show project progress
```

Implement only settings compatible with the current project model.

---

# 11. Data & Privacy

Create:

```text
DATA & PRIVACY

Your data

Export data
[ Export JSON ]

Export tasks
[ Export CSV ]

Privacy
☑ Keep activity history

Danger zone

Delete all completed tasks
Delete account
```

Strongly prefer implementing secure, user-scoped export where the backend supports it.

At minimum consider JSON and CSV; future options can include Excel and PDF reports.

Destructive actions require explicit confirmation. Account deletion must use a clear danger-zone UI.

---

# 12. Security

Create:

```text
SECURITY

Password
Change password

Two-factor authentication
[ Set up ]

Sessions
Current device
Windows · Chrome
Active now

[ Sign out all other sessions ]
```

Potential features:

- Change password
- 2FA
- Active sessions
- Sign out other sessions
- Email verification
- Login/security history
- Password reset

Reuse the existing authentication implementation. Never expose passwords, tokens, or session secrets. If 2FA/session management is not supported, do not fake the flow.

---

# 13. Integrations

Include an integrations section, but do not overbuild it:

```text
INTEGRATIONS

Google Calendar
[ Connect ]

Microsoft Outlook
[ Connect ]

Google Drive
[ Connect ]

GitHub
[ Connect ]
```

Potential future use cases include calendar synchronization, Drive/document linking, and GitHub issue → Work Tracker task workflows.

For the current MVP, integrations may be marked Coming Soon/disabled. Do not create fake connection flows.

---

# 14. Keyboard Shortcuts

Support keyboard accessibility and shortcuts:

```text
KEYBOARD SHORTCUTS

N       New task
D       Dashboard
T       My tasks
B       Task board
C       Calendar
P       Projects
S       Settings
/       Search
Esc     Close dialog
?       Show keyboard shortcuts
```

Avoid triggering global shortcuts while typing in input, textarea, or contenteditable fields. Provide a discoverable shortcuts/help dialog.

---

# 15. About

Create:

```text
ABOUT

Work Tracker
Version 1.0.0

Documentation
Keyboard shortcuts
Report a problem
Feedback
Privacy Policy
Terms of Service
```

Use the actual application/package version where possible rather than duplicating a hard-coded version.

---

# 16. Implementation Priorities

### Phase 1 — Implement now

1. Profile
2. Change password
3. Appearance
4. Accessibility
5. Notification preferences
6. Task preferences
7. Calendar preferences
8. Data export
9. Supported security/session functionality
10. About

### Phase 2

1. Integrations framework
2. Keyboard shortcut customization
3. Custom accent colours
4. Custom working hours
5. Advanced task behaviour
6. Notification schedules

### Phase 3

1. Google Calendar integration
2. Microsoft Outlook integration
3. GitHub integration
4. Automated backups
5. Advanced reporting preferences
6. Import/export between systems

Prioritize working functionality over placeholder complexity.

---

# 17. UX Requirements

The Settings experience should feel like a modern SaaS productivity application.

Use:

- Clear section headings
- Short descriptions
- Grouped settings
- Consistent spacing
- Familiar controls
- Switches for binary preferences
- Radio buttons for single-choice options
- Select controls for predefined values
- Buttons for actions
- Danger-zone styling for destructive actions
- Confirmation dialogs
- Success/error feedback
- Loading states
- Disabled states during processing

Avoid:

- Excessive decoration
- Huge forms
- Unnecessary modals
- Deeply nested navigation
- Settings that do nothing
- Fake integration buttons
- Colour-only status indicators
- Hard-coded user data

---

# 18. Responsive Design

Support desktop, laptop, tablet, and mobile.

Desktop:

```text
Sidebar | Settings navigation | Settings content
```

Mobile:

```text
Settings
[ Select settings section ▼ ]

Settings content
```

Prevent horizontal overflow. Keep controls usable on touch devices.

---

# 19. Persistence

Determine storage based on preference type.

User-specific/server settings such as name, timezone, notification preferences, task preferences, and calendar preferences should preferably use the authenticated user's database settings.

UI-only preferences such as sidebar state may use local storage where appropriate.

Never store sensitive security data in localStorage.

If a user-preferences model is missing, consider a clean Prisma `UserSettings` model or equivalent that fits the existing schema.

Before schema changes:

1. Inspect the current Prisma schema.
2. Reuse existing fields/models where possible.
3. Avoid duplicate preference storage.
4. Create a migration.
5. Update server-side validation.
6. Update API/server actions.
7. Update the UI.
8. Test persistence after refresh and login.

---

# 20. Security Requirements

All settings operations must be authorized server-side.

Never trust:

- Browser-supplied user IDs
- Hidden form fields
- Client-side permissions
- Local storage for authorization

Use this flow:

```text
Authenticated user
        ↓
Server-side authorization
        ↓
Validate input
        ↓
Perform database operation
        ↓
Return safe response
```

Use existing conventions for authentication, authorization, Prisma, server actions/API routes, validation, and error handling.

---

# 21. Accessibility Testing Checklist

Before completion verify:

- [ ] Settings can be opened using keyboard navigation.
- [ ] Every interactive element has an accessible name.
- [ ] Keyboard focus is clearly visible.
- [ ] Tab order is logical.
- [ ] Escape closes dialogs where appropriate.
- [ ] Form controls have labels.
- [ ] Errors are understandable.
- [ ] Success messages are accessible.
- [ ] Status is not communicated by colour alone.
- [ ] Dark mode maintains adequate contrast.
- [ ] Increased contrast mode works.
- [ ] Reduced-motion mode works.
- [ ] Text scaling does not break layout.
- [ ] Mobile controls are sufficiently large.
- [ ] No horizontal scrolling occurs at normal mobile widths.
- [ ] Screen-reader users can understand section hierarchy.

---

# 22. Technical Implementation Process

Before writing code:

1. Inspect the existing project structure.
2. Inspect the current sidebar component.
3. Inspect dashboard layout and scrolling behaviour.
4. Inspect authentication implementation.
5. Inspect Prisma schema.
6. Inspect existing user model.
7. Inspect existing task/project/calendar models.
8. Inspect existing design tokens/global CSS.
9. Inspect existing icon/component libraries.
10. Identify reusable components before creating new ones.

Then implement Settings using the existing architecture.

Do not unnecessarily replace existing authentication, layout, CSS architecture, component library, task models, or routing patterns.

---

# 23. Component Recommendations

Prefer reusable components such as:

```text
SettingsLayout
SettingsSidebar
SettingsSection
SettingsCard
SettingsRow
SettingsToggle
SettingsSelect
SettingsRadioGroup
SettingsInput
SettingsAction
DangerZone
ConfirmationDialog
KeyboardShortcutsDialog
```

Reuse existing equivalent components instead of duplicating UI primitives.

---

# 24. Save Behaviour

For simple toggles, prefer immediate save if consistent with existing UX and show a subtle saving/saved state.

For forms:

```text
[ Cancel ] [ Save changes ]
```

After saving:

```text
✓ Changes saved
```

Handle loading, validation failure, network/server error, and successful updates. Do not silently fail.

---

# 25. Final Sidebar Target

The intended sidebar should approximately look like:

```text
┌────────────────────────┐
│ [favico icon / app logo]         │
│ Work Tracker           │
│                        │
│ WORKSPACE              │
│  Dashboard             │
│  My tasks              │
│  Task board             │
│  Calendar              │
│  Projects              │
│  Activity log          │
│                        │
│ REPORTS                │
│  Report                │
│  Archive               │
│                        │
│                        │
│                        │
│────────────────────────│
│  ⚙ Settings            │
│  👤 Gideon              │
└────────────────────────┘
```

The sidebar must remain fixed/stationary while main content scrolls.

---

# 26. Definition of Done

The implementation is complete when:

- [ ] Settings appears at the bottom of the sidebar.
- [ ] Sidebar remains fixed while dashboard/settings content scrolls.
- [ ] Settings has a dedicated responsive layout.
- [ ] Account settings work with the existing authenticated user.
- [ ] Appearance preferences work.
- [ ] Accessibility preferences work.
- [ ] Task preferences connect to the existing task architecture where supported.
- [ ] Calendar preferences connect where supported.
- [ ] Notification preferences connect where supported.
- [ ] Data export is secure and user-scoped where implemented.
- [ ] Security settings use the existing authentication architecture.
- [ ] Destructive actions have confirmation.
- [ ] Keyboard navigation works.
- [ ] Responsive design works.
- [ ] Dark/light/system theme behaviour is correct if implemented.
- [ ] Reduced motion is respected.
- [ ] Colour is not the sole indicator of task status.
- [ ] Settings survive refresh where persistence is expected.
- [ ] No existing dashboard functionality is broken.
- [ ] No unnecessary dependencies are introduced.
- [ ] Database migrations are created correctly if schema changes are required.
- [ ] TypeScript/build/lint checks pass.
- [ ] Existing routes continue to work.
- [ ] The implementation matches the existing Work Tracker visual language.

---

# Important Instruction to the Coding Agent

**Inspect first, then implement.**

Do not blindly create files or database models based only on this prompt.

Use the existing Work Tracker codebase as the source of truth for:

- Component architecture
- Routing
- Authentication
- Database schema
- Styling
- Icons
- API/server actions
- Validation
- Error handling
- Existing task/project/calendar behaviour

Make the smallest clean architectural changes necessary to deliver the Settings system.

Where a requested feature is not currently supported by the backend, do not fake functionality. Either implement the required backend support properly or clearly identify it as future/placeholder work.

After implementation, run appropriate checks and report:

1. Files created/modified.
2. Database/schema changes.
3. New routes.
4. New components.
5. Features implemented.
6. Features intentionally left as future work.
7. Validation/build/lint/test results.
8. Migration or environment-variable requirements.
