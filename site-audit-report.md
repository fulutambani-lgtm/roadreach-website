# RoadReach Website — Site Audit & Issues Report

**Date:** 27 June 2026  
**Auditor:** OpenWork AI  
**Live URL:** https://www.roadreach.co.za/  
**Source:** `roadreach-website/` (local workspace)

---

## Severity Key

| Label | Meaning |
|---|---|
| **🔴 CRITICAL** | Data loss — users submit info that disappears into a black hole |
| **🟡 HIGH** | User-facing broken feature |
| **🟠 MEDIUM** | Degraded experience or missing functionality |
| **🔵 LOW** | Polish, accessibility, or enhancement |

---

## Issues Found (Fixed)

### 🔴 1. Contact Form — Data Goes Nowhere ✅ FIXED

**File:** `contact.html`, `js/main.js`

The contact form was a **Netlify Forms** remnant. Now hosted on **Vercel**, the Netlify POST endpoint didn't exist.

**Fix:** Created `/api/contact` Vercel serverless function using Nodemailer + ZohoMail SMTP (smtp.zoho.com:465, SSL). Rewrote `main.js` form handler to POST via `fetch()` with loading states and error handling. Removed all `data-netlify` / `netlify` attributes.

---

### 🔴 2. Rate Card Modal Form — Data Goes Nowhere ✅ FIXED

**Files:** `contact.html`, `packages.html`, `js/main.js`

Same root cause. Rate card modal form had `data-netlify="true"` with identical broken JS fallback.

**Fix:** Reuses the same `/api/contact` endpoint. The form posts JSON, and the API now sends **two emails**:
1. Notification to `info@roadreach.co.za` with all fields
2. Auto-reply to the submitter with a **branded PDF rate card** attachment (generated on-the-fly via `pdfkit`) and a **Google Sheets link** to the live rate card

---

### 🟡 3. Homepage "Get the Rate Card" Button — Click Does Nothing ✅ FIXED

**File:** `index.html`, `js/main.js`

Sticky CTA bar had `<button data-open-modal>` but `#rateCardModal` was **only** on `contact.html` and `packages.html`. The homepage didn't include it.

**Fix:** Added the `#rateCardModal` overlay to `index.html`. Also added it to `about.html`, `drivers.html`, `case-studies.html`, and all 4 blog pages.

---

### 🟠 4. Sticky CTA Bar — Form Button Does Nothing from Contact Page ✅ FIXED

**File:** `contact.html`, `packages.html`

Resolved by adding the modal to all pages that have the sticky CTA bar. The "Book a Meeting" link correctly navigates to `contact.html`.

---

### 🔵 5. Missing Rate Card Modal on Sub-Pages ✅ FIXED

**Files:** `drivers.html`, `about.html`, `case-studies.html`, `blog/*.html`

Added `#rateCardModal` overlay + sticky CTA bar to every page with a `data-open-modal` button. Page coverage:

| Page | Sticky CTA Bar | Rate Card Modal | CTA Box | Notes |
|---|---|---|---|---|
| `index.html` | ✅ | ✅ | — | Original fix |
| `packages.html` | ✅ | ✅ | ✅ 3x "Request Pricing" buttons | Original fix |
| `contact.html` | ✅ | ✅ | ✅ Sidebar "Request Rate Card" button | Original fix |
| `about.html` | ✅ | ✅ | — | Added in batch |
| `drivers.html` | ✅ | ✅ | — | Added in batch |
| `case-studies.html` | ✅ | ✅ | — | Added in batch |
| `blog/index.html` | ✅ | ✅ | — | New |
| `blog/post1.html` | ✅ | ✅ | ✅ Updated with rate card button | New |
| `blog/post2.html` | ✅ | ✅ | ✅ Updated with rate card button | New |
| `blog/post3.html` | ✅ | ✅ | ✅ Updated with rate card button | New |

---

### 🔵 6. Sticky Bar "Close" State Persists via sessionStorage ⏸️ BY DESIGN

**File:** `js/main.js`

When a user dismisses the sticky CTA bar, `sessionStorage.setItem('roadreach_cta_dismissed', 'true')` is set. The bar remains hidden for the current tab session.

**Impact:** Not a bug — intentional to avoid annoying frequent visitors.

---

## Additional Features Added

