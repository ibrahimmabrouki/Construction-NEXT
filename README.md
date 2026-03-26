# Construction Platform (Next.js + MongoDB)

Full-stack construction company platform built with Next.js App Router, MongoDB, and Mongoose.

The project includes:
- A public-facing website (home, projects, blog, services, contact)
- An admin dashboard for content and operations management
- Role-based access control (RBAC) for admin features
- Image upload integration with ImgBB

## Quick Start (Seeding)

```bash
npm install
npm run seed
npm run dev
```

Use `npm run seed:reset` only when you want to clear and reseed local data.

## Project Overview

This codebase combines frontend pages and backend APIs in a single Next.js application. Public users can browse projects/services/blog posts and submit project inquiries. Admin users can authenticate and manage blogs, projects, services, users, roles, submissions, and activity.

### Target Users

- General visitors (clients)
- Company administrators
- Content editors (blogs, projects, services)
- Inquiry managers

### Project Objectives

- Build a scalable and maintainable full-stack platform
- Manage website content dynamically without code changes
- Enforce role-based access control for admin operations
- Keep performance strong through server-first rendering patterns
- Deliver a professional, responsive UI for public and admin users

## Key Features

### Public Website
- Home page with featured projects and featured services
- Projects listing and dynamic project details pages
- Blog listing and dynamic blog details pages
- Services and contact pages
- Inquiry submission endpoint per project (`POST /api/projects/[slug]/inquiry`)

### Admin Dashboard
- Cookie-based admin login/logout
- Dashboard cards for projects, blogs, services, and new inquiries
- CRUD management for:
	- Projects
	- Blog posts
	- Services
	- Users
	- Roles
	- Inquiries (review/delete)
- Activity feed with delete action support
- Sidebar visibility controlled by role permissions

## Tech Stack

- **Next.js (App Router)**: unified frontend + backend route handlers in one framework
- **React + TypeScript**: typed component-driven UI and safer code evolution
- **MongoDB + Mongoose**: document storage with schema validation and model-based access
- **Zustand**: lightweight client-side auth/permissions state
- **Axios + Fetch**: API communication (axios for client services, fetch for server components)
- **ImgBB API**: external image hosting for blog/project uploads
- **TailwindCSS (configured) + CSS Modules**: local component styling and utility support

## Architecture

- **Frontend**: Next.js App Router pages under `app/(main)`, `app/(admin)`, and `app/(auth)`
- **Backend**: Next.js route handlers under `app/api/**`
- **Business Layer**:
	- `controllers/*` for request handling and orchestration
	- `server-services/*` for data access utilities
	- `client-services/*` for frontend API wrappers
- **Database Layer**: Mongoose models in `models/*`, connection in `lib/db.ts`
- **Auth/RBAC Layer**: cookie session + middleware checks in `middlewares/authMiddleware.ts`
- **Storage Layer**: ImgBB upload helper in `utils/uploadToImgBB.ts`

## Project Structure

```text
app/
	(main)/                 # Public pages
	(admin)/admin/          # Admin pages and managers
	(auth)/admin-login/     # Admin authentication UI
	api/                    # Route handlers (public, auth, admin)
	components/             # UI and feature components
	store/                  # Zustand auth store

controllers/              # Request/business controllers
server-services/          # Database service helpers
client-services/          # Client API wrappers
models/                   # Mongoose schemas/models
middlewares/              # Auth + authorization middleware
lib/                      # DB and shared libs
utils/                    # Helpers (ImgBB upload, delay)
public/                   # Static assets
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
# Server
MONGODB_URI=mongodb://127.0.0.1:27017/Construction
IMGBB_API_KEY=your_imgbb_api_key

# Optional: when true, seed script clears target collections before reseeding
SEED_RESET=false

# Public API URL composition (used in server components)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
HOME_PUBLIC_URL=/home
BLOG_PUBLIC_URL=/blog
PROJECT_PUBLIC_URL=/projects
SERVICE_PUBLIC_URL=/service

# Admin API URLs (used by client-services)
NEXT_PUBLIC_ADMIN_BLOG_URL=/admin/blog
NEXT_PUBLIC_ADMIN_PROJECT_URL=/admin/project
NEXT_PUBLIC_ADMIN_SERVICE_URL=/admin/service
NEXT_PUBLIC_ADMIN_USER_URL=/admin/user
NEXT_PUBLIC_ADMIN_ROLE_URL=/admin/role
NEXT_PUBLIC_ADMIN_INQUIRY_URL=/admin/inquiry
NEXT_PUBLIC_ADMIN_ACTIVITY_URL=/admin/activity
```

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Initialize Database (Required for first login)

Use the automated seed script to initialize RBAC and sample data.

```bash
npm run seed
```

This seeds in the required order:
- Roles first (`admin` with full CRUD permissions)
- Users second (`admin/admin` linked to seeded admin role)
- Then sample projects, blogs, services, inquiries, and activities

For a full reset + reseed:

```bash
npm run seed:reset
```

