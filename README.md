# Cardo

Marketing site + admin panel for Cardo, a Montreal-area agency that runs
Meta Ads and Google Ads for local service businesses. Bilingual (French
default, English), built as two independent apps in one repo.

```
cardo/
├── web/                 Next.js 14 (App Router) — public site + /admin
├── api/                 Express + Prisma (PostgreSQL) — REST API
└── packages/shared/     Zod schemas & types imported by both apps
```

Tech stack: TypeScript everywhere · Next.js + Tailwind CSS + shadcn/ui (web)
· Express + PostgreSQL + Prisma (api) · next-intl for i18n.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)

## 1. Install

From the repo root (this is an npm workspaces monorepo — one install covers
`web`, `api`, and `packages/shared`):

```bash
npm install
```

## 2. Configure environment variables

Both apps ship a `.env.example`. Copy each to its real filename and adjust
as needed.

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
```

**`api/.env`**

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://cardo:cardo@localhost:5432/cardo?schema=public` |
| `PORT` | Port the Express server listens on | `4000` |
| `CORS_ORIGIN` | Origin(s) allowed to call the API, comma-separated | `http://localhost:3000` |
| `JWT_SECRET` | Secret used to sign admin session JWTs — generate with `openssl rand -base64 48` | — |
| `JWT_EXPIRES_IN` | Admin session lifetime | `8h` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |

**`web/.env.local`**

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API, reachable from both server and browser | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Used to build canonical/hreflang/Open Graph URLs | `http://localhost:3000` |
| `SITE_GATE_EMAIL` | The one email allowed through the site-wide sign-in gate | — |
| `SITE_GATE_PASSWORD` | Its password | — |
| `SITE_GATE_TOKEN` | Random secret used as the gate session cookie's value — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` | — |

A test-only `api/.env.test` is already committed (points at a separate
`cardo_test` database, no real secrets) so the integration suite never
touches your dev data.

## 3. Create the database(s) and run migrations

Create the database(s) referenced by `DATABASE_URL` (and, if you plan to run
tests, the one in `.env.test`) — e.g. with `psql`:

```sql
CREATE ROLE cardo LOGIN PASSWORD 'cardo' CREATEDB;
CREATE DATABASE cardo OWNER cardo;
CREATE DATABASE cardo_test OWNER cardo;
```

(`CREATEDB` is required because Prisma spins up a throw-away shadow database
during `migrate dev`.)

Then, from `api/`:

```bash
npm run db:migrate          # applies prisma/migrations, creates tables
npm run db:seed             # seeds offerings, case studies, and an admin user
```

Seeded admin login: **admin@cardo.agency / CardoAdmin123!**

To run the test database's migrations (no seed needed there):

```bash
DATABASE_URL="postgresql://cardo:cardo@localhost:5432/cardo_test?schema=public" npx prisma migrate deploy --schema api/prisma/schema.prisma
```

## 4. Run both apps

In two terminals, from the repo root:

```bash
npm run dev:api    # http://localhost:4000
npm run dev:web    # http://localhost:3000
```

Visit `http://localhost:3000` — you'll land on `/gate` first (see below),
then French loads by default at `/`, with an FR|EN switcher in the
header/footer. Visit `http://localhost:3000/admin` for the admin panel
(redirects to `/admin/login` until you sign in).

## Site-wide sign-in gate

Every route — the marketing site and `/admin` alike — sits behind a single
owner-only login at `/gate`, enforced in `web/src/middleware.ts`. This is
separate from, and sits in front of, `/admin`'s own per-staff auth: getting
past `/gate` only unlocks the site; `/admin` still requires its own
sign-in underneath.

It's meant for a private pre-launch preview (e.g. on Vercel, before the
site is public). Set `SITE_GATE_EMAIL`, `SITE_GATE_PASSWORD`, and
`SITE_GATE_TOKEN` (see the env var table above) in both `web/.env.local`
and your hosting provider's environment variables — only the exact email
configured there is ever accepted.

## Deploying: Vercel (web) + Railway (api)

### API on Railway

The repo root has a `railway.json` (config-as-code) that already sets the
right build/start commands for this npm-workspaces monorepo — no manual
Nixpacks setup needed.

1. Push this repo to GitHub (Railway deploys from a connected repo — or use
   `railway up` from the Railway CLI to deploy without GitHub at all).
2. In Railway: **New Project → Deploy from GitHub repo**, select this repo.
   Leave the service's **Root Directory** as the repo root (`/`) — the
   workspace commands in `railway.json` need to run from there so
   `@cardo/shared` resolves correctly.
3. **New → Database → PostgreSQL** in the same project, then link it to the
   API service — Railway auto-injects `DATABASE_URL` for you.
4. In the API service's Variables tab, set: `CORS_ORIGIN` (your Vercel
   domain, once you have it — comma-separate if you need more than one),
   `JWT_SECRET` (generate with `openssl rand -base64 48`), `JWT_EXPIRES_IN`
   (`8h`), `NODE_ENV=production`. `PORT` and `DATABASE_URL` are already
   handled by Railway.
