# SkillShare Local

> **Learn locally. Share skills. Grow together.**

A hyperlocal community skill-exchange platform connecting people who want to learn skills with people in their area who can teach them. Built as a final-year academic project.

---

## What it does

SkillShare Local lets learners search for local skill teachers (providers), filter by distance, experience level, price, and learning mode, view provider profiles with reviews and availability, and book sessions through a multi-step booking flow. Providers manage their skills, bookings, and earnings from a dedicated dashboard. Administrators can verify providers and moderate the platform.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Forms | react-hook-form + zod |
| Icons | Lucide React |
| Dates | date-fns |
| Animations | Framer Motion |
| Auth (mock) | Context API (real backend ready) |

---

## Requirements

| Tool | Minimum version |
|---|---|
| Node.js | **18.x** or higher (tested on 22.x) |
| npm | 9.x or higher |

Check your versions:

```bash
node --version
npm --version
```

---

## Installation

```bash
# 1. Clone or unzip the project
cd skillshare-phase-I-majorproject

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server at localhost:5173 |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the source files |

---

## Environment variables

**This project currently runs entirely on mock data — no environment variables are required to run it.**

When a real backend is connected in Phase 2, you will need to create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit `.env.local` to version control.

---

## Demo accounts

The login page has a built-in role switcher. Use any email and password — authentication is mocked.

| Role | Demo email | Password | Redirects to |
|---|---|---|---|
| **Learner** | `aditi.singh@email.com` | `demo1234` | `/dashboard` |
| **Provider** | `simran.sharma@email.com` | `demo1234` | `/provider` |
| **Admin** | `admin@skillsharelocal.in` | `demo1234` | `/admin` |

> On the login page, click the role buttons (Learner / Provider / Admin) before signing in to be redirected to the correct dashboard.

---

## Project structure

```
src/
├── components/
│   ├── layout/        # Navbar, Sidebar, Footer, Logo
│   └── ui/            # Button, Badge, Input, Modal, Rating, Card, etc.
├── context/           # AuthContext, ThemeContext
├── data/              # All mock data (providers, bookings, reviews, etc.)
├── hooks/             # useProviders, useBookings
├── layouts/           # DashboardLayout, PublicLayout
├── pages/
│   ├── auth/          # Login, Signup, ForgotPassword
│   ├── learner/       # Dashboard, Bookings, Messages, Reviews, Profile
│   ├── provider/      # Dashboard, Skills, Bookings, Earnings
│   └── admin/         # AdminDashboard
├── services/          # bookingService, providerService, etc. (mock, swap for real API)
├── types/             # All TypeScript types and interfaces
└── utils/             # cn (classnames), format helpers
```

---

## Key routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/explore` | Browse & search providers | Public |
| `/providers/:id` | Provider profile | Public |
| `/booking/:id` | Book a session (multi-step) | Public |
| `/login` | Sign in | Public |
| `/signup` | Create account | Public |
| `/onboarding` | Post-signup preferences | Authenticated |
| `/dashboard` | Learner home | Learner |
| `/dashboard/bookings` | My bookings | Learner |
| `/dashboard/messages` | Chat | Learner |
| `/dashboard/reviews` | My reviews | Learner |
| `/dashboard/profile` | Learner profile | Learner |
| `/provider` | Provider home | Provider |
| `/provider/skills` | Manage skills | Provider |
| `/provider/bookings` | Booking requests | Provider |
| `/provider/earnings` | Earnings overview | Provider |
| `/admin` | Admin panel | Admin |
| `/settings` | Settings | Authenticated |
| `/notifications` | Notifications | Authenticated |

---

## Features implemented (Phase 1)

