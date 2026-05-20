# AI-Powered Client Portal & Project Intake System

A production-ready, self-hosted web application that serves as both a public-facing client intake system and a private admin dashboard. Potential clients describe their project through a guided multi-step form and receive an AI-generated scope assessment powered by Claude.

---

## 🎯 Features

### Public Side
- **Multi-Step Intake Form** — Guided 5-step form collecting project details
- **AI-Powered Assessment** — Claude Sonnet 4 analyzes projects and provides:
  - Complexity rating (straightforward → enterprise)
  - Estimated timeline
  - Cost tier
  - Recommended tech stack
  - Key considerations and risks
- **Beautiful Results Page** — Public-facing assessment display with unique URL
- **Rate Limiting** — 3 submissions per hour per IP to prevent spam
- **Mobile Responsive** — Perfect experience on all devices

### Admin Side
- **Secure Authentication** — Single admin user with Better Auth
- **Lead Dashboard** — View all submissions with filtering by status
- **Stats Overview** — At-a-glance metrics (new, reviewed, contacted, archived)
- **Lead Detail View** — Complete project info, AI assessment, and contact details
- **Status Management** — Track lead progress (new → reviewed → contacted → archived)
- **Admin Notes** — Private notes for each submission
- **Email Notifications** — Instant email on new submissions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL (Neon) + Drizzle ORM |
| **API** | tRPC (type-safe end-to-end) |
| **AI** | Anthropic Claude Sonnet 4 |
| **Auth** | Better Auth (self-hosted) |
| **Email** | Resend |
| **Rate Limiting** | Upstash Redis |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Anthropic API key
- Resend API key
- Upstash Redis (for rate limiting)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/client-portal.git
   cd client-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `AUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `ANTHROPIC_API_KEY` — From https://console.anthropic.com
   - `RESEND_API_KEY` — From https://resend.com
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` — From https://upstash.com
   - `ADMIN_EMAIL` — Your email for notifications

4. **Push database schema:**
   ```bash
   npm run db:push
   ```

5. **Create admin user:**
   ```bash
   npm run db:seed
   ```
   
   This creates an admin account with the email from `ADMIN_EMAIL` and password `admin123`. Change it after first login!

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Open the app:**
   - Public intake form: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

---

## 📁 Project Structure

```
client-portal/
├── app/
│   ├── intake/              # Public intake form
│   ├── assessment/[id]/     # Public assessment results
│   ├── admin/               # Protected admin dashboard
│   │   ├── login/          # Admin login
│   │   ├── leads/[id]/     # Lead detail view
│   │   └── page.tsx        # Dashboard (lead list)
│   └── api/
│       ├── trpc/           # tRPC endpoints
│       └── auth/           # Better Auth routes
├── server/
│   ├── db/                 # Drizzle schema & client
│   ├── trpc/               # tRPC routers
│   ├── ai/                 # Claude integration
│   ├── email/              # Resend notifications
│   ├── actions/            # Server actions
│   └── auth.ts             # Better Auth config
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Admin sidebar
│   └── shared/             # Shared components
├── lib/
│   ├── validators.ts       # Zod schemas
│   ├── constants.ts        # Static data
│   ├── rate-limit.ts       # Upstash rate limiter
│   ├── auth-client.ts      # Better Auth client
│   └── trpc-client.tsx     # tRPC client
└── scripts/
    └── seed-admin.ts       # Admin user seed
```

---

## 🔐 Security

- **Rate Limiting:** 3 submissions per hour per IP address
- **Authentication:** Secure session-based auth with Better Auth
- **Input Validation:** All form inputs validated with Zod
- **SQL Injection Protection:** Drizzle ORM prevents SQL injection
- **Environment Variables:** All secrets stored in `.env.local`

---

## 📊 Database Schema

### `submissions`
Stores all project submissions with client info, project details, budget, timeline.

### `assessments`
Stores AI-generated assessments linked 1:1 to submissions.

### `admin_users`
Single admin user for dashboard access.

---

## 🎨 Customization

### Update Email Template
Edit `server/email/send-notification.ts` to customize notification content.

### Modify AI Prompt
Edit `server/ai/prompts.ts` to adjust complexity ratings or assessment criteria.

### Change Form Fields
- Update `lib/constants.ts` for project types, budgets, timelines
- Update `lib/validators.ts` for validation rules
- Update form step components in `app/intake/_components/`

### Styling
All styling uses Tailwind CSS. Update `app/globals.css` for global styles.

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your repository
   - Add all environment variables from `.env.example`
   - Deploy!

3. **Run migrations:**
   ```bash
   npm run db:push
   ```

4. **Create admin user:**
   Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel environment variables, then:
   ```bash
   npm run db:seed
   ```

### Self-Hosted

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

---

## 📝 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Session secret (32+ chars) | Yes |
| `AUTH_URL` | Public URL of your app | Yes |
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `RESEND_API_KEY` | Email API key | Yes |
| `UPSTASH_REDIS_REST_URL` | Redis URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token | Yes |
| `ADMIN_EMAIL` | Admin notification email | Yes |
| `ADMIN_PASSWORD` | Admin password (for seed script) | No |

---

## 🧪 Testing

Currently, the project includes manual testing. Automated tests will be added in future iterations.

To test the full flow:
1. Visit `/intake` and complete the form
2. View the AI assessment on the results page
3. Log in to `/admin` to see the submission
4. Update status and add notes

---

## 🤝 Contributing

This is a portfolio project but contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Fork and customize for your own use

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

## 💡 Future Enhancements

- [ ] Calendly integration for direct booking
- [ ] PDF export of assessments
- [ ] Analytics dashboard (conversion metrics)
- [ ] Multi-language support (English/Spanish)
- [ ] Automated follow-up emails
- [ ] CRM integration (HubSpot, Pipedrive)
- [ ] File upload support (briefs, wireframes)
- [ ] Revised estimates (manual adjustment by admin)

---

## 👨‍💻 About

Built as a production-ready portfolio piece demonstrating:
- Full-stack Next.js development
- AI integration (Claude API)
- Type-safe APIs (tRPC)
- Modern authentication (Better Auth)
- Clean UI/UX (Tailwind + shadcn/ui)
- Production best practices (rate limiting, validation, error handling)

---

**Made with ❤️ and Claude**
