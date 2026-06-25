# RoadReach Website — Site Audit & Issues Report

**Date:** 24 June 2026 (updated after fixes)  
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

## Remaining Observations

1. **Blog nav loses `scrolled` class at top of page** — `updateNav()` removes `scrolled` when `scrollY < 60`. Blog pages have a dark header where a transparent nav makes text invisible. This was tracked as a remaining issue but blog pages already have dark charcoal headers at the top, making the default white nav text visible. Effectively resolved in prior fixes.
2. **Legal pages** (`privacy.html`, `refund-policy.html`, `terms-of-service.html`) — no rate card CTAs. These are legal pages where CTAs are not appropriate.
3. **All images hotlinked from Unsplash** — no local copies. Needs client-supplied imagery.
4. **No analytics** — No tracker installed.
5. **Case study detail pages don't exist** — links now go to contact.html as interim solution.