- **Landing page** — Hero, stats, popular skills, how it works, featured providers, CTA
- **Explore page** — Search, filters (category / distance / mode / price / rating / level), AI assistant panel (mock)
- **Provider profile** — Full profile with skills, portfolio, reviews with rating breakdown, availability, booking CTA
- **Booking flow** — 5-step: choose skill → pick date (calendar) → pick time → review → confirm, with status animation
- **Learner dashboard** — Stats, upcoming sessions, recommendations, skill quick-search
- **Bookings page** — Tabs: Upcoming / Pending / Completed / Cancelled, cancel flow with confirmation
- **Messages / Chat** — Conversation list, real-time-style messaging, send messages, unread counts
- **Reviews** — Write a review with star input, review list, pending review prompt
- **Learner profile** — Edit name, bio, city, languages, interested skills
- **Provider dashboard** — Pending requests (accept/decline), upcoming sessions, earnings snapshot, recent reviews
- **Provider skills** — Add, edit, remove skills with full form and confirmation dialog
- **Provider bookings** — Full booking management with accept/decline actions
- **Provider earnings** — Bar chart, monthly breakdown, recent payments list
- **Admin panel** — Stats, tabs: provider verification / users / bookings / review moderation
- **Notifications** — Mark as read, mark all read, type icons
- **Settings** — Profile, security (password change), notification preferences, theme switcher
- **Onboarding** — 7-step: intent → skills → experience → mode → distance → availability → complete
- **Dark mode** — Proper intentional dark theme throughout, persisted to localStorage
- **Responsive** — Mobile-first, works from 375px upward

---

## Mock data context

All data is seeded with realistic Indian context:

- Cities: Ludhiana, Chandigarh, Jalandhar, Amritsar, Delhi
- Skills: Photography, Graphic Design, Web Development, Python, Guitar, Cooking, Fitness Training, Digital Marketing
- Prices in INR: ₹350 – ₹750 per session
- Provider names: Simran Sharma, Riya Kapoor, Arjun Mehta, Priya Nair, Karan Bhatia, Ananya Reddy, Rohit Verma

---

## GitHub Pages deployment

The frontend can be deployed to GitHub Pages for browser review. This is a **static frontend demo only** — no backend, no real auth, no database.

### First-time setup

**1. Create the GitHub repository**

Go to [github.com/new](https://github.com/new) and create a repository named exactly:

```
skillshare-phase-I-majorproject
```

Make it public (required for free GitHub Pages).

**2. Initialise git and push the source code**

Run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial commit — SkillShare Local frontend"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/skillshare-phase-I-majorproject.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

**3. Deploy to GitHub Pages**

```bash
npm run deploy
```

This runs `predeploy` (builds with the correct base path) then pushes the `dist/` folder to the `gh-pages` branch automatically.

**4. Enable GitHub Pages in repository settings**

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `gh-pages`, folder to `/ (root)`
5. Click **Save**

GitHub will show the live URL — usually within 1–2 minutes.

### Expected deployment URL

```
https://YOUR_GITHUB_USERNAME.github.io/skillshare-phase-I-majorproject/
```

### Redeploying after changes

```bash
git add .
git commit -m "Update: describe your changes"
git push
npm run deploy
```

### If you rename the repository

If you use a different repository name, update `package.json` in both `predeploy` script occurrences and `vite.config.ts` `VITE_BASE_PATH`:

```
# package.json predeploy — change both occurrences of:
VITE_BASE_PATH=/skillshare-phase-I-majorproject/

# to:
VITE_BASE_PATH=/your-actual-repo-name/
```

### GitHub Pages limitations for this SPA

| Limitation | Impact | Workaround included |
|---|---|---|
| No server-side routing | Direct URL visits (e.g. `/dashboard`) return 404 | ✅ `public/404.html` redirect + `index.html` restore script |
| No HTTPS custom domain (free tier) | Must use `github.io` subdomain | Not needed for demo |
| Static files only | No API, no auth, no database | All data is mock — works fine |
| Cold start after inactivity | GitHub Pages CDN — instant, no cold start | N/A |

Deep links (e.g. `/explore`, `/providers/p1`, `/dashboard`) will work via the 404.html redirect technique. The URL will be briefly replaced but the correct page will load.

---

## Planned for Phase 2

- Real backend: Node.js + Express + PostgreSQL
- JWT authentication replacing mock auth
- File uploads (S3)
- Real-time messaging (WebSockets)
- Full stock/inventory management
- SMS/WhatsApp notifications
- AI-powered matching engine
- Docker + AWS deployment

---

## Academic note

This project is submitted as a final-year major project. All data shown in the UI is demonstration data. The platform architecture and service layer are structured for real backend integration without requiring significant frontend refactoring.

---

## Troubleshooting

**`node_modules` missing after cloning:**
```bash
npm install
```

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Build fails with TypeScript errors:**
```bash
npm run build 2>&1
```
Check the output and ensure you are using Node 18+.

**Blank screen after login:**
Make sure you selected a role (Learner / Provider / Admin) on the login page before clicking Sign In.
