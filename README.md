# AI Career Accelerator

Local development supports two frontends:

- Next.js website: `http://localhost:3000`
- Streamlit app: `http://localhost:8501`

Backend API runs at `http://localhost:8000`.

## Run with Docker Compose

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

   Windows CMD:

   ```bat
   copy .env.example .env
   ```

2. Start services:

   ```bash
   docker compose up --build
   ```

## Verify backend health

- `http://localhost:8000/health`
- `http://localhost:8000/health/db`
- `http://localhost:8000/health/email`
- `http://localhost:8000/docs`

## Verify website flow (Next.js)

1. Open `http://localhost:3000`.
2. Register/login.
3. Confirm routing:
   - candidate → `/dashboard`
   - recruiter → `/recruiter/dashboard`
4. Check protected pages load after login:
   - `/profile`
   - `/jobs`
   - `/notifications`

## Frontend API configuration

The Next.js app reads:

- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)

Set this in:

- root `.env` (used by docker-compose)
- `frontend/.env.local` for local frontend-only runs
