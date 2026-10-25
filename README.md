# Saraha Web

Frontend for **Saraha** — an anonymous messaging app inspired by Sarahah. Users share a public link; anyone can send honest messages (optionally with images). Logged-in senders can reveal their identity so recipients can reply.

**Live:** [saraha-web.vercel.app](https://saraha-web.vercel.app)  
**API:** [saraha-api](https://saraha-app-teal-sigma.vercel.app/api-docs)

---

## Features

- **Auth** — email/password signup with OTP confirmation, login, forgot password, Google OAuth (NextAuth)
- **Inbox** — paginated infinite-scroll messages at `/`
- **Share link** — dashboard card to copy/share `/u/{userId}`
- **Public send page** — anonymous or identified send + up to 2 image attachments
- **Replies** — reply when the sender was logged in (anonymous messages cannot be replied to)
- **Settings** — profile, avatar, gallery, password (system accounts only), freeze/restore/delete
- **Roles** — admins can manage other users’ freeze/restore/delete

---

## Tech stack

| Layer        | Choice                                      |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 16 (App Router) + React 19          |
| Auth         | NextAuth.js (JWT session)                   |
| Data / forms | TanStack Query, TanStack Form, Zod          |
| UI           | Tailwind CSS 4, shadcn/ui (Base UI), Sonner |
| Deploy       | Vercel                                      |

---

## Project structure

```text
src/app/
  (auth)/          # login, signup, forget-password
  (home)/          # inbox + reply modal
  dashboard/       # share-link card
  settings/        # profile, security, account management
  u/[id]/          # public send page
  api/             # NextAuth + BFF routes (profile, messages, …)
src/proxy.ts       # auth gate + silent token refresh
src/auth.ts        # NextAuth options
```

---

## Prerequisites

- Node.js **20+**
- **pnpm** (lockfile is pnpm)
- Running **Saraha backend** URL (local or deployed)

---

## Setup

```bash
git clone https://github.com/Mo7med3li/saraha-web.git
cd saraha-web
pnpm install
```

Create a `.env` file in the project root (do **not** commit secrets):

```env
# Backend API base URL (no trailing slash)
DATABASE_URL=https://your-api.example.com

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-long-random-string

# Local cookie name only (omit on Vercel production HTTPS)
NEXT_AUTH_SESSION_TOKEN=next-auth.session-token

# Google OAuth (same Web client as the backend)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secret:

```bash
openssl rand -hex 32
```

### Google Cloud

Authorized redirect URIs must include:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://saraha-web.vercel.app/api/auth/callback/google`

---

## Scripts

```bash
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # ESLint
```

---

## Main routes

| Path                                    | Access  | Description              |
| --------------------------------------- | ------- | ------------------------ |
| `/`                                     | Private | Inbox                    |
| `/dashboard`                            | Private | Share your link          |
| `/settings`                             | Private | Profile & account        |
| `/u/[id]`                               | Public  | Send a message to a user |
| `/login`, `/signup`, `/forget-password` | Public  | Auth flows               |

---

## Environment notes (Vercel)

| Variable                  | Production tip                                                               |
| ------------------------- | ---------------------------------------------------------------------------- |
| `NEXTAUTH_URL`            | Exact site origin, e.g. `https://saraha-web.vercel.app` (no path, no query)  |
| `NEXT_AUTH_SESSION_TOKEN` | **Do not set** on production (HTTPS uses `__Secure-next-auth.session-token`) |
| `DATABASE_URL`            | Your deployed backend URL                                                    |
| `NEXTAUTH_SECRET`         | Same across deploys; never commit it                                         |

After changing env vars, **redeploy** Production and clear site cookies if auth redirects misbehave.

---

## Related backend

This app expects REST endpoints such as:

- `POST /auth/login`, `/auth/signup`, Google + OTP flows
- `GET/PATCH /users/...` (profile, password, freeze, gallery, …)
- `GET /messages/:userId` (paginated inbox)
- `POST /messages/:receiverId` (anonymous)
- `POST /messages/:receiverId/sender` (identified)
- `POST /messages/:messageId/reply`

See the **saraha-backend** repo / `https://saraha-app-teal-sigma.vercel.app/api-docs` for the full contract.

---

## License

Private / personal project — update this section if you open-source it.
