# RoadReach Website — Governance & Decision Log

**Project:** RoadReach Media — mobile billboard advertising network  
**Repository:** `roadreach-website` (GitHub → Vercel auto-deploy)  
**Live URL:** https://www.roadreach.co.za/  
**Updated:** 27 June 2026

---

## Deployment Pipeline

| Stage | Service | Notes |
|---|---|---|
| Source control | GitHub (`main` branch) | Push triggers Vercel deploy |
| Hosting | Vercel | Node.js serverless functions in `/api/` |
| Domain | roadreach.co.za | Vercel-managed DNS |
| Email | ZohoMail SMTP (smtp.zoho.com:465, SSL) | Nodemailer with app password |

---

## Decision Log

### 2026-06-27 — Driver Waitlist System

**Context:** Applications are temporarily closed. Site had no way for interested drivers to register interest. Old form on `driver-application.html` pointed to `/api/contact`, which sent the rate card PDF to everyone.

**Decisions:**
1. New dedicated `/api/driver-waitlist.js` — separate from `/api/contact` so driver signups never receive rate card PDF.
2. Google Sheets gets a new "Driver Waitlist" tab via `logDriverWaitlist()` in the existing webhook.
3. Inline `onsubmit` handlers removed from both waitlist forms — `main.js` already handles all forms via `forms.forEach`. Double-submit was causing duplicate emails and sheet rows.
4. `api/contact.js` now only sends rate card PDF when `form-name=rate-card`. Other submissions get a simple confirmation.

**Trigger for action:** When driver applications reopen, query sheet → notify Notified=No → set Notified=Yes.

### 2026-06-26 — Rate Card Gate, Booking System, SEO

**Decisions:**
1. Rate card page gated behind email capture — no more public pricing.
2. Google Sheets webhook for logging all submissions.
3. Meeting booking system with Accept/Suggest-Alternate flow.
4. All 11 images moved from hotlinked Unsplash to local `images/` folder.
5. LocalBusiness, FAQPage, BreadcrumbList schemas added to all pages.

### 2026-06-25 — Initial Fixes

**Decisions:**
1. Netlify → Vercel migration (`vercel.json` replaces `netlify.toml`).
2. Contact form rewritten: Nodemailer + ZohoMail, no more Netlify Forms.
3. Rate card PDF generator (pdfkit) with branded auto-reply.
4. Hamburger menu null-safety guard.

---

## Policies

### Environment Variables (never commit to repo)
| Variable | Used By | Required |
|---|---|---|
| `ZOHO_EMAIL` | `api/*.js` | Yes |
| `ZOHO_PASSWORD` | `api/*.js` | Yes |
| `CONTACT_EMAIL` | `api/*.js` | Yes (optional — falls back to ZOHO_EMAIL) |
| `GOOGLE_SHEETS_WEBHOOK_URL` | `api/*.js` | Yes |

### Google Sheets Webhook
- **Sheet ID:** `132fBCwviAIEhVgKc3UegnsERQ21p2hvA4ullmBWVsjk`
- **Endpoint:** Google Apps Script Webhook (Version 4)
- **Tabs:** `Sheet1` (used), `Bookings`, `Rate Cards`, `Driver Waitlist`
- **Driver Waitlist columns:** Timestamp, Name, Email, Phone, Vehicle Type, Vehicle Year, City, Message, Source, Notified

### API Routes
| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | General contact + rate card requests (legacy, gated by form-name) |
| `/api/driver-waitlist` | POST | Driver waitlist signups (dedicated, no PDF) |
| `/api/rate-card` | POST | Rate card lead capture → content reveal |
| `/api/book-meeting` | POST | Meeting booking proposal |
| `/api/meeting-response` | GET/POST | Admin accept/suggest-alternative for meetings |
| `/api/google-sheets-webhook` | POST | Central logging for all form types |