5. Deploy. Railway runs `npm install` at the repo root, then on every
   deploy: `prisma migrate deploy` (applies pending migrations — safe to
   run repeatedly, it's a no-op with nothing pending) followed by
   `tsx src/server.ts`. Run the seed script once, manually, via the
   Railway CLI: `railway run npm run db:seed --workspace=api`.
6. Copy the service's public URL (Railway generates one, or attach a custom
   domain) — that's your `NEXT_PUBLIC_API_URL` for the web app below.

### Web on Vercel

`web/` deploys as a standard Next.js App Router app — point Vercel's
**Root Directory** at `web/` when importing the project. In the Vercel
project's Environment Variables, set everything from the `web/.env.local`
table above: `NEXT_PUBLIC_API_URL` (the Railway URL from step 6),
`NEXT_PUBLIC_SITE_URL` (your Vercel domain), and the three `SITE_GATE_*`
values. Once you have the Vercel domain, go back and set it as `CORS_ORIGIN`
on the Railway API service so the browser is actually allowed to call it.

## 5. Run the API's integration tests

```bash
cd api
npm run test
```

Covers the full lead flow (validation, creation, admin listing/filtering,
status updates, auth gating) and the auth flow (login, bad credentials,
session cookie, `/auth/me`, logout) against the real `cardo_test` database.

## API reference

All responses are wrapped in an envelope: `{ ok: true, data }` on success,
or `{ ok: false, error: { code, message, fields? } }` on failure. Types for
both are exported from `@cardo/shared`.

### Public

```bash
# Create a lead (contact form submission) — rate-limited to 5/15min per IP
curl -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marc Tremblay",
    "email": "marc@plomberietremblay.ca",
    "businessName": "Plomberie Tremblay",
    "phone": "5145551234",
    "industry": "trades",
    "monthlyAdBudget": "1000_2500",
    "currentChannels": ["google_ads"],
    "message": "Looking for help with Google Ads.",
    "locale": "fr"
  }'

# List active offerings
curl http://localhost:4000/api/offerings

# Get one offering by slug
curl http://localhost:4000/api/offerings/meta-ads

# List published case studies
curl http://localhost:4000/api/case-studies

# Get one case study by slug
curl http://localhost:4000/api/case-studies/plomberie-rive-sud
```

### Auth

```bash
# Log in — sets an httpOnly session cookie
curl -c cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cardo.agency","password":"CardoAdmin123!"}'

# Current session
curl -b cookies.txt http://localhost:4000/api/auth/me

# Log out
curl -X POST http://localhost:4000/api/auth/logout
```

### Admin (require a valid session cookie; `DELETE` and offering/case-study
writes additionally require the `admin` role, not `staff`)

Note: these share the exact same paths as the public `GET`s above — an
authenticated request simply sees more (inactive offerings, unpublished
case studies) and unlocks the mutating verbs.

```bash
# Filter + paginate leads
curl -b cookies.txt "http://localhost:4000/api/leads?status=new&page=1&pageSize=20"

# Update a lead's status
curl -b cookies.txt -X PATCH http://localhost:4000/api/leads/<id> \
  -H "Content-Type: application/json" -d '{"status":"contacted"}'

# Delete a lead (admin role only)
curl -b cookies.txt -X DELETE http://localhost:4000/api/leads/<id>

# Create an offering (admin role only)
curl -b cookies.txt -X POST http://localhost:4000/api/offerings \
  -H "Content-Type: application/json" -d '{
    "slug": "tiktok-ads", "titleFr": "TikTok Ads", "titleEn": "TikTok Ads",
    "summaryFr": "...", "summaryEn": "...", "bodyFr": "...", "bodyEn": "...",
    "priceFrom": 1200
  }'

# Update / delete an offering (admin role only)
curl -b cookies.txt -X PATCH http://localhost:4000/api/offerings/<id> \
  -H "Content-Type: application/json" -d '{"isActive": false}'
curl -b cookies.txt -X DELETE http://localhost:4000/api/offerings/<id>

# Create / update / delete a case study (admin role only) — same shape as
# the seed data in api/prisma/seed.ts
curl -b cookies.txt -X POST http://localhost:4000/api/case-studies \
  -H "Content-Type: application/json" -d '{ ... }'
curl -b cookies.txt -X PATCH http://localhost:4000/api/case-studies/<id> \
  -H "Content-Type: application/json" -d '{"isPublished": true}'
curl -b cookies.txt -X DELETE http://localhost:4000/api/case-studies/<id>
```

## Notes on a few design decisions

- **No `/admin` path prefix in the API.** The endpoint list groups admin
  actions under the same paths as their public counterparts (`GET
  /api/offerings` etc.), differentiated by session + role rather than a
  separate namespace — matching the endpoint list in the original spec.
- **`monthlyAdBudget` is a validated string, not a DB enum.** Its values
  (`"1000_2500"`, etc.) start with a digit, which isn't a legal Prisma enum
  member name — it's validated by the shared Zod enum at the API boundary
  instead.
- **Root `/` is a rewrite, not a redirect.** Middleware serves French (or a
  previously *chosen* locale, via the `NEXT_LOCALE` cookie set only by the
  language switcher) at the bare `/` without changing the URL and without
  ever reading the browser's `Accept-Language` header.
