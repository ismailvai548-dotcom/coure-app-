# Bangladesh Multi-Vendor Course Marketplace (`bd-course-marketplace`)

A commission-based, multi-vendor online course marketplace built for independent teachers, trainers, coaching centers, educational institutions, and agencies in Bangladesh.

## Workspace Structure

- [`packages/shared`](file:///c:/course%20app/packages/shared): Shared TypeScript domain models, integer Poisha (`1 BDT = 100 Poisha`) currency formatters, bilingual (`bn` / `en`) dictionary, and the server-side configurable commission engine (with unit tests).
- [`supabase/migrations`](file:///c:/course%20app/supabase/migrations):
  - [`0001_initial_schema.sql`](file:///c:/course%20app/supabase/migrations/0001_initial_schema.sql): Normalized 29-table PostgreSQL schema with integer `poisha` columns, idempotency keys, live-course extensibility hooks, and append-only triggers on `commission_ledger` and `audit_logs`.
  - [`0002_rls_policies.sql`](file:///c:/course%20app/supabase/migrations/0002_rls_policies.sql): Database-level Row Level Security (RLS) policies and `SECURITY DEFINER` authorization helpers (`has_role`, `is_admin`, `owns_instructor_profile`, `is_enrolled_in_course`).
- [`supabase/seed.sql`](file:///c:/course%20app/supabase/seed.sql): Development-only category and default commission policy seed data.
- [`apps/web`](file:///c:/course%20app/apps/web): Next.js (App Router, TypeScript, Tailwind CSS) hosting the Student Marketplace, Instructor Studio (`/instructor`), and Admin Governance Console (`/admin`).
- [`apps/mobile`](file:///c:/course%20app/apps/mobile): React Native + TypeScript Android application package sharing `@bd-course/shared` and the unified Supabase backend.

## Local Development Setup

1. Copy [`.env.example`](file:///c:/course%20app/.env.example) to `apps/web/.env.local` and populate your Supabase project URL and keys.
2. Apply migrations to your local or linked Supabase database:
   ```bash
   supabase db push
   ```
3. Run unit tests for the commission and currency engine:
   ```bash
   npm test
   ```
4. Start the Next.js web application:
   ```bash
   npm run dev
   ```
