# Supabase Database Migration & Production Setup Guide
## New Chintamani Printing Press — Vercel Architecture

This guide details how to configure Supabase PostgreSQL as the persistent database for **New Chintamani Printing Press**, ensuring that all quote requests, customer reviews, service catalogs, portfolio items, and CMS updates persist permanently across Vercel deployments, function instances, and serverless cold starts.

---

## 1. Architecture Overview

```
                         ┌─────────────────────┐
                         │   Website Visitor   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Vercel Next.js    │
                         │ App Router Frontend │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Secure API Routes  │
                         │  Server Middleware  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Supabase PostgreSQL │
                         │ Row Level Security  │
                         └──────────┬──────────┘
                                    │
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
     ▼              ▼               ▼               ▼              ▼
  services      portfolio        reviews         quotes       site_settings
(Catalog CRUD) (Showcase CRUD) (Moderation)  (Inquiries Inbox) (CMS & SEO)
```

---

## 2. Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Set your project name: `new-chintamani-printing-press`.
4. Choose a strong database password and select a region close to your users (e.g., `South Asia (Mumbai)` for Maharashtra / India).
5. Click **Create new project** and wait ~2 minutes for provisioning.

---

## 3. Step 2: Apply Database Schema & RLS

1. Open your project in the Supabase Dashboard.
2. In the left navigation, click **SQL Editor**.
3. Click **New Query**.
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql` from this repository.
5. Paste it into the SQL Editor and click **Run**.
6. Verify that the query executes successfully (`Success. No rows returned`).

This script creates:
- 7 normalized tables: `services`, `portfolio`, `reviews`, `quotes`, `translations`, `site_settings`, `admin_users`.
- Performance indexes for queries, filtering, and ordering.
- `update_updated_at_column()` triggers for automated timestamps.
- Production Row Level Security (RLS) policies protecting admin endpoints while allowing public visitors to read published items and submit quotes/reviews.
- Storage bucket `chintamani_uploads` with public read access.

---

## 4. Step 3: Configure Storage Bucket

1. In the Supabase Dashboard, click **Storage** in the left sidebar.
2. Verify that bucket `chintamani_uploads` exists.
   - If not automatically created by SQL, click **New bucket**, name it `chintamani_uploads`, and toggle **Public bucket** ON.
3. In **Policies**, verify that:
   - Public visitors have `SELECT` (read) permission.
   - `service_role` has full CRUD permissions.

---

## 5. Step 4: Obtain Your API Credentials

In the Supabase Dashboard:
1. Navigate to **Project Settings** (gear icon at the bottom left) > **API**.
2. Note down:
   - **Project URL** (e.g. `https://abcdefghijklm.supabase.co`)
   - **anon / public key** (safe for browser exposure)
   - **service_role key** (secret key; **NEVER** expose to the browser)

---

## 6. Step 5: Migrate Existing Data from Local to Supabase

To transfer your existing quotes, reviews, services, portfolio items, site settings, and translations into Supabase without duplicates:

1. In your local development root, create or update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   SUPABASE_STORAGE_BUCKET=chintamani_uploads
   ADMIN_SESSION_SECRET=your-random-32-character-secret
   ```

2. Run the automated migration script:
   ```bash
   node scripts/migrate-to-supabase.mjs
   ```

3. The script will output a verification table showing the number of migrated records for each table. All operations use `UPSERT` on unique IDs, making the script safe to run multiple times without duplicating data.

---

## 7. Step 6: Configure Environment Variables in Vercel

To ensure your live Vercel deployment uses Supabase:

1. Open your project on [https://vercel.com](https://vercel.com).
2. Go to **Settings** > **Environment Variables**.
3. Add the following variables (for **Production**, **Preview**, and **Development**):

| Variable Name | Value | Secret? | Expose to Browser? |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | No | Yes (Safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (Anon public key) | No | Yes (Safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (Service role key) | **YES** | **NO (Server only)** |
| `SUPABASE_STORAGE_BUCKET` | `chintamani_uploads` | No | No |
| `ADMIN_SESSION_SECRET` | 32+ character random string | **YES** | **NO (Server only)** |

4. Click **Save** and trigger a **Redeploy** on Vercel.

---

## 8. Data Persistence Verification

After deployment, perform these checks:
1. **Submit Quote**: Go to `/quote` on the live Vercel website and submit a quote request.
2. **Admin Verification**: Log into the admin portal at `/admin/login`, open **Quote Requests Inbox**, and verify the quote is visible.
3. **Redeploy Test**: Trigger a redeployment in Vercel. After completion, refresh the admin portal: verify that all quotes and data remain intact.
