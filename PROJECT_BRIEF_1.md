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
- **Default language is Persian (FA).** The site opens in Farsi by default (`defaultLocale: 'fa'`). English is accessible at `/en/...`.
- **Grows weekly.** Build in phases. Every phase must end with a deployable, working site. Commit to git after every working piece so we can always roll back.
- **Safety is not optional.** Once we store user data, we protect it (see Section 6).

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | One language front-to-back; type safety guides correct code. |
| Framework | Next.js (App Router) | Public site, admin, and API in one project. |
| Styling | Tailwind CSS | Fast, consistent; carries the sky-blue theme. |
| i18n | next-intl | EN/FA routing + RTL support. Default locale: `fa`. |
| Database | PostgreSQL (via Supabase) | Relational data + realtime + auth in one service. |
| ORM | Prisma 7.x (driver adapters) | Typed schema; `@prisma/adapter-pg`; session pooler URL. |
| Auth | Supabase Auth | Email + Google login without hand-rolling security. |
| File storage | Supabase Storage | Photos, audio recordings, video. Bucket: `media`. |
| Hosting | Vercel (app) + Supabase (data) | Both have free tiers to start. Live at `miraha.vercel.app`. |

**Theme — "Sunlit Sky & Oasis":** pale sky blue and white. Headings use Fraunces serif; Persian/body uses Vazirmatn. Oasis green for buttons/accents only.

**Design tokens, not hardcoded styles:** all colors and fonts read from `ThemeSettings` table, injected as CSS custom properties. Components use token names (`bg-primary`, `text-accent`), never hex values.

---

## 3. Features (full list)

### Heritage core ✅ Done
- **Dictionary** — word, pronunciation, meanings, examples, audio, photo. Searchable.
- **Audio recordings** — per word entry.
- **News & announcements** — image, date, title, body; bilingual.
- **Proverbs** — saying, meaning, usage; bilingual; optional audio.
- **About / village history** — body text editable from admin.
- **Photo / video gallery** — with captions; admin upload.
- **Map & directions** — embed URL + directions text, editable from admin.
- **Events & festival calendar** — upcoming dates, bilingual.
- **People directory** — villagers + diaspora, bilingual.
- **Hero slideshow** — rotating photos with slow zoom, prev/next, progress dots.
- **Live homepage search** — instant client-side search across dictionary and proverbs.
- **Related proverbs on word page** — shows proverbs containing that word's term.
- **Theming / Appearance admin** — colors and fonts from admin panel without code changes.

### Community ✅ Done
- **Login & profiles** — email + Google OAuth. Roles: `admin` | `member`.
- **Granular user permissions** — admins can grant individual members `canPublishWords`, `canPublishProverbs`, `canPublishMedia` flags. Permission holders bypass the moderation queue.
- **Suggest words / proverbs** — members submit; admins approve via moderation queue. Permission-holders auto-publish.
- **Favorites & personal word lists** — members save entries; `/profile/favorites`.
- **Admin users page** — `/admin/users` to manage roles and grant/revoke permissions.

### Image uploads ✅ Done
- **Admin upload button** on all image fields (words, proverbs, news, media, people). Files go to Supabase Storage `media` bucket via `/api/upload`. URL field still available as fallback for remote images.

### Pending / roadmap
- **Comments & discussion** — schema exists (`Comment` model), UI not yet built.
- **Notifications** — schema exists (`Notification` model), not yet wired.
- **Interactive family tree** — see Section 9 below.
- **Email newsletter** — sign-up form + sending.
- **Telegram announcement bot** — posts to channel on new news.
- **SMS announcements** — via Iranian gateway (Kavenegar / SMS.ir).
- **Gallery upload for contributors** — users with `canPublishMedia` get a public upload page.

---

## 4. Data model

Full Prisma schema at `prisma/schema.prisma`. Key tables:

- **User** — id (Supabase UUID), email, name, role (`admin|member`), avatarUrl, `canPublishWords`, `canPublishProverbs`, `canPublishMedia`, createdAt.
- **Word** — term, pronunciation, meaningEn/Fa, exampleEn/Fa, audioUrl, photoUrl, status (`approved|pending`), submittedById.
- **Proverb** — textEn/Fa, meaningEn/Fa, usageEn/Fa, audioUrl, status, submittedById.
- **News** — titleEn/Fa, bodyEn/Fa, imageUrl, publishedAt, authorId.
- **MediaItem** — type (`photo|video|audio`), url, captionEn/Fa, takenAt.
- **Event** — titleEn/Fa, descriptionEn/Fa, startsAt, endsAt, location.
- **Person** — nameEn/Fa, roleEn/Fa, locationEn/Fa, photoUrl.
- **Favorite** — userId, wordId (unique pair).
- **Comment** — body, userId, targetType, targetId.
- **HeroSettings / MapSettings / AboutSettings / ThemeSettings** — single-row config tables.

---

## 4a. Theming system

`ThemeSettings` table → CSS custom properties at root → Tailwind tokens. Admin "Appearance" page edits colors/fonts without code. One active theme; schema ready for multiple presets later.

---

## 5. Build history (phases completed)

