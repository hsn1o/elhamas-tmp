# Admin CMS Plan – Elham Nasser Abu Sarahd Website

This document is the step-by-step plan to build an admin CMS for the website, including login, session handling, and CRUD for all content types.

---

## 1. Current Stack & Schema Summary

| Item | Details |
|------|--------|
| **Framework** | Next.js 16 (App Router) |
| **DB** | PostgreSQL via Prisma (Supabase) |
| **Auth models** | `AdminUser`, `Session` (already in schema) |
| **Content models** | Hotel, TourPackage, Event, Transportation, BlogPost, Testimonial, SiteSetting |
| **User-generated** | ContactInquiry, Booking |

**Existing app structure**

- Public site: `app/(public)/` — home, hotels, packages, events, transportation.
- No admin or auth routes yet.

---

## 2. Plan Overview

| Phase | Focus | Deliverables |
|-------|--------|--------------|
| **1** | Auth & layout | Login, logout, session, admin layout, middleware |
| **2** | Dashboard & settings | Dashboard home, Site Settings CRUD |
| **3** | Content CRUD | Hotels, Tour Packages, Events, Transportation |
| **4** | Blog & testimonials | Blog posts, Testimonials |
| **5** | Inquiries & bookings | Contact inquiries, Bookings (list/detail/status) |
| **6** | Polish | Roles (optional), audit log (optional), seed script |

---

## 3. Phase 1 – Authentication & Admin Layout

**Goal:** Only authenticated admins can access `/admin/*`; unauthenticated users are redirected to `/admin/login`.

### 3.1 Schema (optional cleanup)

- Add relation from `Session` to `AdminUser` in `prisma/schema.prisma` (for cleaner queries and future cascade):

```prisma
model Session {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  user      AdminUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique @db.VarChar(255)
  expiresAt DateTime @map("expires_at") @db.Timestamptz(6)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
}

model AdminUser {
  // ... existing fields ...
  sessions Session[]
}
```

- Run migrations after any schema change.

### 3.2 Auth implementation

- **Password hashing:** Use `bcryptjs` (or Node `crypto.scrypt`) — add dependency and a small util (e.g. `lib/auth.ts`: `hashPassword`, `verifyPassword`).
- **Sessions:** Create a session record on login (generate secure token, set `expiresAt`), store session id in an **HTTP-only cookie** (e.g. `admin_session`).
- **Session lookup:** Helper that:
  - Reads cookie → finds `Session` by token (and optionally joins `AdminUser`).
  - Returns admin user if session exists and `expiresAt > now`; else returns `null` and optionally deletes expired session.

**Files to add/update:**

- `lib/auth.ts` – hash/verify, create/validate session, `getSession(request?)`.
- `app/admin/login/page.tsx` – login form (email + password).
- `app/api/auth/login/route.ts` – POST: validate credentials, create session, set cookie, redirect to `/admin`.
- `app/api/auth/logout/route.ts` – POST: clear session in DB, clear cookie, redirect to `/admin/login`.
- `middleware.ts` – protect `/admin` and `/admin/*` (except `/admin/login`): if no valid session → redirect to `/admin/login`; if valid → allow.

### 3.3 Admin layout

- **Route group:** `app/(admin)/admin/` so all admin routes share one layout.
- **Layout:** `app/(admin)/admin/layout.tsx` – sidebar + top bar; sidebar links: Dashboard, Site Settings, Hotels, Packages, Events, Transportation, Blog, Testimonials, Inquiries, Bookings; user menu with logout.
- **Dashboard home:** `app/(admin)/admin/page.tsx` – simple dashboard (e.g. counts: inquiries, bookings, recent activity or “quick stats” from existing models).

**Dependencies**

- Add `bcryptjs` and `@types/bcryptjs` (or use Node `crypto` only; no extra deps).

---

## 4. Phase 2 – Dashboard & Site Settings

**Goal:** One place to view high-level stats and manage global site settings.

### 4.1 Dashboard (`/admin`)

- Reuse or extend `app/(admin)/admin/page.tsx`.
- Fetch counts (e.g. ContactInquiry, Booking, maybe unread inquiries).
- Optional: small “recent inquiries” or “recent bookings” list.

### 4.2 Site Settings

