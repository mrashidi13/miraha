# Miraha (میراها) — Project Brief & Build Spec

> Standing specification for this project. Hand this file to Claude Code at the start of every working session so it has the full context. Update it as the project evolves.

---

## 1. What we're building

A bilingual (English + Persian) community website for a remote desert village that has its own local spoken language. The site preserves the village's language and heritage, shares news, and connects villagers — including those who have moved to cities (the diaspora).

The project is named **Miraha (میراها)** — echoing *میراث* (heritage), which fits a site built to preserve the village's language and memory.

**The heart of the project** is preserving an endangered local language. Audio recordings of words and elders matter as much as the written dictionary.

### Core principles
- **Bilingual everywhere.** Every page works in English (LTR) and Persian (RTL). This is a property of the whole site, not one feature.
- **Heritage first.** The dictionary, audio, news, and proverbs ship before community and tourism features.
- **Grows weekly.** Build in phases. Every phase must end with a deployable, working site. Commit to git after every working piece so we can always roll back.
- **Safety is not optional.** Once we store user data, we protect it (see Section 6).

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | One language front-to-back; type safety guides correct code. |
| Framework | Next.js (App Router) | Public site, admin, and API in one project. |
| Styling | Tailwind CSS | Fast, consistent; carries the sky-blue theme. |
| i18n | next-intl | EN/FA routing + RTL support. |
| Database | PostgreSQL (via Supabase) | Relational data + realtime + auth in one service. |
| ORM | Prisma | Typed schema; works very well with Claude Code. |
| Auth | Supabase Auth | Email + Google login without hand-rolling security. |
| File storage | Supabase Storage | Audio recordings, photos, video. |
| Hosting | Vercel (app) + Supabase (data) | Both have free tiers to start. |

