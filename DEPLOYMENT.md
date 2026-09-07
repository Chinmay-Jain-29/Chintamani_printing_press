# Deployment & Environment Setup Guide
## New Chintamani Printing Press, Dongaon

This document contains complete, verified instructions for deploying the **New Chintamani Printing Press** website and administrative CMS to production on **Vercel** or an alternative persistent host (Render, Railway, VPS).

---

## 1. Environment Variables Overview

| Variable Name | Required? | Environment Scope | Secret? | Exposed to Browser? | Description & Value Source |
|---|:---:|:---:|:---:|:---:|---|
| `ADMIN_SESSION_SECRET` | **YES** | Production & Preview | **YES** | **NO** | 32+ character random hex string used to sign administrator JWT cookies. |
| `NODE_ENV` | **Auto** | Production & Preview | **NO** | **YES** | Automatically managed by Vercel (`production` / `development`). No manual setup needed. |

> [!IMPORTANT]
> **No other environment variables are required.** The project has no external database passwords, no SMTP keys, no Google Maps API keys, and no client-side `NEXT_PUBLIC_*` secrets.

---

## 2. Generating Your Secret Key

Before deploying, generate a cryptographically strong 32-byte secret for `ADMIN_SESSION_SECRET`:

### Option A: Using Node.js (Terminal / PowerShell)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option B: Using OpenSSL
```bash
openssl rand -hex 32
```

Copy the generated 64-character output for use in your deployment dashboard.

---

## 3. Step-by-Step Vercel Deployment

### Step 1: Import the GitHub Repository
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** → **Project**.
3. Select your repository: **`Chinmay-Jain-29/Chintamani_printing_press`**.
4. Click **Import**.

### Step 2: Configure Project Settings
- **Framework Preset:** `Next.js` (automatically detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 3: Add Environment Variables
In the **Environment Variables** section of the Vercel import screen, add:

```text
Key:   ADMIN_SESSION_SECRET
Value: [Paste the 32+ character random hex key generated in Section 2]
Target: Check both 'Production' and 'Preview'
```

### Step 4: Deploy
1. Click **Deploy**.
2. Vercel will clone the repository, run `npm install`, compile all 26 static & dynamic routes, and deploy the application.
3. Your site will be live at `https://chintamani-printing-press.vercel.app` (or your assigned Vercel URL).

---

## 4. Production Hosting Architecture & Storage Notes

### Vercel Serverless Behavior
- **Public Website & Showcase:** Fully supported. All pages, multilingual toggles, GSAP animations, services, and portfolio galleries load with optimal speed and CDN caching.
- **Serverless File Storage Consideration:**
  - Vercel functions execute in a read-only serverless environment.
  - While initial seed data from `src/lib/db.ts` is pre-baked and will display cleanly, runtime writes (`data/store.json` and `public/uploads/`) cannot persist permanently across serverless function re-deployments.
  - If you intend to actively modify content in the Admin CMS or upload new pictures directly on Vercel, consider connecting an external database (such as Supabase, MongoDB, or Vercel KV) and cloud media storage (Vercel Blob or Cloudinary).

### Alternative: Persistent Node.js Host (Render / Railway / VPS)
If you wish to retain the project's zero-dependency local JSON file store and local image uploads without changing any code:
1. Deploy to any persistent container/host (e.g. **Railway**, **Render Web Service**, or a **VPS**).
2. Start command: `npm run build && npm run start`.
3. Set `ADMIN_SESSION_SECRET` in the host's environment settings.
4. The local file database (`data/store.json`) and uploaded files (`public/uploads/`) will persist on disk.

---

## 5. Pre-Deployment Verification Checklist

Before triggering a production deployment, confirm:

- [x] **Repository Initialized:** Pushed to `https://github.com/Chinmay-Jain-29/Chintamani_printing_press.git`.
- [x] **Secrets Excluded:** `.env.local` is listed in `.gitignore` and has never been committed.
- [x] **Operational Data Excluded:** `data/store.json` and `public/uploads/*` are excluded via `.gitignore`.
- [x] **Directory Placeholders:** `data/.gitkeep` and `public/uploads/.gitkeep` are tracked.
- [x] **Zero Build Errors:** Verified with `npm run build` (26/26 routes compile cleanly).
- [x] **Zero Lint Errors:** Verified with `npm run lint`.
- [x] **Admin Security:** Admin login fields initialize empty with no hardcoded credentials or developer hints.

---

## 6. Post-Deployment Verification

Once deployed to Vercel:

1. **Verify Homepage:** Visit your production URL (`https://your-domain.vercel.app`) to verify images, animations, and English / Marathi / Hindi language switcher.
2. **Verify Admin Portal:** Navigate to `/admin/login`. Ensure inputs are empty and you can authenticate using your administrator credentials.
3. **Connect Custom Domain (Optional):**
   - Go to **Vercel Project** → **Settings** → **Domains**.
   - Enter your custom domain (e.g., `newchintamaniprinting.com`).
   - Add the specified `A` or `CNAME` records at your DNS provider.
   - Vercel will automatically provision a free SSL certificate.