- **List:** `app/(admin)/admin/settings/page.tsx` – list all `SiteSetting` rows (key, valueEn, valueAr).
- **Edit:** `app/(admin)/admin/settings/[id]/page.tsx` or single “edit all” page – form with key (read-only), valueEn, valueAr.
- **API:** `app/api/admin/settings/route.ts` (GET list, PATCH update) or server actions in the same app dir; use Prisma `SiteSetting` model.

---

## 5. Phase 3 – Content CRUD (Hotels, Packages, Events, Transportation)

**Goal:** Full create / read / update / delete for each content type, with EN/AR support and images.

### 5.1 Shared patterns (for each entity)

- **List:** `app/(admin)/admin/[entity]/page.tsx` – table/cards with name (en/ar), status (isActive/isFeatured), actions (Edit, Delete).
- **Create:** `app/(admin)/admin/[entity]/new/page.tsx` – form with all fields (EN/AR where applicable), image URL(s), arrays (e.g. amenities, gallery).
- **Edit:** `app/(admin)/admin/[entity]/[id]/page.tsx` – same form, load by id, update.
- **Delete:** Either button that calls API (e.g. `DELETE /api/admin/[entity]/[id]`) or server action; confirm before delete.
- **APIs:** `app/api/admin/[entity]/route.ts` (GET list, POST create), `app/api/admin/[entity]/[id]/route.ts` (GET one, PATCH, DELETE). Use Prisma and validate input (e.g. Zod).

### 5.2 Entities and specifics

| Entity | Route segment | Notes |
|--------|----------------|--------|
| Hotels | `hotels` | nameEn/Ar, descriptions, location, city, distanceToHaram, starRating, pricePerNight, imageUrl, gallery[], amenities[], isFeatured, isActive |
| Tour packages | `packages` | titleEn/Ar, slug, descriptions, packageType, durationDays, price, inclusions/exclusions (arrays), itinerary (JSON), imageUrl, gallery[], departureDates[], isFeatured, isActive |
| Events | `events` | titleEn/Ar, slug, descriptions, eventDate, endDate, locationEn/Ar, imageUrl, gallery[], price, maxAttendees, isFeatured, isActive |
| Transportation | `transportation` | nameEn/Ar, descriptions, vehicleType, capacity, pricePerTrip/pricePerDay, imageUrl, featuresEn/Ar[], isFeatured, isActive |

- **Slug:** For TourPackage and Event, auto-generate from title (e.g. EN) or allow edit; ensure uniqueness in API.
- **Images:** Start with URL fields (imageUrl, gallery); later you can add file upload (e.g. Supabase Storage) and store URLs.

---

## 6. Phase 4 – Blog & Testimonials

**Goal:** Manage blog posts and testimonials from the admin.

### 6.1 Blog

- **List:** `app/(admin)/admin/blog/page.tsx` – title, slug, category, isPublished, publishedAt.
- **Create/Edit:** `app/(admin)/admin/blog/new/page.tsx` and `app/(admin)/admin/blog/[id]/page.tsx` – titleEn/Ar, slug, excerptEn/Ar, contentEn/Ar (textarea or rich text later), imageUrl, category, tags[], isPublished, publishedAt. Optionally set `authorId` to current admin user.
- **API:** `app/api/admin/blog/route.ts` and `app/api/admin/blog/[id]/route.ts` (Prisma `BlogPost`).

### 6.2 Testimonials

- **List:** `app/(admin)/admin/testimonials/page.tsx` – name, rating, isFeatured, isActive.
- **Create/Edit:** `app/(admin)/admin/testimonials/new/page.tsx` and `app/(admin)/admin/testimonials/[id]/page.tsx` – nameEn/Ar, contentEn/Ar, rating, imageUrl, location, isFeatured, isActive.
- **API:** `app/api/admin/testimonials/route.ts` and `app/api/admin/testimonials/[id]/route.ts`.

---

## 7. Phase 5 – Contact Inquiries & Bookings

**Goal:** View and manage inquiries and bookings (no “create” from admin; only list, view, update status).

### 7.1 Contact Inquiries