**Theme — "Sunlit Sky & Oasis":** the site is predominantly **pale sky blue and white**. Backgrounds alternate between white and a soft sky-blue wash; headings, labels, and section titles are sky blue. **Oasis green is reserved for buttons and interactive accents only** (primary buttons, save/add actions, the dictionary's listen button) — it does not appear in backgrounds, gradients, or body text. Headings use a warm serif (Fraunces or similar) for an archival, heirloom feel; Persian and body text use Vazirmatn. The hero is a rotating photo slideshow with a slow zoom/drift effect, a soft sun-glow, and prev/next + progress-dot controls.

**Design tokens, not hardcoded styles:** every color, font, and themeable image is read from a central theme configuration (see Section 4a), never hardcoded into components. This is what allows the whole site's look to be changed from the admin panel without touching code.

---

## 3. Features (full list)

### Heritage core (build first)
- **Dictionary** — each entry: village word, pronunciation, Persian meaning, English meaning, usage example, **audio recording**, optional photo. Searchable.
- **Audio recordings** — recordings of words and of elders speaking/telling stories. The most irreplaceable asset.
- **News & announcements** — image, date, title, body; bilingual.
- **Proverbs** — the saying, its meaning, and when it's used; bilingual; optional audio.
- **About / village history** — origin, the qanat system, notable people, life in the desert.
- **Photo / video gallery** — village memory bank across seasons and festivals, with captions.
- **Map & how to get here** — embedded map, directions text, points of interest.
- **Events & festival calendar** — list of upcoming dates, titles, descriptions.
- **People directory** — villagers and diaspora: name, role, location.

### Community
- **Login & profiles** — email + Google. Roles: admin vs member.
- **Suggest words / proverbs** — members submit; admins approve via a moderation queue.
- **Favorites & personal word lists** — members save entries.
- **Comments & discussion** — under dictionary entries, news, proverbs.
- **Notifications** — suggestion approved, comment reply, news posted.

### Announcements & outreach
- **Email newsletter** — for occasional important news.
- **Telegram channel bot** — posts announcements automatically (free, high reach in Iran).
- **SMS announcements** — via an Iranian gateway (e.g. Kavenegar, SMS.ir, Melipayamak). Costs per message; international providers like Twilio are unreliable to Iranian numbers. **Later phase.**

### Later / optional (decide once core lives)
- User-to-user chat (high moderation burden — followable channel may cover the need).
- Donations / crafts shop / e-commerce (adds payment, legal, tax complexity).

---

## 4. Data model (initial tables)

These are the core tables. Claude Code should define them in the Prisma schema. Bilingual text fields are stored as separate columns (e.g. `meaningEn`, `meaningFa`) or a JSON field — prefer explicit columns for searchability.

- **User** — id, email, name, role (`admin` | `member`), avatarUrl, createdAt.
- **Word** (dictionary) — id, term (village language), pronunciation, meaningEn, meaningFa, exampleEn, exampleFa, audioUrl, photoUrl, status (`approved` | `pending`), submittedById, createdAt.
- **Proverb** — id, textEn, textFa, meaningEn, meaningFa, usageEn, usageFa, audioUrl, status, submittedById, createdAt.
- **News** — id, titleEn, titleFa, bodyEn, bodyFa, imageUrl, publishedAt, authorId.
- **MediaItem** (gallery) — id, type (`photo` | `video` | `audio`), url, captionEn, captionFa, takenAt.
- **Event** — id, titleEn, titleFa, descriptionEn, descriptionFa, startsAt, endsAt, location.
- **Person** (directory) — id, nameEn, nameFa, roleEn, roleFa, locationEn, locationFa, photoUrl.
- **Comment** — id, body, userId, targetType (`word` | `proverb` | `news`), targetId, createdAt.
- **Favorite** — id, userId, wordId, createdAt.
- **Notification** — id, userId, type, message, read, createdAt.
- **HeroSettings** — single row: slideshow image URLs (array), eyebrowEn/Fa, titleEn/Fa, subtitleEn/Fa.
- **MapSettings** — single row: embedUrl, directionsTextEn/Fa.
- **AboutSettings** — single row: bodyEn, bodyFa.
- **ThemeSettings** — single row (see 4a).

---

## 4a. Theming system — site-wide appearance from the admin panel

**Goal:** the look of the site — colors, fonts, and key images — can be changed from the admin panel without editing code. This must be designed in from Phase 0; retrofitting it later is much more costly.

**How it works:**
- A `ThemeSettings` table holds one row of design tokens: primary color (sky blue), accent/button color (oasis green), background tones, text colors, heading font, body font, and references to themeable images (logo, default hero slides, section backgrounds).
- The Next.js app reads `ThemeSettings` at startup/request time and injects the values as CSS custom properties (CSS variables) at the root of the page. Tailwind config maps its color names to these CSS variables rather than fixed hex codes.
- **Every component uses the token names** (e.g. `bg-primary`, `text-accent`) — never a hardcoded hex value. This is the rule that makes the system work; one hardcoded color is one thing the admin can no longer change.
- The admin "Appearance" page provides color pickers for each token, font selectors, and image upload/URL fields for logo and hero images, with a live preview.

**Starting values (the current "Sunlit Sky & Oasis" theme):**
- Primary (sky blue, backgrounds/headings): pale sky blue tones.
- Accent (buttons only): light oasis green.
- Background: white, with a pale sky-blue wash for alternating sections.
- Heading font: warm serif (Fraunces or similar). Body/Persian font: Vazirmatn.

**Now vs. later:** start with **one editable theme row** — the admin changes it in place. The schema and component structure should make it trivial to later support multiple saved theme presets (just more rows in `ThemeSettings` plus an "active theme" pointer) without restructuring components.

---

## 5. Build roadmap (one phase ≈ one week)

**Phase 0 — Foundation.** Scaffold Next.js + TypeScript + Tailwind. Set up EN/FA routing with next-intl and RTL. Set up the **theming system**: `ThemeSettings` table (or a typed config file as a placeholder until the database exists), CSS custom properties driven from it, and Tailwind color tokens mapped to those variables — seeded with the "Sunlit Sky & Oasis" values. Connect Supabase. Initialize git and commit.

**Phase 1 — Heritage content from the database.** Prisma schema for Word, Proverb, News, MediaItem, Event, Person, HeroSettings, MapSettings, AboutSettings, ThemeSettings. Public pages for dictionary (with search), proverbs, news, gallery, events, people, map, and about. Audio playback on entries. Admin pages to create/edit/delete content, manage the hero slideshow, and an **Appearance page** to edit theme colors/fonts/images. Seed with sample data.

**Phase 2 — Accounts & login.** Supabase Auth (email + Google). User profiles. Admin vs member roles. Protect admin pages.

**Phase 3 — Contribute & save.** Members suggest words/proverbs → pending status → admin approval queue. Favorites & personal lists.

**Phase 4 — Discussion & feed.** Comments on entries. Notifications. Main news channel members follow. Email newsletter signup.

**Phase 5 — Outreach & real-time.** Telegram announcement bot. SMS via Iranian gateway. (Optional, after review:) user-to-user chat with moderation.

> Each phase ships a working, deployable site. Don't start a phase until the previous one is committed and working.

---

## 6. Security rules (hold firm from Phase 2 onward)

- **Never commit secrets.** Passwords, API keys, database URLs, SMS/Telegram tokens go in environment variables (`.env`, git-ignored) — never in code that's committed.
- **Don't hand-roll authentication.** Let Supabase handle password storage and login.
- **Validate every user submission** on the server, not just in the browser.
- **Moderation before publication.** User-suggested content stays `pending` until an admin approves it.
- **Least privilege.** Members can't reach admin actions; check roles on the server for every protected action.

---

## 7. Working agreement with Claude Code

- Start each session by reading this brief.
- Work one phase at a time; don't jump ahead.
- Commit to git after every working piece, with a clear message.
- When a step touches secrets, auth, payments, or deletion of data, pause and confirm the approach before proceeding.
- Keep the bilingual EN/FA + RTL requirement in mind for every new page.
- **No hardcoded colors, fonts, or themeable images in components** — always reference theme tokens (Section 4a). If a new component needs a new token, add it to `ThemeSettings` rather than hardcoding.
- Update this brief when scope changes.

---

## 8. Open decisions (to resolve as we go)

- The village's actual local language name and script — currently placeholder.
- Dictionary entry richness confirmed: word + Persian/English meaning + example + **audio** + optional photo.
- SMS provider choice (Kavenegar / SMS.ir / Melipayamak) — pick when reaching Phase 5.
- Whether full user-to-user chat is worth the moderation burden — revisit after Phase 4.
- Real map embed URL and gallery/event photos — currently placeholders, swap in via the admin Appearance/content pages once available.
- Whether to expand from one editable theme to multiple saved presets — revisit once the core site is stable; the data model already allows it.
