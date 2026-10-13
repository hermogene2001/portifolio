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

## Projects database

Project listings on the home page and Projects page are loaded from Supabase.

1. Run [`supabase/projects.sql`](./supabase/projects.sql) in the Supabase SQL Editor. It creates the `projects` table, enables public read access for published projects, and inserts the current portfolio projects.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings.
3. Restart the development server after changing environment variables.

Add, edit, reorder, or unpublish projects in the Supabase table editor. The public site reads only rows where `is_published` is true. Keep the anon key in the client; never put a Supabase service-role key in a `VITE_` variable.

### Deploying to Vercel

The app is built with the Nitro Vite plugin, which emits a Vercel Build Output API bundle (`.vercel/output`) during `vite build`.

1. Import the repository into Vercel. The build command is `npm run build`.
2. Add the Supabase values under **Project → Settings → Environment Variables** for **Production**, **Preview**, and **Development**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   These are read at build time (Vite inlines `VITE_` variables), so set them before the first deploy and redeploy after changing them.
3. Deploy. Nitro detects the Vercel environment automatically and produces the server function plus static assets.

`vercel.json` intentionally contains no rewrites and no `outputDirectory`, because the Nitro Vercel preset owns the routing via `.vercel/output`. Do not add an SPA catch-all rewrite (`/(.*) → /index.html`); it would break server rendering.

With the Vercel CLI you can set the variables and deploy without leaving the terminal:

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel --prod
```