- **List:** `app/(admin)/admin/inquiries/page.tsx` – name, email, subject, inquiryType, status, isRead, createdAt; filter by status/read.
- **Detail:** `app/(admin)/admin/inquiries/[id]/page.tsx` – full message; actions: mark read, set status (e.g. new / in_progress / resolved).
- **API:** GET list (with optional query params), GET one, PATCH (status, isRead).

### 7.2 Bookings

- **List:** `app/(admin)/admin/bookings/page.tsx` – bookingType, referenceId, customerName, customerEmail, numGuests, totalPrice, status, bookingDate, createdAt.
- **Detail:** `app/(admin)/admin/bookings/[id]/page.tsx` – all booking fields; change status (e.g. pending, confirmed, cancelled).
- **API:** GET list, GET one, PATCH status (and optionally other fields).

---

## 8. Phase 6 – Polish & Optional Enhancements

- **First admin user:** Script or one-time API (e.g. `scripts/seed-admin.ts` or protected route) to create initial `AdminUser` with hashed password (run once, then disable or protect).
- **Roles:** Schema already has `AdminUser.role`; later you can restrict by role (e.g. only “superadmin” can manage Site Settings or other admins).
- **Audit log:** Optional table (e.g. who changed what and when) for sensitive actions; can be added later.
- **Image uploads:** Replace URL-only fields with Supabase Storage (or similar) and store URLs in existing fields.

---

## 9. Suggested Folder Structure (Admin)

```
app/
  (admin)/
    admin/
      layout.tsx           # Sidebar + top bar, auth check
      page.tsx             # Dashboard
      login/
        page.tsx           # Login form
      settings/
        page.tsx
        [id]/page.tsx
      hotels/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      packages/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      events/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      transportation/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      blog/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      testimonials/
        page.tsx
        new/page.tsx
        [id]/page.tsx
      inquiries/
        page.tsx
        [id]/page.tsx
      bookings/
        page.tsx
        [id]/page.tsx
  api/
    auth/
      login/route.ts
      logout/route.ts
    admin/
      settings/...
      hotels/...
      packages/...
      events/...
      transportation/...
      blog/...
      testimonials/...
      inquiries/...
      bookings/...
lib/
  auth.ts                  # Session, hash, getSession
middleware.ts              # Protect /admin, allow /admin/login
```

---

## 10. Implementation Order (Checklist)

- [x] **1.1** Add Session ↔ AdminUser relation (optional), run migration.
- [x] **1.2** Add `lib/auth.ts` (hash, session create/validate, getSession).
- [x] **1.3** Add `app/api/auth/login/route.ts` and `app/api/auth/logout/route.ts`.
- [x] **1.4** Add `app/(admin)/admin/login/page.tsx` and `app/(admin)/admin/layout.tsx`.
- [x] **1.5** Protection via admin layout (redirect when no session); no middleware (avoids Edge/Prisma).
- [x] **1.6** Add `app/(admin)/admin/page.tsx` (temp dashboard with counts).
- [ ] **2.1** Dashboard: fetch and show counts (inquiries, bookings, etc.).
- [ ] **2.2** Site Settings: list + edit page + API.
- [ ] **3.1** Hotels: list, new, edit, delete + API.
- [ ] **3.2** Packages: list, new, edit, delete + API.
- [ ] **3.3** Events: list, new, edit, delete + API.
- [ ] **3.4** Transportation: list, new, edit, delete + API.
- [ ] **4.1** Blog: list, new, edit, delete + API.
- [ ] **4.2** Testimonials: list, new, edit, delete + API.
- [ ] **5.1** Inquiries: list, detail, mark read, set status + API.
- [ ] **5.2** Bookings: list, detail, set status + API.
- [ ] **6.1** Seed script for first admin user.
- [ ] **6.2** (Optional) Roles, audit log, image upload.

---

## 11. Security Reminders

- Use **HTTP-only, Secure, SameSite** cookies for the session.
- Validate and sanitize all inputs (Zod + Prisma).
- Ensure every admin API checks session (e.g. reuse `getSession` and return 401 if null).
- Run admin under HTTPS in production.
- Never log or expose password hashes or session tokens.

---

You can use this plan as the single source of truth: implement Phase 1 first (auth + layout + middleware), then proceed through phases 2–6 in order. If you tell me which phase you want to start with (e.g. “Phase 1” or “login and middleware”), I can outline or implement the exact code next.
