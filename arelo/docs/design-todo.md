# Design to-do (Figma)

Screens that need a Figma design, in build order. Design one phase ahead of
the code. When a frame is ready, paste its Figma link next to it.

Each frame needs mobile (≈390 px) **and** desktop, light **and** dark, plus
its empty / loading / error states where they apply.

## Before anything else: design tokens

Set these up as Figma **variables** (not loose colors) so they can be copied
straight into `src/app/globals.css`:

- [ ] Colors: background, foreground, primary, secondary, muted, accent,
      destructive, border, input, ring, plus the 8 course colors. Light and dark mode for each.
- [ ] Type scale (font family, sizes, weights, line heights)
- [ ] Spacing scale
- [ ] Corner radius
- [ ] Shadows

## Phase 0 (built without a design; needs one)

- [ ] Temporary home page (`/`): replaced by the landing page later

## Phase 1: Supabase and auth

- [ ] Login: Google button + email magic-link form
- [ ] "Check your email" confirmation screen
- [ ] Onboarding: language, CEGEP name, semester, the three checkboxes
      (terms + privacy, "J'ai 14 ans ou plus", optional marketing emails),
      and the "under 14" blocked message
- [ ] Legal page template (privacy, terms, cookies): long text layout
- [ ] Footer (legal links, privacy contact, company name)
- [ ] App shell: top bar / navigation for logged-in pages (mobile + desktop)

## Phase 2: Upload and extraction

- [ ] Upload screen (with the AI disclosure text) + progress states
- [ ] Review screen for extracted course and evaluations
      (low-confidence highlights, missing dates, weights ≠ 100 %)
- [ ] Usage-limit reached prompt

## Phase 3: Calendar

- [ ] Dashboard
- [ ] Calendar month view
- [ ] "À venir" list view
- [ ] Courses list + course detail
- [ ] ICS export / subscribe dialog

## Phase 4: Quizzes

- [ ] Material upload (per course)
- [ ] Quiz setup, quiz taking, results
- [ ] "Explique-moi en profondeur" panel + practice question

## Phase 5: Plans and payments

- [ ] Pricing page (`/tarifs`)
- [ ] Checkout success / cancel
- [ ] Settings → plan and usage meters, upgrade prompts

## Phase 6–8

- [ ] Reminder email templates (FR/EN)
- [ ] Settings → reminders, data export, delete account
- [ ] Cookie consent banner
- [ ] Landing page (final)
