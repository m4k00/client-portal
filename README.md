# AI-Powered Client Portal & Project Intake System

A self-hosted web application that serves as both a public-facing client intake system and a private admin dashboard. Potential clients describe their project through a guided multi-step form and receive an AI-generated scope assessment.

## 🎯 Project Status

**Current Phase:** Foundation & Database Setup (Phase 1)

This is a portfolio-grade production tool demonstrating full-stack engineering, AI integration, and clean UI/UX.

## ✨ Planned Features

### Public Side
- Multi-step project intake form
- AI-powered scope assessment (complexity, timeline, cost tier)
- Public results page with unique URL
- Mobile-responsive design

### Admin Side
- Secure authentication (single admin user)
- Lead management dashboard
- Status tracking (new/reviewed/contacted/archived)
- Admin notes and annotations
- Email notifications on new submissions

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **API:** tRPC (type-safe)
- **AI:** Anthropic Claude API
- **Auth:** Better Auth
- **Email:** Resend
- **Rate Limiting:** Upstash Redis
- **Hosting:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Anthropic API key
- Resend API key (for email)
- Upstash Redis (for rate limiting)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/client-portal.git
   cd client-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in all required values.

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Create the admin user:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
client-portal/
├── app/                  # Next.js App Router pages
│   ├── intake/          # Public intake form
│   ├── assessment/      # Public assessment results
│   ├── admin/           # Admin dashboard
│   └── api/             # API routes (tRPC, auth)
├── server/
│   ├── db/              # Database schema & client
│   ├── trpc/            # tRPC routers
│   ├── ai/              # AI assessment engine
│   ├── email/           # Email notifications
│   └── actions/         # Server actions
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── shared/          # Shared components
└── lib/                 # Utilities, validators, constants
```

## 📖 Development Phases

- [x] **Phase 1:** Foundation & Database
- [ ] **Phase 2:** Intake Form
- [ ] **Phase 3:** AI Assessment Engine
- [ ] **Phase 4:** Public Assessment Page
- [ ] **Phase 5:** Admin Authentication
- [ ] **Phase 6:** Admin Dashboard
- [ ] **Phase 7:** Email & Rate Limiting
- [ ] **Phase 8:** Polish & Documentation

## 🔐 Security

- Rate limiting on form submissions (3/hour per IP)
- Single admin user (no public registration)
- Secure session management with Better Auth
- Input validation with Zod
- SQL injection protection via Drizzle ORM

## 📝 License

MIT

---

**Note:** This is a work in progress. See the full [PROJECT PLAN](./docs/PROJECT_PLAN.md) for detailed implementation roadmap.
