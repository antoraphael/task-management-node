# Task Management & Analytics Backend

TypeScript Node.js service providing task, project, and analytics APIs backed by MongoDB plus a dedicated Socket.IO server for real-time task events.

## Features
- RESTful CRUD for users, projects, and tasks
- Task assignment, status transitions (Todo → In Progress → Completed), and time logging
- Analytics endpoints: productivity, completion rates, SLA breaches, workload distribution, estimation accuracy, and more
- Dual-port architecture: Express HTTP API and Socket.IO event stream
- Layered structure (controllers → services → repositories → models) with reusable MongoDB abstractions
- Built-in email + OTP authentication (24h expiry, max 5 attempts, 2-min resend throttle) that issues HTTP-only JWT cookies

## Getting Started

```bash
npm install
cp .env.example .env # adjust ports / Mongo URI
npm run dev
```

The HTTP API listens on `HTTP_PORT` (default `4000`). The Socket.IO gateway broadcasts on `SOCKET_PORT` (default `5000`).

Visit `http://localhost:4000/docs` for live Swagger UI covering every REST endpoint.

## Authentication Flow

1. `POST /api/v1/auth/login` with `{ "email": "user@example.com" }` to request an OTP (can resend every 2 minutes).
2. Retrieve the 6-digit OTP from your email (valid for 24 hours with max 5 attempts).
3. `POST /api/v1/auth/verify-otp` with `{ "email": "...", "otp": "123456" }` to validate and receive the JWT as an HTTP-only cookie named `token`.
4. All other `/api/v1/**` endpoints require that cookie (or duplicate it in an `Authorization: Bearer <token>` header for API testing).

### Required environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `JWT_SECRET` | Secret used to sign login tokens | `change-me` |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `1h`, `2d`) | `1h` |
| `AUTH_COOKIE_NAME` | Cookie key for the JWT | `token` |
| `MAIL_SERVICE` | Nodemailer service (e.g. `gmail`) or set `MAIL_HOST`/`MAIL_PORT` | `gmail` |
| `MAIL_USER` | Gmail/SMTP username | _required_ |
| `MAIL_PASS` | Gmail app password/SMTP password | _required_ |
| `MAIL_FROM` | Sender email shown in notification | `MAIL_USER` |
| `CLIENT_ORIGIN` | Frontend origin allowed by CORS | `http://localhost:3000` |
| `OTP_EXPIRY_MS` | How long OTPs remain valid | `86400000` (24h) |
| `OTP_RESEND_INTERVAL_MS` | Cooldown before issuing another OTP | `120000` (2 min) |
| `OTP_MAX_ATTEMPTS` | Max verification retries per OTP | `5` |

> Tip: When using Gmail, generate an App Password and assign it to `MAIL_PASS`.

## Scripts
- `npm run dev` – start dev server with hot reload
- `npm run build` – compile TypeScript to `dist`
- `npm start` – run compiled server
- `npm run lint` – enforce ESLint rules
- `npm run format` – apply Prettier formatting

## Key Endpoints (prefixed with `/api/v1`)

| Method | Path | Description |
| --- | --- | --- |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id/status` | Advance status |
| POST | `/tasks/:id/assign` | Assign user |
| POST | `/tasks/:id/time-entries` | Log effort |
| GET | `/projects/:id/completion` | Completion percentage |
| GET | `/analytics/team-productivity` | Team metrics |
| GET | `/analytics/bottlenecks` | Slow-moving tasks |
| GET | `/analytics/overdue-tasks` | Past-due items |

Realtime task events are emitted under channels like `task:created`, `task:statusChanged`, etc.