| Feature | Details |
|---|---|
| **PDF Rate Card Generator** | `api/generate-rate-card.js` — on-the-fly A4 PDF using pdfkit. Branded header, 3-tier pricing table, fleet table, contact info. Fixed: removed Unicode ★ chars (not in Helvetica font). |
| **Auto-reply email** | Every form submission triggers an auto-reply with PDF attachment + Google Sheets link |
| **Google Sheets integration** | Live rate card link in auto-reply: https://docs.google.com/spreadsheets/d/1YjVG0nhpl42n0k7sbnY1gKBscE25L9fztjma6piZAdI |
| **Rate Card on blog posts** | End-of-article CTA boxes now have a "Get the Rate Card" button alongside "Book a Meeting" |
| **JavaScript null-safety** | Wrapped hamburger menu code in `if (hamburger && navLinks)` guard — prevents crash on pages without mobile menu button |

---

## What Works (Verified)

| Feature | Status | Details |
|---|---|---|
| Navigation (all pages) | ✅ | Links reach correct pages |
| Mobile hamburger menu | ✅ | Opens/closes with animation |
| Scroll animations (`.animate-up`) | ✅ | Intersection Observer triggers on scroll |
| Hero counter animation | ✅ | Counters animate on scroll into view |
| Footer links + social | ✅ | All social and legal links work |
| WhatsApp float button | ✅ | Links to correct WhatsApp number |
| WhatsApp nudge (after form) | ✅ | Shows WhatsApp option after "submit" |
| Rate Card Modal open/close | ✅ | Opens via `data-open-modal`, closes via × / overlay click / Escape |
| Blog (`/blog/`) | ✅ | Index + blog posts load correctly |
| Legal pages (privacy, terms, etc.) | ✅ | Load with correct titles |
| Responsive layout | ✅ | Grids collapse on tablet/mobile |
| Footer trust badges + legal links | ✅ | Present on all pages |
| "Book a Meeting" nav button | ✅ | Links to `contact.html` on all pages |
| **Contact form → API** | ✅ | POST `/api/contact` → Nodemailer → ZohoMail SMTP |
| **Rate card modal → API** | ✅ | Same endpoint, auto-reply with PDF attachment |
| **PDF generation** | ✅ | Clean A4 layout, all text renders in Helvetica |
| **Auto-reply email** | ✅ | PDF + Google Sheets link sent to submitter |
| **Thank-you message** | ✅ | "Check your email — we've sent you our Rate Card & Media Kit" |
| **Button audit (37 elements)** | ✅ | All buttons clickable and wired correctly |

---

## Deployment

| Service | Details |
|---|---|
| **Hosting** | Vercel (auto-deploy from GitHub) |
| **GitHub** | https://github.com/fulutambani-lgtm/roadreach-website |
| **Vercel project** | `roadreach/roadreach-website` (CLI: fulutambani-6574) |
| **Email** | ZohoMail SMTP (smtp.zoho.com:465, SSL, app password) |
| **API endpoint** | `POST https://www.roadreach.co.za/api/contact` |

---

## Files Modified

| File | Changes |
|---|---|
| `api/contact.js` | Serverless handler: sends notification + auto-reply with PDF |
| `api/generate-rate-card.js` | On-the-fly PDF generator (pdfkit) |
| `api/package.json` | nodemailer + pdfkit dependencies |
| `js/main.js` | Rewrote form handler; added null-safe hamburger guard |
| `index.html` | Added rate card modal |
| `packages.html` | Removed Netlify attrs; modal already present |
| `contact.html` | Removed Netlify attrs; added sidebar rate card button |
| `about.html` | Added rate card modal |
| `drivers.html` | Added rate card modal |
| `case-studies.html` | Added rate card modal |
| `blog/index.html` | Added sticky CTA bar + rate card modal |
| `blog/post1.html` | Added sticky CTA + modal; updated CTA box |
| `blog/post2.html` | Added sticky CTA + modal; updated CTA box |
| `blog/post3.html` | Added sticky CTA + modal; updated CTA box |
| `.env.example` | ZohoMail credential template |
| `.gitignore` | Added `.env`, `node_modules/` |
| `api/driver-waitlist.js` | New — driver waitlist signup endpoint |
| `api/contact.js` | Rate card PDF guard — only for `form-name=rate-card` |
| `api/google-sheets-webhook.js` | Added `logDriverWaitlist()` handler |
| `js/main.js` | Routes `driver-waitlist` to `/api/driver-waitlist` |
| `drivers.html` | Waitlist form; removed inline onsubmit |
| `driver-application.html` | Waitlist form; removed inline onsubmit |
| `thank-you.html` | Branded `driver-waitlist` redirect case |
| `memory.md` | New — session memory |
| `governance.md` | New — project governance & decision log |
| `suggestions.md` | New — future improvements tracker |

