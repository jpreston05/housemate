# Project Map

## Purpose
Housemate: a hub for managing a shared house. It keeps housemates accountable for chores and events and holds shared information in one place. It replaces a group chat and a kitchen whiteboard.

## Requirements
(From the learner, 2026-11-16)
- One person creates a house and becomes its admin, then invites others to join.
- Admins can make other members admins.
- Chores and events, with built-in reminders and checklists so people stay accountable.
- Anonymous "nudges": predefined messages (e.g. "don't forget to turn the lights off") that any member can send without revealing who sent them.
- Secure storage of shared secrets (e.g. the Wi-Fi password).
- Shared document uploads (e.g. rental agreements, bills) that every member can view.
- Out of scope: money management or bill splitting (not a Splitwise clone). Payments/subscriptions are a possible distant-future direction.
- Constraint: a small personal project, so keep costs low.

## Components
All CHOSEN (confirmed 2026-11-16). Nothing implemented yet.
- Frontend: web app / PWA added to the home screen; no native apps. Next.js (App Router, TypeScript) hosted on Vercel's free Hobby plan (non-commercial only). Next.js handles the UI, routing and session only: no secret keys, no rule enforcement. (Confirmed 2026-11-16.) Approved AI additions: TypeScript, App Router, @supabase/ssr.
- Supabase: Postgres + auth + file storage. Access enforced with Row Level Security. (Learner's reasons: free, previously used.) ALL trusted logic lives in Supabase (learner's reason: security logic isn't split between two places).
- Edge Function "send nudge": checks the sender's daily limit, increments a count the app can never read, and inserts the nudge. Browsers cannot insert nudges directly.
- Scheduled reminder job (server-side, e.g. pg_cron / Edge Function) that sends Web Push. Details to be designed in the reminders slice.
- Approved AI additions: store push subscriptions per user/device; store times in UTC plus the house's timezone.

## Slice 1: houses, members, invites (CHOSEN, confirmed 2026-11-16; schema not implemented yet)
- Learner's decisions: the creator automatically becomes admin; a memberships join table (user, house, role member/admin); a join_requests table; only admins create invite codes; admins approve join requests; code/QR invites only for the MVP (email later).
- Approved AI additions: invite code stored on the house and regenerable by admins; join_requests fields (house, user, status pending/approved/declined, created_at); Postgres functions create_house and approve_join_request (atomic + permission-checked); Tailwind for styling.

## Implemented
- Step 1 (2026-11-16): Next.js 16.4 scaffold (TypeScript, App Router, Tailwind, ESLint, src/ dir), git init (no commits). @supabase/supabase-js + @supabase/ssr installed.
  - src/lib/supabase/client.ts: browser client (publishable key)
  - src/lib/supabase/server.ts: server client reading session cookies
  - .env.local.example: required env var names; .gitignore un-ignores this example file
  - Session-refresh proxy (proxy.ts, formerly middleware) not added yet; it comes with auth.

## MVP build order (chosen)
1. Houses + invites + admin roles
2. Nudges (whole house only)
3. Chore reminders
Post-MVP: private nudges, events, secrets, documents.

## Main Flow
Phone (PWA) --reads/writes via RLS--> Supabase Postgres
Phone --send nudge--> Edge Function --limit check + insert--> nudges table
Scheduler --every N min, query due reminders--> Web Push service --> device service worker --> notification
Invite flow: not designed yet.

## Data and Trust Boundaries
- Nudges: no sender stored on the nudge row; per-user daily count is server-only (never readable by the app).
- Client is untrusted: limits and permissions are enforced in RLS / Edge Functions.
- Secrets/documents visibility: not designed yet.

## Build and Deployment
Hosting chosen: Vercel (frontend) + Supabase (not set up yet).
Verified commands: `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit` (needs a build/dev run first to generate route types). Node 22.21.
Supabase CLI not installed; Docker is available.

## Unknowns
- Invite mechanism; house/member/role data model
- Reminder data: multiple times per day vs "last sent", chore completion records, chore assignment/rotation
- Nudge counter storage details
