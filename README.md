# WorkSpark

A Tinder style job matching platform. Job seekers swipe through job cards to apply, and recruiters swipe through applicants to shortlist them. It is a full MERN stack app with JWT auth, separate dashboards for the two roles, resume uploads, saved jobs, and interview scheduling.

Live app: https://workspark.vercel.app/home

## What it does

**For job seekers**
* Swipe right to apply, swipe left to skip. Every job you see is remembered so you never get the same card twice.
* Filter the stack by location, work mode, job type, minimum experience, and required skills.
* Build a profile with skills, education, experience, expected salary, availability, and a PDF resume.
* Track everything you applied to, save jobs for later, and see interviews recruiters have scheduled for you.

**For recruiters**
* Post jobs with title, company, location, salary, work mode, required experience, and a full description.
* Swipe through applicants for each job and mark them accepted, rejected, or on hold.
* Review held and accepted applicants on dedicated pages.
* Schedule or cancel interviews with a date and meeting link.

**Shared**
* Email and password signup with role selection, passwords hashed with bcrypt.
* JWT based sessions with protected routes on both the client and the API.
* Forgot password flow that emails a time limited reset link through Resend.

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion, Axios |
| Backend  | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Auth     | JWT, bcryptjs |
| Uploads  | Multer (PDF resumes) |
| Email    | Resend |
| Hosting  | Vercel (frontend), Render (backend) |

## Project structure

```
WorkSpark/
├── backend/
│   ├── config/db.js            MongoDB connection
│   ├── middleware/             JWT auth middleware
│   ├── models/                 User, Job, Application, SavedJob schemas
│   ├── routes/                 auth, users, jobs, applications, savedJobs
│   ├── seed/                   seed scripts for demo data
│   ├── uploads/resumes/        uploaded PDF resumes
│   └── server.js               Express entry point
└── frontend/
    └── src/
        ├── components/         navbar, auth forms, route guards, error boundary
        ├── context/            auth context and provider
        ├── pages/
        │   ├── JobSeeker/      swipe dashboard, profile, applications, saved jobs, interviews
        │   └── Recruiter/      swipe dashboard, job form, manage jobs, applicant pages
        └── pages/api.js        shared Axios instance
```

## Getting started

### Prerequisites
* Node.js 18 or newer
* A MongoDB database (local or Atlas)
* A Resend API key if you want the password reset emails to send

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
PORT=5000
RESEND_API_KEY=your_resend_key
EMAIL_FROM=your_verified_sender@example.com
```

Run it:

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

To fill the database with sample jobs:

```bash
npm run seed:jobs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the app on `http://localhost:5173`.

The frontend points at the deployed backend by default. To use your local API instead, change the `baseURL` in `frontend/src/pages/api.js` to `http://localhost:5000`.

## How the matching works

Every job a seeker swipes on is pushed into a `seenJobs` list on their user record. The dashboard only requests jobs from `/jobs/unseen`, so the stack keeps shrinking as they go and old cards never reappear. Applying creates an `Application` document, and a unique index on the job and jobseeker pair stops anyone from applying to the same job twice.

On the recruiter side, each job pulls in its applicants through the `/jobs/my-jobs` endpoint. Marking an applicant accepted, rejected, or held updates the application status, which moves them off the swipe stack and onto the matching applicant page.

## API overview

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/auth/signup` | Register a job seeker or recruiter |
| POST | `/auth/login` | Log in and receive a JWT |
| POST | `/auth/forgot-password` | Send a reset link by email |
| POST | `/auth/reset-password/:token` | Set a new password |
| GET | `/users/me` | Get the logged in user |
| PUT | `/users/me` | Update profile fields |
| POST | `/users/upload-resume` | Upload a PDF resume |
| GET | `/jobs` | List all jobs |
| GET | `/jobs/unseen` | Jobs the seeker has not swiped yet |
| POST | `/jobs` | Post a job (recruiter) |
| PUT | `/jobs/:id` | Edit a job (recruiter) |
| DELETE | `/jobs/:id` | Delete a job (recruiter) |
| GET | `/jobs/my-jobs` | A recruiter's jobs with applicants |
| POST | `/applications` | Apply to a job |
| PATCH | `/applications/:id/status` | Accept, reject, or hold an applicant |
| PATCH | `/applications/:id/schedule` | Schedule an interview |
| GET | `/applications/my-interviews` | A seeker's scheduled interviews |
| GET | `/savedJobs` | Saved jobs |
| POST | `/savedJobs` | Save a job |

All routes except signup, login, and the public job list require a `Bearer` token.

## Author

Built by Nihal Manjunath.