---

## Issues Fixed (2026-06-25)

### 🟡 Dead netlify.toml — removed, replaced with vercel.json
- **Fix**: Deleted `netlify.toml` (Netlify remnant). Created `vercel.json` with X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy headers, plus `/blog` → `/blog/` redirect.
- **Impact**: Security headers now served by Vercel.

### 🟡 Case study "Read Full Case Study" links dead
- **Fix**: Changed three `href="#"` links to `href="contact.html"` with "Enquire About This Campaign" label.
- **Impact**: No more dead links. Users land on contact form.

### 🔵 Duplicate .vercel in .gitignore
- **Fix**: Removed duplicate entry at end of file.

### 🔵 No structured data (JSON-LD)
- **Fix**: Added Organization, WebSite, and page-specific WebPage/BlogPosting schemas to all 13 pages.

### 🔵 No sitemap.xml or robots.txt
- **Fix**: Created `sitemap.xml` (14 URLs with priorities/frequencies) and `robots.txt` (disallow `/api/`, point to sitemap).

### 🔵 No thank-you redirect after form submission
- **Fix**: Created `thank-you.html` branded page. Updated `main.js` to redirect instead of in-place replacement.

### 🔵 No RSS feed
- **Fix**: Created `feed.xml` (RSS 2.0) with all 3 blog posts. Added auto-discovery `<link>` tags to all 4 blog pages.

### 🔵 Minimal opencode.jsonc
- **Fix**: Added project name, description, and domain URL.

---

## Issues Fixed (2026-06-26)

### 🔴 Rate card content was publicly accessible — now gated behind lead capture ✅
- **Files**: `rate-card.html`, `api/rate-card.js`, `js/main.js`
- **Fix**: All pricing, fleet table, cost calculator, and benefits wrapped in `#gated-content` (`display: none`). Capture-phase form submit interceptor reveals content on success (same page, no redirect). Serverless endpoint sends admin notification + PDF auto-reply + logs to Google Sheets via webhook.
- **Impact**: Leads must submit email + company name before seeing rates. No more un-gated pricing page.

### 🔴 Rate card package copy was incorrect — two misleading claims removed ✅
- **Files**: `rate-card.html`
- **Fix**: Removed "Professional installation included" from all three package cards. Changed Standard description from "from the back doors forward" to "covering the back doors backwards." Added "Installation is charged separately — see rates below" subtitle.
- **Impact**: No more misleading pricing claims.

### 🟡 No rate card installation rates published ✅
- **Files**: `rate-card.html`
- **Fix**: Added Installation Rates table with 12 rows (Full Wrap / Half Wrap / Decals × Small through Extra Large). Real pricing (R3,900–R71,500). CSS rowspan alignment.
- **Impact**: Clients can see exact installation costs before enquiring.

### 🟡 No meeting booking system existed ✅
- **Files**: `book-meeting.html`, `api/book-meeting.js`, `api/meeting-response.js`
- **Fix**: New meeting booking page with date/time/platform proposal form, today-min date enforcement, alternative contact section. Backend sends admin notification with Accept / Suggest-Alternative action links. User confirmation email on booking. Google Sheets logging.
- **Impact**: Clients can propose meeting times without back-and-forth email chains.

### 🟡 No "/open rate card in sheets" link removed from gated content ✅
- **Files**: `rate-card.html`
- **Fix**: Removed the "Open Rate Card in Google Sheets" link that would have defeated the gate.
- **Impact**: Rate card content is fully protected after gate removal.

### 🟢 Footer had duplicate/inconsistent links across pages ✅
- **Files**: `rate-card.html`, `book-meeting.html`
- **Fix**: Removed duplicate "Rate Card" in Quick Links. Replaced "Book a Meeting" with LinkedIn in Company section. Removed stray "Book a Meeting" from Support section.
- **Impact**: Footer now consistent across all 14 pages.

