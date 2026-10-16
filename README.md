# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Database (PostgreSQL + Drizzle)

Every piece of content on the site — profile, resume (experience, education,
skills), projects and blog posts — is stored in PostgreSQL and read at request
time through [TanStack Start server functions](https://tanstack.com/start). The
database client never reaches the browser.

- Schema: [`src/db/schema.ts`](./src/db/schema.ts)
- Migrations: [`drizzle/`](./drizzle)
- Starter content: [`drizzle/seed.sql`](./drizzle/seed.sql)
- Server functions: [`src/server/api.ts`](./src/server/api.ts)

### Setup

1. Create a PostgreSQL database. This project is set up for
   [Neon](https://neon.tech), but any PostgreSQL 14+ instance works.
2. Copy `.env.example` to `.env.local` and set:
   - `DATABASE_URL` — the pooled connection string (the Neon host contains `-pooler`).
   - `ADMIN_PASSWORD` — the password for the `/admin` editor.
   - `GMAIL_USER` — Gmail address the contact form sends from.
   - `GMAIL_APP_PASSWORD` — a 16-character Google **App Password** for that
     account (create one at <https://myaccount.google.com/apppasswords>;
     requires 2-Step Verification to be enabled).
   - `CONTACT_TO` — where contact messages are delivered (optional; defaults to
     `GMAIL_USER`).
3. Create the tables and load the starter content:

   ```bash
   npm run db:migrate   # apply migrations (or npm run db:push for a quick sync)
   npm run db:seed      # load the starter content
   ```

4. Restart the dev server after changing environment variables.

### Editing the content

There are two ways to change what the site displays:

- **In the browser:** open `/admin` and sign in with `ADMIN_PASSWORD`. From there
  you can add, edit, reorder, publish/unpublish and delete projects, posts,
  services, testimonials, resume entries and the profile. The profile editor can
  upload the hero headshot and the About Me image — each is resized in the
  browser and saved with the profile — or you can point either one at a
  URL/path. Changes are written straight to PostgreSQL.
- **On the live page (inline editing):** once you have signed in at `/admin`
  (which stores the admin token), the public home page becomes click-to-edit.
  Hovering any editable text shows a highlight; click it, type the new value, and
  press <kbd>Enter</kbd> (or <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Enter</kbd> for
  long paragraphs) to save — <kbd>Esc</kbd> cancels. A running "Inline edit on"
  badge is shown in the corner. The hero headline/role and summary, the About
  heading and paragraphs, the profile details, service and project
  titles/descriptions, and testimonials are all editable. Saves go straight to
  PostgreSQL through the `inlineUpdate` server function, so the page updates in
  place with no reload. Inline editing is only active when the admin token is
  present; visitors see the normal page.
- **In SQL:** edit [`drizzle/seed.sql`](./drizzle/seed.sql) (or run statements in
  a database client) and re-run it. To change the schema itself, edit
  `src/db/schema.ts`, then run `npm run db:generate` and `npm run db:migrate`.

Inline editing is powered by [jQuery](https://jquery.com) in
[`src/lib/inline-edit.ts`](./src/lib/inline-edit.ts). The allow-list of editable
`target.field` pairs is shared with the endpoint via
[`src/lib/inline.ts`](./src/lib/inline.ts), so the client and server can never
drift apart. Adding an editable field means adding it to that allow-list and
tagging the element with `data-inline data-inline-target="…"
data-inline-field="…"` (plus `data-inline-id="…"` for services, projects and
testimonials).

The public site reads only rows where `is_published` is true for projects and
posts.

### Contact form

The `/contact` page posts to a server function (`sendContactMessage`) that
delivers the message over **Gmail SMTP** with [Nodemailer](https://nodemailer.com).
Configure `GMAIL_USER`, `GMAIL_APP_PASSWORD` and (optionally) `CONTACT_TO` as
described above. Without those variables, the form reports that it is not
configured instead of silently failing.

### Deploying to Vercel

The app is built with the Nitro Vite plugin, which emits a Vercel Build Output API bundle (`.vercel/output`) during `vite build`.

1. Import the repository into Vercel. The build command is `npm run build`.
2. Add these variables under **Project → Settings → Environment Variables** for **Production**, **Preview**, and **Development**:
   - `DATABASE_URL` — your PostgreSQL connection string (server-side only)
   - `ADMIN_PASSWORD` — the `/admin` editor password (server-side only)
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_TO` — contact form email (server-side only)

   These are **server-only** variables (no `VITE_` prefix), so they are never
   exposed to the browser and can be changed without rebuilding.
3. Run the migration and seed against the production database (from your machine):

   ```bash
   DATABASE_URL="<production connection string>" npm run db:migrate
   DATABASE_URL="<production connection string>" npm run db:seed
   ```

4. Deploy. Nitro detects the Vercel environment automatically and produces the server function plus static assets.

`vercel.json` intentionally contains no rewrites and no `outputDirectory`, because the Nitro Vercel preset owns the routing via `.vercel/output`. Do not add an SPA catch-all rewrite (`/(.*) → /index.html`); it would break server rendering.

With the Vercel CLI you can set the variables and deploy without leaving the terminal:

```bash
vercel env add DATABASE_URL production
vercel env add ADMIN_PASSWORD production
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add CONTACT_TO production
vercel --prod
```
