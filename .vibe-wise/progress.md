# Learning Progress

## Pending decision
Decision: Houses, members, roles and invites (slice 1)
Stage: awaiting choice (step 2)
Step 1 is implemented. Asked the learner whether they want to hand-write the schema SQL (houses, memberships, join_requests) for AI review, or have the AI write it. The learner also needs to create the Supabase project and fill in .env.local.

## Data modelling
- Introduced (AI): relational many-to-many via a join table (memberships), roles as a column on the membership, and why lists inside a row are hard to query and secure.
- Applied the join-table idea: proposed an admins table with a composite key (user, house).
- Chose a role column on membership over a separate admins table after AI flagged the risk of the two drifting out of sync. Join requests go in their own table.
- Introduced (AI): atomic operations / transactions and Postgres functions (create_house, approve_join_request) to solve the chicken-and-egg problem for the first admin.
- Demonstrated understanding (invite security): layered defence with admin-only invite codes plus admin approval of join requests. Scoped the MVP to code/QR only, for a clear reason.

## Next.js
- Introduced (AI): Next.js is a React framework that runs code in two places (server and browser). It overlaps with Supabase Edge Functions as a place for trusted code.
- Needs reinforcement: initially justified moving logic into Next.js by "it gives a reason to use Next.js" (tool-first reasoning).
- Demonstrated understanding: after a tradeoff comparison (provided by AI on request), chose Edge Functions for nudges, reasoning that all security logic stays in one place (Supabase) instead of being split.

## Supabase and system shape
- Introduced (AI explained): Supabase is more than a database. It bundles Postgres, auth, file storage and an auto-generated API, and the browser usually calls it directly. Row Level Security (RLS) enforces access rules inside the database.
- Introduced (AI flagged): free-tier projects pause after a period of inactivity.
- Overall architecture confirmed 2026-11-16 (see project-map.md).

## Anonymity and data minimisation
- Demonstrated understanding: proposed not storing the sender on nudges at all, so anonymity doesn't depend on access rules.
- Recognised the tension between anonymity and abuse prevention, and proposed storing a hashed sender ID.
- Needs reinforcement: AI explained that a plain hash of a value from a small known set (house members) can be reversed by hashing every candidate and comparing. Hashing is not encryption.
- Introduced (AI): a private nudge in a small house is easier to attribute and carries a harassment risk.
- Learner deferred private nudges until after the MVP, and proposed per-user rate limiting / a daily nudge quota so housemates aren't overwhelmed.

## Reminders and notifications
- Learner's product design: reminder time and frequency set per user and customisable per chore.
- Needs reinforcement: initially proposed scheduling reminders locally on each device. AI explained that web apps can't run in the background, and introduced Web Push (push service + service worker) and the need for a server-side scheduler.
- Learner wasn't sure how server-side scheduling works. AI introduced cron / scheduled jobs and Supabase's pg_cron and Edge Functions.
- Learner identified one reminder condition: skip chores already checked off today.
- Learner proposed a "last sent" field to prevent duplicate reminders (demonstrated understanding of idempotent scheduling). Needs reinforcement: a date-only value conflicts with sending several reminders a day.
- Learner asked on their own whether polling every user every 15 minutes would scale (good instinct). AI introduced pushing filtering into the database query and using indexes.
- Open for the reminders slice: completion records, timezones, chore assignment.

## Trust boundaries
- Learner: the nudge count should stay in the database and never be sent to the app.
- Introduced (AI): with Supabase, the browser queries the database directly, so "never sent to the app" has to be enforced by RLS. Limits can't be enforced by the client, because users control their own browser.
- Demonstrated understanding: chose an Edge Function for nudge sending so that users can't bypass the limit check.