**Phase 0 — Foundation** ✅
Next.js + TS + Tailwind. EN/FA routing (next-intl). Theming system (ThemeSettings → CSS vars → Tailwind tokens). Hero slideshow component.

**Phase 1 — Heritage content** ✅
Full Prisma schema. Public pages for dictionary, proverbs, news, gallery, events, people, map, about. Audio playback. Admin CRUD for all content. Appearance/theme admin. Rich seed data (8 words, 8 proverbs, 3 news, 8 gallery photos, 3 events, 4 people).

**Phase 2 — Accounts & login** ✅
Supabase Auth (email + Google OAuth). User profiles. Admin vs member roles. Protected admin pages (layout guard). Login form. Auth callbacks.

**Phase 3 — Contribute & save** ✅
Member word/proverb suggestions → pending → admin approval queue. Favorites system with optimistic UI. Profile favorites page. `/dictionary/suggest` and `/proverbs/suggest` pages.

**Deployment** ✅
GitHub repo at `github.com/mrashidi13/miraha`. Vercel project at `miraha.vercel.app`. Supabase project `qrawmxltvzipjxizzive` in eu-central-1. Session pooler connection (port 5432 blocked for direct). `ADMIN_EMAIL` env var auto-assigns admin on first login.

**Phase 3.5 — Homepage redesign + live search** ✅
Homepage redesigned: hero → quick nav pills → live search (client-side, no page refresh) → gallery grid → news cards. Photos removed from dictionary cards in search results. `LiveSearch` client component.

**Phase 4 (partial) — Enhancements** ✅ (this session)
- Default locale changed to Farsi (`defaultLocale: 'fa'`).
- Related proverbs section on word detail pages (searches textEn/textFa for the word's term).
- 3 new vocabulary words (khashar, vasht, nareh) + 4 new proverbs that cross-reference existing words.
- Image upload buttons on all admin forms (words, news, people, media) via Supabase Storage.
- Granular user permissions (`canPublishWords`, `canPublishProverbs`, `canPublishMedia`) — schema, admin Users page, permission-aware suggestion actions.

---

## 6. Security rules (hold firm)

- **Never commit secrets.** `.env` is gitignored. All keys in Vercel env vars.
- **Don't hand-roll authentication.** Supabase handles passwords and sessions.
- **Validate every user submission on the server.**
- **Moderation before publication.** Suggestions stay `pending` unless the user has the relevant publish permission or is admin.
- **Least privilege.** Members can't reach admin actions; server checks roles on every protected action.

---

## 7. Working agreement with Claude Code

- Start each session by reading this brief.
- Work one phase at a time; don't jump ahead.
- Commit to git after every working piece, with a clear message.
- When a step touches secrets, auth, payments, or deletion of data, pause and confirm.
- Keep the bilingual EN/FA + RTL requirement in mind for every new page.
- **No hardcoded colors, fonts, or themeable images** — always reference theme tokens.
- Update this brief when scope changes.

---

## 8. Environment variables (Vercel + local .env)

```
DATABASE_URL            # Supabase session pooler URL (postgres.{ref}@pooler host:5432)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ADMIN_EMAIL             # Auto-promotes to admin on first login
NEXT_PUBLIC_APP_URL     # https://miraha.vercel.app (or http://localhost:3000 locally)
```

---

## 9. Upcoming features & roadmap

### Interactive family tree (Phase 5)

**Recommended approach:**
1. **Schema**: Extend `Person` model with `fatherId String?` and `motherId String?` (self-referential) — or a `PersonRelation` join table for richer relationship types (spouse, sibling, etc).
2. **Library**: `@xyflow/react` (React Flow) — best maintained interactive canvas library for Next.js. Renders nodes as React components, edges as lines. Handles zoom, pan, drag.
3. **Data flow**: server component fetches all persons with relations → passes to a `FamilyTree` client component → React Flow renders the graph.
4. **Node design**: each node = person card (photo, name, role). Parents are above, children below. Clicking a node opens a side panel with full person details.
5. **Admin**: edit mode to add/remove relationships, drag to reposition.

**Estimated effort**: medium — 1-2 sessions for basic tree, more for a polished interactive experience.

### Comments (Phase 4)
- `Comment` model already in schema.
- Need: `CommentList` + `CommentForm` components on word/proverb/news detail pages.
- Server actions: `actionAddComment`, `actionDeleteComment` (admin only delete).

### Notifications (Phase 4)
- `Notification` model in schema.
- Need: notification bell in header, mark-read action.

### Gallery upload for contributors
- Users with `canPublishMedia` flag get a `/gallery/upload` public page.
- Submits to existing `actionAddMedia` with the `canPublishMedia` check.

---

## 10. Open decisions

- Village's actual local language name and script — still placeholder.
- SMS provider choice (Kavenegar / SMS.ir / Melipayamak) — pick when reaching Phase 5.
- Whether to expand from one editable theme to multiple saved presets.
- Telegram bot token — needed when building Phase 5 announcements.
- Real map embed URL — currently empty; admin can paste it in.
- Admin panel language — currently English-only even when `locale=fa`. Decide if admin needs full bilingual support.
