# 🎓 LearnIt - E-Learning Management System

A full-stack Learning Management System (LMS): tutors create and sell courses, learners buy them, watch chapters, take quizzes and earn certificates.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=flat&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 👥 Roles
- **Learner**: browse, buy and take courses
- **Tutor**: create, publish and sell courses
- The role is chosen once, right after the first sign-in
- Separate dashboards for each role

### 📚 Course management (tutor)
- Courses with rich-text descriptions, categories and pricing
- Chapters with drag-and-drop reordering, free preview chapters and resources
- Video upload via **EdgeStore**; the chapter length is read from the video itself
- Quizzes with a required passing score
- Coupons with expiry dates
- Publish checks: a course, chapter or quiz can't go live until it is complete
- Revenue and enrollment analytics

### 🎯 Learning experience (learner)
- Browse by category, search, and preview courses before buying
- Video player with progress tracking and resume
- Chapter completion and course progress
- Timestamped notes while watching
- Whiteboard (Excalidraw) per chapter
- Q&A on each chapter
- Quizzes with results and **retakes**
- Certificate on course completion (viewable and downloadable)
- Ratings and reviews (1-5 stars)

### 💳 Payments
- **Razorpay** (cards, UPI, net banking), single course or a whole cart
- **Demo checkout** while the Razorpay keys are unset, so the purchase flow works without a gateway
- Coupon codes
- Server-side signature verification, plus the Razorpay webhook as a fallback
- Cart saved to the learner's account

### 🤖 AI assistant
- Chapter-aware chat powered by **Ollama**, called from the server (`/api/ai/chat`), so it works when deployed
- Uses the chapter's title and transcript as context
- Only available to people who can watch the chapter

### 🔐 Security
- **Better Auth** with Google and GitHub sign-in
- Database sessions with a short-lived cookie cache
- Role checks and ownership checks on every tutor endpoint
- Paid chapters, Q&A and the AI assistant only for people who can watch the chapter
- Zod validation on all write endpoints
- Postgres-backed rate limiting on checkout, coupons, Q&A, quizzes, reviews, notes, cart and AI

## 🛠️ Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI), Lucide icons, next-themes |
| Database | [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/), [Prisma 6](https://www.prisma.io/) |
| Auth | [Better Auth](https://www.better-auth.com/) (Google, GitHub OAuth) |
| State & data | [Zustand](https://zustand-demo.pmnd.rs/), [TanStack Query](https://tanstack.com/query), [SWR](https://swr.vercel.app/), React Hook Form + [Zod](https://zod.dev/) |
| Payments | [Razorpay](https://razorpay.com/) |
| Files & media | [EdgeStore](https://edgestore.dev/) (videos, files), [Cloudinary](https://cloudinary.com/) (images) |
| Rich content | [BlockNote](https://www.blocknotejs.org/) editor, [Excalidraw](https://excalidraw.com/) |
| AI | [Ollama](https://ollama.com/) |
| UI extras | Recharts, Embla Carousel, @hello-pangea/dnd, Lottie, react-confetti |

## 🚀 Getting started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (a free [Neon](https://neon.tech/) database works)
- Google and/or GitHub OAuth app
- EdgeStore and Cloudinary accounts
- Optional: Razorpay keys (without them, checkout runs in demo mode)
- Optional: Ollama (without it, the AI assistant is turned off)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Chiragj2003/lms.git
   cd lms
   npm install
   ```
   `npm install` also runs `prisma generate`.

2. **Environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `.env`. Every variable is explained in [`.env.example`](.env.example). The main groups:

   | Variables | Purpose |
   | --- | --- |
   | `DATABASE_URL` | Postgres connection string |
   | `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` | Better Auth secret and the app's origin |
   | `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` | OAuth sign-in (callback: `/api/auth/callback/google` or `/github`) |
   | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Payments. Set both keys or neither; empty means demo checkout |
   | `EDGE_STORE_ACCESS_KEY/SECRET_KEY` | Video and file uploads |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Course images |
   | `OLLAMA_HOST`, `OLLAMA_API_KEY`, `OLLAMA_MODEL` | AI assistant (optional) |

3. **Create the database tables**
   ```bash
   npx prisma db push
   ```
   The project has no migrations folder; the schema in `prisma/schema.prisma` is applied with `db push`.

4. **(Optional) Seed demo data**
   ```bash
   node scripts/seed-demo.mjs
   ```
   This creates demo courses, chapters, quizzes, purchases and reviews. It needs at least one user who has signed in and picked the Tutor role.

5. **Run it**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## 📁 Project structure

```
lms/
├── app/
│   ├── (public)/        # Home, course listings, sign-in, help/privacy/terms
│   ├── (site)/          # Signed-in pages
│   │   ├── (learner)/   # Learning, cart, quizzes, certificates, profile
│   │   └── tutor/       # Course editor and analytics
│   ├── api/             # Route handlers (auth, courses, user, cart, ai, webhook, edgestore)
│   └── checkout/        # Demo checkout pages (single course and cart)
├── components/          # UI components, grouped by feature
├── hooks/               # React hooks (Zustand stores, queries)
├── lib/                 # Auth, DB, rate limiting, access checks, helpers
├── prisma/schema.prisma # Database schema
├── providers/           # Theme, query, modal and toast providers
├── schemas/             # Zod schemas
├── scripts/             # Seed and maintenance scripts
└── server/              # Server-side data loaders
```

## 🔄 Payment flow

1. The learner enrolls in a course, or checks out their cart.
2. The server creates a Razorpay order and records the course(s) in the order's notes.
3. The learner pays in the Razorpay popup.
4. The server verifies the signature, and that the order belongs to this learner and these courses.
5. Purchases are created (the webhook does the same as a fallback) and access is immediate.

With no Razorpay keys set, steps 2–4 are replaced by the demo checkout, which enrolls the learner without charging them.

## 🧪 Checks

```bash
npm run lint       # ESLint
npx tsc --noEmit   # Type check
npm run build      # Production build
```

## 📦 Deployment (Vercel)

1. Import the repository in Vercel.
2. Add every variable from `.env` in **Project → Settings → Environment Variables**. Set `NEXT_PUBLIC_APP_URL` to your real domain.
3. Add your production callback URLs to the Google and GitHub OAuth apps.
4. For the AI assistant, `OLLAMA_HOST` must be reachable from Vercel, for example Ollama Cloud with `OLLAMA_API_KEY`. `localhost` won't work there.
5. In the Razorpay dashboard, point the webhook at `https://YOUR-DOMAIN/api/webhook`.

## 👨‍💻 Author

**Chirag Jain** · GitHub: [@Chiragj2003](https://github.com/Chiragj2003)
