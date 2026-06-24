# RoadReach Website — Site Audit & Issues Report

**Date:** 24 June 2026  
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

## Issues Found

### 🔴 1. Contact Form — Data Goes Nowhere

**File:** `contact.html` (line 115), `js/main.js` (lines 102–135)

The contact form (`<form name="contact" ... data-netlify="true" netlify>`) is a **Netlify Forms** remnant. Now that the site is hosted on **Vercel**, the Netlify POST endpoint doesn't exist.

The JavaScript fallback (lines 108–133) detects it's not on Netlify, prevents the default submission, and POSTs to `"/"` — which has no Vercel serverless function listening. The `.catch()` handler also calls `showFormSuccess()`, meaning **every submission shows "Thank You" regardless of whether data was actually sent**.

**Impact:** Every contact form submission is silently lost. Users believe they've messaged RoadReach, but no email or database record is created.

**Fix:** Replace with a Vercel serverless function (`/api/contact`) using Nodemailer + ZohoMail SMTP. Remove `data-netlify` / `netlify` attributes.

---

### 🔴 2. Rate Card Modal Form — Data Goes Nowhere

**File:** `contact.html` (line 249), `packages.html` (line 249), `js/main.js` (lines 102–135)

Same root cause as the contact form. The Rate Card modal form has `data-netlify="true"` and uses the identical broken JS fallback.

**Impact:** Potential clients requesting rate cards and media kits are never followed up on.

**Fix:** Reuse the same `/api/contact` serverless function (or create `/api/rate-card`). Remove `data-netlify` / `netlify` attributes.

---

### 🟡 3. Homepage "Get the Rate Card" Button — Click Does Nothing

**File:** `index.html` (line 291), `js/main.js` (lines 69–100)

The sticky CTA bar on the **homepage** has a `<button data-open-modal>` labelled "Get the Rate Card". However, the modal overlay (`#rateCardModal`) is **only present** on `contact.html` and `packages.html`. The homepage (`index.html`) does not include it.

In `main.js`, the modal code guards with `if (modalOverlay)` so no error is thrown — the event listener is simply never attached on the homepage. The button appears clickable but does nothing.

**Impact:** Users on the homepage see a rate card CTA but tapping it produces no result.

**Fix options:**
- **(A)** Add the `#rateCardModal` overlay to `index.html` (copy from `contact.html`).
- **(B)** Change the button to an `<a href="contact.html">` link instead.
- **(C)** Have the JS check if the modal exists and if not, redirect to `contact.html#rate-card`.

---

### 🟠 4. Sticky CTA Bar — Form Button Does Nothing from Contact Page

**File:** `contact.html` (line 226), `packages.html` (line 222)

The sticky bar's "Get the Rate Card" button has `data-open-modal`, but if the sticky bar appears on pages that **do** have the modal, it works fine. This issue is specific to the homepage (see #3 above).

However, there's a secondary issue: on desktop, when the sticky bar appears after scrolling past 600px, the WhatsApp float is repositioned via CSS (`body.has-sticky-bar .whatsapp-float { bottom: 80px }`). On the **contact page**, the sticky bar's "Book a Meeting" link goes to `contact.html` (same page anchor) which works but could scroll-jump the user.

**Impact:** Minor UX roughness; the sticky bar's modal button from the contact/packages pages works correctly.

---

### 🔵 5. Missing Rate Card Modal on Sub-Pages

**Files:** `drivers.html`, `about.html`, `case-studies.html`, `blog/`, `privacy.html`, `terms-of-service.html`, `refund-policy.html`, `faq.html`, `get-a-quote.html`

These pages do not include `#rateCardModal`. If sticky bar is enabled on these pages, "Get the Rate Card" would be non-functional. However, some of these pages may not include the sticky bar at all (needs verification).

**Fix:** Add the modal to any page that has the sticky CTA bar, or convert all `data-open-modal` buttons to links pointing to `contact.html`.

---

### 🔵 6. Sticky Bar "Close" State Persists via sessionStorage

**File:** `js/main.js` (lines 155, 183–184)

When a user dismisses the sticky CTA bar, `sessionStorage.setItem('roadreach_cta_dismissed', 'true')` is set. This persists **per tab** for the session. This is intentional behaviour but worth noting: if a user dismisses the bar and navigates to another page on the same site, the bar will remain hidden.

**Impact:** Not a bug, but if the rate card CTA is important, consider changing to `localStorage` with a longer expiry or showing it again after a certain period.

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

---

## Recommendations (Priority Order)

1. **Fix both forms** — Create a Vercel serverless function (`/api/contact`) to handle POST requests, send email via Nodemailer + ZohoMail SMTP, and return JSON. Update both forms to POST there and show the thank-you only on success.
2. **Fix homepage Rate Card button** — Add the modal overlay to `index.html` so the sticky bar button works everywhere.
3. **Audit remaining pages** — Ensure any page with the sticky bar also has the modal (or convert buttons to links).
4. **(Optional) Consider localStorage** — If the rate card CTA is high-priority for conversions, increase the dismissal timeout.

---

## Affected Files

| File | Issue(s) |
|---|---|
| `js/main.js` | Lines 102–135: form handler POSTs to nowhere; lines 69–100: modal guard hides missing-modal issue |
| `index.html` | Missing `#rateCardModal` overlay (line 291 button has `data-open-modal` but no target) |
| `contact.html` | Lines 115, 249: `data-netlify="true"` attributes on both forms |
| `packages.html` | Lines 249: `data-netlify="true"` attribute on modal form |
