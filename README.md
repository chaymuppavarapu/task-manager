# Team Task Manager

Minimal full-stack task manager using React (Vite), Tailwind CSS, and Supabase.

## Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example` and fill values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run `supabase/schema.sql` in Supabase SQL editor.
4. Start app:
   - `npm run dev`

## Features

- Email/password auth (signup/login) with role selection (`admin` / `member`)
- Project creation and team member assignment to projects (admin)
- Task creation and assignment with due date (admin)
- Task status tracking (`todo` / `done`)
- Role-based access:
  - Admin: manage projects, team members, tasks, and all task statuses
  - Member: view relevant tasks and update own assigned tasks
- Dashboard stats: total, completed, pending, overdue
