# Mentor404

A cybersecurity blog, resource library, and lab platform — built with Next.js 15, Prisma, PostgreSQL, and a full custom admin panel. Fully deployable for free on Vercel + Neon.

## Stack

- **Next.js 15** (App Router, Server Components)
- **PostgreSQL** via [Neon](https://neon.tech) (free tier)
- **Prisma** ORM
- **Auth.js v5** — credentials-based admin login
- **Tiptap** — rich text editor for posts and lab entries
- **Vercel Blob** — image/file uploads (free tier)
- **React Three Fiber** — 3D particle globe hero animation
- **Framer Motion** — page/section animations
- **Tailwind CSS v4**

## Features

- Public site: Home, Blog (with category filters), Resources (tools/cheat sheets/downloads), Lab (write-ups by domain & difficulty), Contact
- Full admin panel at `/admin`:
  - Dashboard with live stats
  - Post editor (rich text, cover images, categories, tags, SEO fields, draft/publish)
  - Resource manager (tools, cheat sheets, downloads, links)
  - Lab entry manager (domain, difficulty, tools used)
  - Category manager
  - Contact message inbox
- Newsletter signup (stores subscribers; wire up your own sender when ready)
- View counters on articles
- Responsive, dark, cybersecurity-themed design system

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up a free Postgres database

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the **pooled connection string** and the **direct connection string** from the dashboard

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — Neon pooled connection string
- `DIRECT_URL` — Neon direct connection string (used for migrations)
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for your first admin login (used only by the seed script)

### 4. Push the schema and seed initial data

```bash
npm run db:push
npm run db:seed
```

This creates your admin user and starter categories (Dark Web, Security, Tools, Technology, News, Daily Digest).

> **Note on restrictive networks (school/university/corporate wifi):** the app itself
> (`npm run dev`) connects to Neon over HTTPS via Neon's serverless driver, which works
> almost everywhere. But `prisma db push` and `prisma studio` use Prisma's migration
> engine, which needs a direct Postgres connection on port 5432 — some networks block
> this outbound port entirely. If `db:push` fails with `P1001: Can't reach database
> server`, run that one command from a network that allows port 5432 (mobile hotspot,
> home wifi, etc.), or ask Neon support about their pooled-connection workaround for
> migrations. Once the schema is pushed, day-to-day `npm run dev` will work fine on
> the restrictive network.

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin/login` to sign in with the admin credentials you set in `.env`.

## Deploying for free (Vercel + Neon)

1. **Push this project to a GitHub repo.**
2. **Database:** create a free project at [neon.tech](https://neon.tech) if you haven't already (see above).
3. **Deploy:** go to [vercel.com](https://vercel.com), import the repo.
4. **Environment variables:** in the Vercel project settings, add every variable from `.env.example` with real values (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
5. **File uploads:** in your Vercel project, go to Storage → Create Database → **Blob**. This automatically sets `BLOB_READ_WRITE_TOKEN` for you.
6. **Deploy.** Vercel will run `npm run build`, which runs `prisma generate` automatically via the `postinstall` script.
7. **Seed the database once**, either:
   - Run `npm run db:push && npm run db:seed` locally against your Neon `DATABASE_URL` (simplest), or
   - Use Vercel's CLI: `vercel env pull` then run the same commands locally.
8. Visit your deployed URL, then `/admin/login` to sign in and start publishing.

### Optional: email notifications for the contact form

Sign up for a free [Resend](https://resend.com) account, get an API key, and add `RESEND_API_KEY` + `CONTACT_NOTIFY_EMAIL` to your environment variables. Without these, contact form messages are still saved to the database and visible in `/admin/messages` — you just won't get an email ping.

## Project structure

```
app/
  (site)/          Public pages — home, blog, resources, lab, contact
  admin/            Admin panel — dashboard, editors, managers
  api/              API routes (public + admin, all admin routes auth-gated)
auth/               Auth.js configuration
components/
  3d/               Three.js/React Three Fiber hero globe
  admin/             Admin-only UI (forms, editor, sidebar)
  home/              Homepage sections (server components)
  ui/                Shared content cards (PostCard, ResourceCard, LabCard, etc.)
lib/                Prisma client, utilities, site config
prisma/             Schema and seed script
```

## Content model

- **Post** — blog articles. Status: draft / published / scheduled / archived. Belongs to one category, many tags.
- **Resource** — tools, cheat sheets, downloads, links, courses.
- **LabEntry** — hands-on write-ups, tagged by domain (Web, Network, Malware, Forensics, Cloud, Mobile, OSINT) and difficulty.
- **Category** / **Tag** — shared taxonomy across posts and resources.
- **ContactMessage** — contact form submissions, readable in the admin inbox.
- **Subscriber** — newsletter signups.

## Notes

- The 3D hero (particle network globe) is client-rendered only (`dynamic(..., { ssr: false })`) since Three.js needs a browser environment.
- Admin routes are protected by middleware (`middleware.ts`) — any unauthenticated request to `/admin/*` (except `/admin/login`) redirects to login.
- File uploads (cover images, downloadable resources) go through `/api/admin/upload` and land in Vercel Blob; if `BLOB_READ_WRITE_TOKEN` isn't set, uploads will fail gracefully with a clear error message instead of crashing.
