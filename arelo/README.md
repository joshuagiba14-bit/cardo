# Arelo

Web app for Quebec CEGEP students: drop your _plans de cours_ and class
notes, and Arelo builds your semester calendar, reminds you before every
evaluation, and quizzes you in French.

The full product and build spec is in [`ARELO_SPEC.pdf`](./ARELO_SPEC.pdf).

## Tech stack

Next.js 16 (App Router, TypeScript strict) · Tailwind CSS 4 · shadcn/ui ·
next-intl (French default, English second) · Vitest · ESLint · Prettier.

Coming in later phases: Supabase, Anthropic Claude API, Stripe, Resend,
Upstash, Sentry, Vercel.

## Run it on your computer

You need **Node.js 22 or newer**. Check with `node -v`. If you don't have it,
install the "LTS" version from <https://nodejs.org>.

```bash
# 1. Go into the project folder
cd arelo

# 2. Install the dependencies (once, and again after pulling new changes)
npm install

# 3. Create your private settings file from the template
cp .env.example .env.local

# 4. Start the app
npm run dev
```

Then open <http://localhost:3000>. The French site is at `/`, the English
one at `/en`. Stop the server with `Ctrl` + `C`.

## Useful commands

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Starts the app for development (auto-reloads) |
| `npm run build`        | Builds the production version (must pass)     |
| `npm start`            | Runs the production build                     |
| `npm test`             | Runs the unit tests once                      |
| `npm run test:watch`   | Re-runs the tests every time you save a file  |
| `npm run lint`         | Checks the code for mistakes                  |
| `npm run typecheck`    | Checks TypeScript types                       |
| `npm run format`       | Auto-formats every file with Prettier         |
| `npm run format:check` | Checks formatting without changing anything   |

## Project layout

```
arelo/
├── messages/            Translations: fr.json (default) and en.json
├── docs/                Design to-do, Figma setup, and later the privacy docs
├── src/
│   ├── app/[locale]/    Pages. Every page lives under the locale folder
│   ├── components/      React components (shadcn/ui ones in components/ui)
│   ├── i18n/            Language routing and next-intl setup
│   ├── lib/             Shared helpers
│   └── proxy.ts         Runs before every request (language; auth later)
└── tests/unit/          Unit tests
```

## Rules for this codebase

- **No hardcoded UI text.** Every string goes in `messages/fr.json` _and_
  `messages/en.json`. A test fails if the two files have different keys.
- **No secrets in code.** Keys go in `.env.local` (never committed). Add the
  variable _name_ to `.env.example`.
- **No hardcoded colors.** Use the design tokens in `src/app/globals.css`.
- **Links:** import `Link` from `@/i18n/navigation`, not `next/link`, so
  URLs stay in the right language.