Notes:
- `npm run seed` is idempotent (upsert-based) and safe to run multiple times.
- `npm run seed:reset` is destructive for seeded collections and should be used only in local/dev environments.
- In the current `User` model, `roles` is stored as a string array. The seed links role IDs using `adminRoleId.toString()` to match schema behavior.
- User passwords are currently plain text in this codebase; add hashing before production use.

## API Overview

### Public APIs
- `GET /api/blog`
- `GET /api/blog/[slug]`
- `GET /api/projects`
- `GET /api/projects/[slug]`
- `POST /api/projects/[slug]/inquiry`
- `GET /api/service`
- `GET /api/home/featured-projects`
- `GET /api/home/featured-services`
- `POST /api/test-imgbb`

### Auth APIs
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me`
- `GET/POST/PATCH/DELETE /api/users`

### Admin APIs
- Blog: `GET/POST /api/admin/blog`, `PATCH/DELETE /api/admin/blog/[slug]`
- Project: `GET/POST /api/admin/project`, `PATCH/DELETE /api/admin/project/[slug]`
- Service: `GET/POST /api/admin/service`, `PATCH/DELETE /api/admin/service/[id]`
- User: `GET/POST /api/admin/user`, `PATCH/DELETE /api/admin/user/[id]`
- Role: `GET/POST /api/admin/role`, `GET/PATCH/DELETE /api/admin/role/[id]`
- Inquiry: `GET /api/admin/inquiry`, `PATCH/DELETE /api/admin/inquiry/[id]`
- Activity: `GET /api/admin/activity`, `DELETE /api/admin/activity/[id]`
- Dashboard: `GET /api/admin/dashboard`

## Database Design Summary

MongoDB collections (Mongoose models):

- **User**: `username`, `password`, `roles[]`
- **Role**: `name`, `description`, `permissions[{ resource, actions[] }]`
- **Project**: `title`, `slug`, `location`, `price`, `status`, `style`, `description`, `images[]`
- **Blog**: `slug`, `title`, `date`, `category`, `image`, `excerpt`, `content`
- **Service**: `icon`, `title`, `desc`
- **Inquiry**: `name`, `email`, `budget`, `message`, `projectTitle`, `status(New|Reviewed)`
- **Activity**: `user`, `action`, `resource`, `title`

## RBAC (Roles and Permissions)

Authorization is permission-based and enforced in API routes via:
- `authenticateUser(request)`
- `authorizeRoles(user, { resource, action })`

Permissions are attached to role documents and loaded into the `session` cookie at login, then used by:
- Server middleware for endpoint access control
- Client sidebar and UI visibility checks (`useAuthStore`)

Supported action set:
- `create`, `read`, `update`, `delete`

Typical protected resources used in routes:
- `blogs`, `projects`, `services`, `users`, `inquiries`, `roles`, `activities`

Current implementation notes:
- Most admin routes enforce both authentication and permission checks
- `GET /api/admin/role`, `GET /api/admin/role/[id]`, `GET /api/admin/activity`, and `GET /api/admin/dashboard` currently check authentication but do not enforce `authorizeRoles(...)`
- `POST /api/users` (in `/api/users`) is available without admin middleware checks

## Image Upload Flow (ImgBB)

1. Admin submits form data with image file(s)
2. Controller receives multipart form data (`request.formData()`)
3. `uploadToImgBB(file)` posts each file to ImgBB using `IMGBB_API_KEY`
4. Returned image URL(s) are stored in MongoDB document fields:
	 - Blog: `image`
	 - Project: `images[]`

Upload utility location:
- `utils/uploadToImgBB.ts`

## Future Improvements

- Hash and salt passwords before storing
- Add request validation and stricter schema-level validation
- Add rate limiting / anti-spam protection for public inquiry endpoint
- Standardize authorization coverage across all admin endpoints
- Add automated tests (unit + integration + API)
- Add CI pipeline (lint, typecheck, test, build)

## Performance Notes

- Server components are used extensively for data-driven public/admin pages
- `Promise.all(...)` is used for parallel aggregation and count operations in dashboard/stat flows
- Suspense boundaries and loading UI are used in key public sections
- Featured data endpoints reduce payload size for homepage rendering

## Security Notes

- Session cookie is `httpOnly` and scoped to `/`
- RBAC middleware validates resource/action permissions for most mutation/read admin routes
- Known hardening gaps in current code:
	- Plain-text password storage and comparison
	- Inconsistent authorization coverage on some read endpoints
	- No anti-spam/rate-limit controls on public inquiry endpoint

## Lessons Learned

- Designing RBAC early helps keep admin modules maintainable as features grow
- Controller/service separation improves readability and future refactoring
- Dynamic route slugs (`[slug]`) simplify public URL structure
- Session + role propagation from server layout to client store is practical for mixed SSR/CSR dashboards

## Screenshots

Add project visuals here:

- ![Home Page](./docs/screenshots/home.png)
- ![Projects Page](./docs/screenshots/projects.png)
- ![Project Details](./docs/screenshots/project-details.png)
- ![Blog Page](./docs/screenshots/blog.png)
- ![Admin Dashboard](./docs/screenshots/admin-dashboard.png)
- ![Admin Managers](./docs/screenshots/admin-managers.png)

---

This README reflects the current code structure and behavior of this repository.