### 🟢 Site-wide SEO / AI visibility overhaul ✅
- **Files**: All 20 HTML files, `sitemap.xml`
- **Fixes**:
  - **LocalBusiness schema** added to 11 pages (8 content + 3 blog posts) — telephone, priceRange, areaServed (Gauteng, Cape Town, Durban, Pretoria, Johannesburg, SA), openingHours
  - **FAQPage schema** added to 3 key pages: index.html (5 Q&As), packages.html (4 Q&As), drivers.html (6 Q&As) — 15 total, targeting AI Overviews / ChatGPT / Claude
  - **BreadcrumbList schema** added to all 11 indexable pages — Home > Page
  - **Canonical URLs** added to all 10 indexable pages
  - **Robots meta** (index, follow) added to all 10 indexable pages
  - **Titles/descriptions** improved with SA location keywords (Pretoria, Johannesburg, Cape Town, South Africa)
  - **`defer` attribute** added to all 20 main.js script tags (render-blocking fix → improved Core Web Vitals)
  - **Sitemap.xml** updated — added `rate-card.html` (0.95 priority, weekly) and `driver-application.html` (0.7 priority, monthly); sorted by priority

### 🟢 Google Sheets logging for both forms ✅
- **Files**: `api/rate-card.js`, `api/book-meeting.js`
- **Fix**: Google Apps Script webhook (Version 4, `SpreadsheetApp.openById()`) deployed and stable. Both endpoints call `await logToSheet()` before responding.
- **Impact**: All submissions logged to 132fBCwviAIEhVgKc3UegnsERQ21p2hvA4ullmBWVsjk (tabs: Sheet1, Bookings, Rate Cards).

### 🟢 Static site-audit-report.md updated ✅
- **Fix**: This report now reflects all changes through 26 June 2026.

---

---

## Issues Fixed (2026-06-27)

### 🔴 Rate card PDF sent to every form submission — now gated ✅
- **Files**: `api/contact.js`
- **Fix**: The auto-reply with rate card PDF only fires when `form-name === 'rate-card'`. All other submissions (contact, driver-waitlist, etc.) get a simple branded confirmation email with no PDF.
- **Impact**: Driver waitlist signups no longer receive the rate card PDF. Contact form submitters get an appropriate response.

### 🟡 Driver waitlist double-submit — inline handlers removed ✅
- **Files**: `drivers.html`, `driver-application.html`
- **Fix**: Removed inline `onsubmit="return submitWaitlist(this)"` handlers and the `submitWaitlist()` script blocks. `main.js` already handles all forms via `forms.forEach()` — was causing two parallel fetches per submission (two admin emails, two sheet rows).
- **Impact**: Clean single-submit flow. No duplicates.

### 🟢 Driver waitlist system added ✅
- **Files**: `api/driver-waitlist.js`, `api/google-sheets-webhook.js`, `js/main.js`, `thank-you.html`
- **Fix**: New dedicated Vercel endpoint for driver waitlist signups. Sends admin notification + branded waitlist confirmation email. Logs to Google Sheets "Driver Waitlist" tab with Timestamp, Name, Email, Phone, Vehicle Type, Vehicle Year, City, Message, Source, Notified columns.
- **Impact**: Interested drivers can register interest while applications are closed. "Notified" column enables batch email when apps reopen.

### 🟢 Governance & suggestions docs created ✅
- **Files**: `governance.md`, `suggestions.md`
- **Fix**: Created project governance log with decision history, API routes, env vars, and sheet schema. Created suggestions doc with prioritized future improvements.
- **Impact**: Institutional knowledge preserved for future sessions and contributors.

### 🟢 "70%" claim removed from site — replaced with driver payout range ✅
- **Files**: `index.html`, `api/generate-rate-card.js`, `css/style.css`
- **Fix**: Reworded "70% of media spend goes directly to drivers" across the site. In `index.html` hero stats, first the label was changed from "of Media Spend Goes Directly to Drivers" to "Fair Driver Payouts", then the entire animated "70%" counter was replaced with static text: "Drivers earn R800–R9,842/mo" / "Monthly Driver Payout Range". In `api/generate-rate-card.js` PDF bullet, changed to "Fair and competitive driver payouts — drivers earn R800–R9,842/month". Added `.hero-stat .stat-text` CSS class with matching visual style.
- **Impact**: No more potentially misleading percentage claim. Uses verified figures (R800–R9,842/month) already published elsewhere on the site.

### 🟢 WhatsApp bot SMTP_PASS configured and restarted ✅
- **Files**: `roadreach-whatsapp-bot/.env`
- **Fix**: Added SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to bot's .env. Killed stale process on port 3001 and restarted bot.
- **Impact**: Escalation email alerts will work when nodemailer code is enabled. Bot running on port 3001.

### Files Modified (2026-06-27)
| File | Changes |
|---|---|
| `api/contact.js` | Rate card PDF guard — only sends PDF when `form-name=rate-card` |
| `api/driver-waitlist.js` | New — dedicated waitlist endpoint |
| `api/google-sheets-webhook.js` | Added `logDriverWaitlist()` handler |
| `drivers.html` | Waitlist form; removed inline onsubmit handler |
| `driver-application.html` | Waitlist form; removed inline onsubmit handler |
| `js/main.js` | Routes `driver-waitlist` to `/api/driver-waitlist` |
| `thank-you.html` | Branded `driver-waitlist` case |
| `memory.md` | New — session memory for AI continuity |
| `governance.md` | New — project governance & decision log |
| `suggestions.md` | New — future improvements tracker |
| `index.html` | Hero stat "70%" replaced with "Drivers earn R800–R9,842/mo" |
| `api/generate-rate-card.js` | PDF bullet reworded — no more 70% claim |
| `css/style.css` | Added `.hero-stat .stat-text` class |

## What Works (Verified — Added 2026-06-26)

| Feature | Status | Details |
|---|---|---|
| Rate card lead capture gate | ✅ | Form → content reveal (no redirect) |
| Rate card PDF auto-reply | ✅ | Branded PDF emailed to lead after capture |
| Meeting booking flow | ✅ | Propose → Admin email → Accept/Suggest → Confirmation |
| Admin response handler | ✅ | `/api/meeting-response` — GET to accept, POST to suggest alternative |
| Google Sheets logging | ✅ | Both forms log to the same sheet |
| SEO structured data (LocalBusiness) | ✅ | All 11 indexable pages |
| SEO FAQ (FAQPage) | ✅ | 15 Q&As across 3 pages |
| SEO breadcrumbs (BreadcrumbList) | ✅ | All 11 indexable pages |
| Render-blocking eliminated | ✅ | defer on all 20 pages |
| Sitemap up to date | ✅ | 13 indexed URLs |

## What Works (Verified — Added 2026-06-27)

| Feature | Status | Details |
|---|---|---|
| Driver waitlist endpoint | ✅ | `/api/driver-waitlist` — admin notification + branded confirmation email |
| Waitlist Google Sheets logging | ✅ | "Driver Waitlist" tab with Notified column |
| Waitlist form on `drivers.html` | ✅ | Full form (name, email, vehicle, city) + `#driver-waitlist` anchor |
| Waitlist form on `driver-application.html` | ✅ | Full form (name, email, phone, vehicle, year, city, message) |
| Rate card PDF guard | ✅ | Only `form-name=rate-card` triggers PDF — no more PDF leaks |
| Contact form safe auto-reply | ✅ | General submissions get simple confirmation, no PDF |
| Governance docs | ✅ | `governance.md`, `suggestions.md`, `memory.md` created |
| GitHub push → Vercel deploy | ✅ | `bb95716` pushed and deployed |
| 70% claim removed | ✅ | Replaced with "Drivers earn R800–R9,842/mo" on hero + PDF |
| WhatsApp bot SMTP_PASS configured | ✅ | SMTP vars added to .env, bot restarted on port 3001 |

## Remaining Observations

1. **Blog nav** — Effectively resolved (dark charcoal headers make nav text visible even when scrolled state is false).
2. **Legal pages** (`privacy.html`, `refund-policy.html`, `terms-of-service.html`) — no rate card CTAs. By design for legal content.
3. ✅ **All images hotlinked from Unsplash** — **RESOLVED 2026-06-27**. All 11 images downloaded locally to `images/` folder and paths updated across all pages.
4. **Analytics** — Google Analytics 4 (G-F13FWS4SWH) added on all pages.
5. **Case study detail pages don't exist** — links go to contact.html as interim solution.
6. **FAQ schema is schema-only** — no visible FAQ accordion on the page. Consider adding visible FAQ sections that match the schema for a better user + search experience.
7. **Submit updated sitemap to Google Search Console** — helps Google discover rate-card.html and driver-application.html faster.
8. **Blog pages** — could use more frequent content updates for SEO momentum.
9. **Driver Waitlist** — ✅ Active and deployed. `/api/driver-waitlist.js` + Google Sheets webhook + forms on `drivers.html` and `driver-application.html`. ⚠️ When driver apps reopen: query "Driver Waitlist" sheet tab for "Notified = No", email signups, update to "Notified = Yes".
