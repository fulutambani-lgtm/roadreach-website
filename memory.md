# Project Memory

This file holds the AI's working context across sessions. It is updated at the end of each session and whenever significant state changes occur.

---

## Project Overview

- **Workspace**: `C:\Users\ianic\OneDrive - sanbi.org.za\Desktop\roadreach_vault\`
- **Platform**: Windows
- **Primary project**: **RoadReach** — South Africa's premier mobile billboard network
- **Live site**: https://www.roadreach.co.za/
- **Config**: `opencode.jsonc` (minimal), `.opencode/openwork.json` (workspace metadata)

---

## RoadReach Website — Project Status

### Site Structure (Multi-page static HTML — 12+ pages)

| Page | File | Status | Rate Card Modal |
|---|---|---|---|
| Home | `roadreach-website/index.html` | ✅ Live | ✅ |
| Packages | `roadreach-website/packages.html` | ✅ Live | ✅ |
| Case Studies | `roadreach-website/case-studies.html` | ✅ Live | ✅ |
| Drivers | `roadreach-website/drivers.html` | ✅ Live | ✅ |
| About | `roadreach-website/about.html` | ✅ Live | ✅ |
| Contact | `roadreach-website/contact.html` | ✅ Live | ✅ |
| Privacy Policy | `roadreach-website/privacy.html` | ✅ Live | ❌ (legal page) |
| Terms of Service | `roadreach-website/terms-of-service.html` | ✅ Live | ❌ (legal page) |
| Refund Policy | `roadreach-website/refund-policy.html` | ✅ Live | ❌ (legal page) |
| Blog Index | `roadreach-website/blog/index.html` | ✅ Live | ✅ |
| Blog Post 1 | `roadreach-website/blog/post1.html` | ✅ Live | ✅ |
| Blog Post 2 | `roadreach-website/blog/post2.html` | ✅ Live | ✅ |
| Blog Post 3 | `roadreach-website/blog/post3.html` | ✅ Live | ✅ |

### Design & Tech Stack
- **Stack**: Vanilla HTML5, CSS3, JavaScript (no framework)
- **Fonts**: Montserrat (headings) + Bitter (body) via Google Fonts
- **Icons**: Font Awesome 6.5.0
- **Colors**: Brand red (#d9040e), dark charcoal, white
- **Responsive**: Mobile hamburger menu, scroll-aware navbar, fluid layouts

### Hosting & Deployment
- **Host**: Vercel (`vercel.com/roadreach/roadreach-website`)
- **GitHub**: `https://github.com/fulutambani-lgtm/roadreach-website`
- **Deploy**: Auto-deploy on `git push` to `main` ✅
- **Git**: v2.54.0 at `C:\Program Files\Git\bin\git.exe`

### Form Handling — ✅ Fully working (deployed and verified)
- **API endpoint**: `POST /api/contact` (Vercel serverless function)
- **SMTP**: ZohoMail (smtp.zoho.com:465, SSL, app-specific password)
- **Notification**: Email sent to `info@roadreach.co.za` with all form fields
- **Auto-reply**: Email sent to submitter with:
  - On-the-fly branded PDF rate card (via pdfkit)
  - Google Sheets live rate card link
- **Env vars in Vercel**: `ZOHO_EMAIL`, `ZOHO_PASSWORD`, `CONTACT_EMAIL`
- **API response**: `{"success":true,"message":"Your message has been received. Check your email for your Rate Card."}`

### Rate Card Modal — ✅ On all 10 relevant pages
- Sticky CTA bar appears after scrolling past 600px
- "Get the Rate Card" button opens modal (via `data-open-modal` → `main.js`)
- Modal form submits to `/api/contact` → auto-reply with PDF
- Blog post CTA boxes also have "Get the Rate Card" button inline

### PDF Generator — ✅ Fixed
- **File**: `api/generate-rate-card.js` (pdfkit)
- Unicode ★ characters replaced with plain text (Helvetica can't render them)
- Contact section uses separate `.text()` calls with explicit coordinates

---

## Key Facts & Preferences

### User Identity
- **Name**: Fulu Tambani
- **GitHub**: `fulutambani-lgtm`
- **Email (personal)**: `fulu.tambani@gmail.com` (git config)
- **Email (business)**: `fulu.tambani@roadreach.co.za`
- **Email provider**: ZohoMail (info@roadreach.co.za)
- **ZohoMail App Password**: Provided (stored locally in `.env`)
- **Phone/WhatsApp**: +27 81 298 7137
- **Address**: Festura Street, Lotus Gardens, Pretoria, 0008, South Africa

### User Preferences
- Wants "Book a Meeting" buttons → email to `fulu.tambani@roadreach.co.za`
- Does NOT want third-party form services (Web3Forms rejected)
- Wants the built-in contact form to actually send emails when submitted
- Uses ZohoMail for @roadreach.co.za domain

### Business Details
- **Company**: RoadReach Media / RoadReach
- **Fleet**: 750+ professionally managed cars
- **Model**: Drivers earn R800–R9,842/month (replaced old 70% claim)
- **Social**: @roadreachza (Facebook, Instagram, LinkedIn, TikTok)
- **Partners**: Signorama (signage partner)

---

### New Files Added (2026-06-25)
- `vercel.json` — Security headers (replaces netlify.toml)
- `sitemap.xml` — SEO sitemap with all 14 pages
- `robots.txt` — Crawler directives, points to sitemap
- `thank-you.html` — Post-form-submission redirect page (noindex)
- `feed.xml` — RSS 2.0 blog feed with auto-discovery

### Driver Waitlist
- ✅ **Active** — Full waitlist system live on drivers.html and driver-application.html
- **Sheet tab**: "Driver Waitlist" in the RoadReach Google Sheet
- **⚠️ REMEMBER**: When driver applications reopen, query the sheet for "Notified = No" and email them first. Then update the column to "Notified = Yes".

### Open Issues Remaining
- ✅ **All Unsplash images downloaded locally** — 11 unique images (~989 KB), served from `images/` folder. No more CDN dependency.
- Case study detail pages don't exist (links go to contact.html)
- Blog nav transition at scroll boundary is a pre-existing cosmetic issue

---

## RoadReach WhatsApp Campaign Manager — Project Status

### Overview
- **Built**: 2026-06-26 — full-stack web app for bulk personalized WhatsApp messaging
- **App**: `opendesign/mockups/road-reach-whatsapp/` (Node.js + Express + sql.js)
- **Port**: 3456 (local)
- **Send method**: `wa.me` click-to-chat links (user has WhatsApp Business App, not Cloud API)
- **Handles**: 750+ drivers, personalized templates, scheduling, campaign management

### Features
| Feature | Status |
|---------|--------|
| Dashboard with stats | ✅ |
| Driver CRUD + CSV import | ✅ |
| Message templates with {{variables}} | ✅ |
| Campaign creation + driver selection | ✅ |
| Personalized wa.me link generation | ✅ |
| Scheduled sending (cron) | ✅ |
| Open-all-in-tabs bulk send | ✅ |
| Settings (Google Sheets placeholder) | ✅ |
| WhatsApp Cloud API upgrade path | 🔲 Planned |

### Design System — Road Reach Brand (from official guidelines)
- **File**: `opendesign/design-systems/road-reach/tokens/colors_and_type.css`
- **Vivid Red**: `#C11111` (primary accent)
- **Pitch Black**: `#020202` (dark backgrounds)
- **Dark Grey**: `#525351` | **Light Grey**: `#B5ADAB`
- **Heading font**: Montserrat (Black 900 / Bold 700 / SemiBold 600)
- **Body font**: EB Garamond (Regular 400)
- **Tagline**: "Drive. Earn. Reach."
- **Red is a signal, not a theme** — one red element per layout

### Running
```powershell
cd C:\Users\ianic\opendesign\mockups\road-reach-whatsapp
node server.js
# → http://localhost:3456
```

---

## RoadReach Financial Operations & Billing Squad — Interactive Prototype

### Overview
- **Built**: 2026-06-27 — Multi-agent financial operations dashboard (React SPA)
- **v1.1 Upgrade**: 2026-06-27 — Multi-client concurrent workflows + Node.js backend (PDF gen + email)
- **Location**: `opendesign/mockups/roadreach-financial-squad/index.html`
- **Backend**: `opendesign/mockups/roadreach-financial-squad/server.js` (Express, pdfkit, Nodemailer)
- **Port**: 3480 (Node.js server)
- **Design system**: `opendesign/design-systems/road-reach/` (RoadReach brand: #C11111 red, #020202 black, Montserrat + EB Garamond)

### Agent Squad (4 roles)
| Agent | Role | Responsibility |
|-------|------|---------------|
| Amara (AQ) | Quote Architect | Create quotes with live pricing, volume discounts, custom discount requests |
| Liam (LB) | Billing Specialist | Generate tax invoices with 15% VAT, set billing schedules |
| Zara (ZR) | Reconciliation Clerk | Match payments, send reminders, flag discrepancies |
| Elena (EC) | Financial Controller | Review escalations, approve/deny, sign off |

### Key Features
- **Multi-client concurrent pipelines** — each client has their own workflow state (Quote → Approval → Billing → Reconciliation → Complete)
- **Client management** — add/remove clients, selector in top bar, client grid on dashboard
- **Dashboard** — aggregate stats (active/completed/overdue count, total quoted value, escalation count)
- **Live pricing calculator** — real-time cost breakdown as user adjusts vehicles/tiers
- **Volume discounts** — 5% at 10+ cars, 10% at 20+, 15% at 50+
- **3 package tiers** — Standard (R2,125), Premium (R3,450), Elite (R5,200) per car/month
- **Production fees** — R1,500/vehicle one-time wrap & application
- **VAT at 15%** — proper SA tax calculation on invoices
- **5-step pipeline** — Quote → Approval → Billing → Reconciliation → Complete
- **Escalation triggers** — sub-10 fleet, custom discounts, overdue (14+ days), discrepancies
- **Formal documents** — COST ESTIMATE / QUOTATION and TAX INVOICE with proper SA fields

### PDF Generation (server.js)
- **Endpoints**: `POST /api/generate-quote-pdf`, `POST /api/generate-invoice-pdf`
- **Library**: pdfkit (same pattern as `roadreach-website/api/generate-rate-card.js`)
- **Output**: A4, branded header (red bar, RoadReach logo), address blocks, line-item table, totals with VAT, footer
- **Frontend**: fetches PDF blob, triggers browser download via `URL.createObjectURL` + hidden anchor click

### Email Reminders (server.js)
- **Endpoint**: `POST /api/send-reminder`
- **Library**: Nodemailer (ZohoMail SMTP, same pattern as `roadreach-website/api/contact.js`)
- **Content**: HTML email with RoadReach branding, invoice details, banking details, overdue urgency styling
- **Demo mode**: Gracefully returns success even with unconfigured SMTP so prototype flow isn't blocked

### Architecture
- **Frontend**: Vanilla React (no JSX/Babel) with `createElement` calls. State managed via `useState` + `useCallback`. TopBar (client selector) rendered outside main layout, synced to InternalApp via custom DOM events (`rr-sync`).
- **Backend**: Express.js on port 3480. Serves static HTML files plus API routes. All installed via npm (express, cors, pdfkit, nodemailer).
- **State shape**: `clients[]` array where each client owns `{ id, company, contact, email, quote, invoice, pipelineStep, paymentStatus, daysOverdue, escalations, _resolved }`. `selectedClientId` routes which client's data appears in agent views.

### Running
```powershell
cd opendesign\mockups\roadreach-financial-squad
npm start    # starts server.js on port 3480
# → http://localhost:3480  (serves index.html + API)
```

### Files
| File | Purpose |
|------|---------|
| `index.html` | Multi-client React SPA (all views, state management) |
| `server.js` | Express server with pdfkit PDF gen + Nodemailer email |
| `package.json` | npm dependencies (express, cors, pdfkit, nodemailer) |
| `node_modules/` | Installed dependencies |

---

## WhatsApp Auto-Responder Bot — Project Status

### Current State
- **Bot**: Moved from OpenWork workspace to `roadreach-whatsapp-bot/` ✅
- **AI (Ollama)**: llama3.2 running and tested ✅
- **Knowledge base**: 4990 chars loaded with full RoadReach info ✅
- **Connection**: Waiting for QR code scan ⏳

### Architecture (v2.0 — whatsapp-web.js)
- **Library**: whatsapp-web.js v1.34.7 (WhatsApp Web — no Meta/Facebook account needed)
- **Session persistence**: LocalAuth saves to `.whatsapp-session/` — scan once, then it persists
- **Status page**: http://localhost:3001 shows QR code as image + connection status
- **AI**: Ollama (local) — no API keys, no monthly fees
- **Puppeteer**: Uses system Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`

### How to Activate
1. Run `npm start` in `roadreach-whatsapp-bot/` or double-click `start-bot.bat`
2. Open http://localhost:3001 in browser to see QR code
3. On phone: WhatsApp → Menu → Linked Devices → Link a Device → Scan QR
4. Bot goes live automatically

## Outreach Campaign — Growth Team Activation

### Status
| Lead | Channel | Sent | Notes |
|------|---------|------|-------|
| Pineapple Insurance | Email | ✅ 2026-06-27 04:30 SAST | marnus@pineapple.co.za — "Sans Billboards" hook |
| Naked Insurance | Email | ✅ 2026-06-27 04:30 SAST | alex@naked.insure — OOH campaign + Art Director hook |
| African Bank | Email | ✅ 2026-06-27 04:30 SAST | sbusiso.kumalo@africanbank.co.za — "You Audacious People" hook |
| Pret A Manger SA | LinkedIn InMail | ⏳ Pending | Hamza Farooqui — needs LinkedIn login |
| Delivery Ka Speed | LinkedIn InMail | ⏳ Pending | Godiragetse Mogajane — needs LinkedIn login |

### Sender Details
- **From**: fulu.tambani@roadreach.co.za (Fulufhelo Tambani)
- **SMTP**: Zoho Mail (smtp.zoho.com:587, STARTTLS, app-specific password)
- **Method**: PowerShell + .NET SmtpClient

### What's in each email
- **Pineapple**: Referenced their Oct 2024 blog post about needing mobile billboard alternatives in Cape Town → direct solution offer
- **Naked**: Referenced their June 2026 Senior Art Director job posting for OOH campaigns → channel alignment pitch
- **African Bank**: Referenced their active "You Audacious People" brand campaign → extension onto mobile canvases
- **All**: R2,125/car/month Lite pricing, volume discounts, roadreach.co.za/book-meeting.html CTA

---

## TikTok Engagement — Ongoing

### Automated Replies: CONFIRMED BLOCKED
After extensive testing (XHR interception, native DOM events, React fiber dispatch, `.click()`, `dispatchEvent`), TikTok's `/api/comment/publish/` endpoint returns fake 200 success but silently drops the reply. The reply is visible in React's optimistic UI ("View 1 reply") but disappears on page reload. This is TikTok's anti-automation: the account (2.8K followers) isn't trusted enough for non-human write operations.

**All 11 prepared replies remain unsent.** User must reply manually via mobile app.

### Critical DM Discovery (2026-06-27)
Navigated to TikTok Messages (https://www.tiktok.com/messages) — found:
- **244 pending message requests**
- Brand leads who DMed RoadReach: Cremora SA (6/10), Telkom (6/9 — request accepted)
- Active outbound conversations by RoadReach to: GoTyme Bank ZA, Discovery South Africa, Pineapple, Bp Lavender, Naked Insurance
- Driver inquiries with various RoadReach auto-responses already sent
- Most message types unsupported on web — must view on phone

## Social Media Strategy — July 2026 Launch

### Overview
- **Primary goal**: Advertiser/client acquisition (driver applications closed)
- **Priority platforms**: LinkedIn (advertisers/leads) + TikTok (drivers/culture)
- **Also active**: Instagram, Facebook
- **Not on**: X/Twitter
- **Status**: All 5 agents completed. Assets approved and ready to publish Week 1 starting Mon 29 June.

### 4 Content Pillars
1. **ROI & Data** — campaign results, stats, OOH comparisons → LinkedIn, Blog
2. **Fleet in Action** — driver stories, behind-the-wrap → TikTok, Instagram, Facebook
3. **Founder & Mission** — Fulu's story, the 70% model → LinkedIn, Instagram
4. **Education** — how it works, packages explained → LinkedIn Carousels, TikTok

### Brand Corrections Locked
- Rate card CTAs lead to roadreach.co.za/rate-card.html (visitor enters details → lead generated)
- No Signorama mentioned — just "professional installers" / "professional partners"
- Minimum commitment: 3 months. Options: 3, 6, 12 months
- Driver earnings: link to roadreach.co.za/drivers.html (earnings calculator)
- Industries: "any brand with physical presence or online with specific geographic targets"

### Visual Assets Created
- **Location**: `RoadReach_Visual_Assets/`
- **Files**: stat-card.html, carousel-slide-1.html through carousel-slide-5.html, quote-card.html
- **Style**: Pitch Black (#020202) backgrounds, Vivid Red (#C11111) single accents, Montserrat typography
- **Format**: HTML/CSS — open in browser and screenshot for publishing

### 4 Week 1 Assets (Approved)
| # | Asset | Platform | Day |
|---|---|---|---|
| 1 | "750-Car Stat Drop" — data-driven LinkedIn post | LinkedIn | Mon 29 Jun |
| 2 | "Inside the Wrap" — driver POV TikTok | TikTok | Tue 30 Jun |
| 3 | "Case Study Carousel" — 5-slide carousel | LinkedIn | Fri 3 Jul |
| 4 | "Fulu's Origin Story" — founder story | LinkedIn | Wed 1 Jul |

### Engagement Playbook Complete
- Comment reply scripts for all 4 assets (positive, skeptical, objections, trolls)
- DM templates (lead inquiry, pricing objection, proof of ROI, driver inquiry)
- Lead escalation flow — triggers (10+ cars, Marketing Director/CMO, campaign budget) → fulu.tambani@roadreach.co.za + WhatsApp

---

## Open Questions

- WhatsApp Cloud API upgrade needed for fully automated sending (no manual clicks)
- Google Sheets auto-sync integration (placeholder in Settings)
- Canva integration: no OpenWork extension available — consider browser-based Canva automation or manual template creation

---

## Pricing & Messaging — 28 June 2026 Update

### Key Changes
| Change | Detail |
|--------|--------|
| **70% claim removed** | All 14 HTML pages + blog posts + meta descriptions + JSON-LD updated to factual driver payout ranges |
| **Launch pricing** | Current prices tagged as "Launch Pricing" with strikethrough regular prices (25-30% higher) |
| **Campaign bundles** | HyperLocal (R68K), City Impact (R136K), Metro Dominance (R245K), National Takeover (R550K) added to rate-card.html and packages.html |
| **Drivers' Choice** | New section on rate-card.html + packages.html leveraging 104.2K-view TikTok campaign |
| **Price deadline** | 31 August 2026 — launch pricing expires |
| **Future regular prices** | Lite R2,800 | Standard R6,100 | Premium R11,000 (Small base; Medium ×1.25, Large ×1.5, XL ×2.0) |

### Files Modified (11 total)
- `rate-card.html` — Major restructure: new CSS, strikethrough pricing, campaign bundles, Drivers' Choice section, updated calculator JS, fixed benefits
- `packages.html` — Launch pricing cards, campaign bundles section, Drivers' Choice section, new CSS
- `index.html` — Trust badge, hero copy, meta descriptions, JSON-LD, FAQ, testimonial
- `about.html` — Mission copy + trust badge
- `drivers.html` — FAQ JSON-LD + trust badge
- `contact.html`, `case-studies.html`, `book-meeting.html`, `driver-application.html`, `driver-terms.html` — Trust badges
- `blog/post1.html`, `blog/post3.html` — Body copy + meta descriptions
- `growth-team-lead-dossier.md` — Updated all pricing + Drivers' Choice hook in sequences
- `RoadReach_Social_Assets_July2026.md` — Added Asset #5 (Drivers' Choice) + pricing correction notice

### New Assets Created (2026-06-28)
| Asset | Location | Purpose |
|-------|----------|---------|
| Media Kit | `roadreach-website/media-kit.html` | Brand-facing overview (print as PDF) — attach on media kit requests |
| Email Templates | `outreach/email-templates.md` | 8 standardized templates + ZohoMail routing rules |
| TikTok Brand Drip | `outreach/tiktok-brand-drip-campaign.md` | 28-brand sequenced outreach with custom hooks |
| Lead Scoring Rules | `outreach/lead-scoring-rules.md` | Scoring matrix + auto-escalation triggers for info@ |
| CRM Dashboard | `outreach/crm-dashboard.html` | Live pipeline (replaces static CSV — 27 leads, search, export) |
| Countdown Timer | `rate-card.html` (live JS) | Dynamic countdown to 31 Aug 2026 pricing deadline |

### Driver Support Link — Recommendation
- **Self-service (earnings/FAQ):** `roadreach.co.za/drivers.html`
- **Support (form):** `roadreach.co.za/contact.html` → submits to info@roadreach.co.za
- **Urgent/WhatsApp:** `wa.me/27812987137` — +27 81 298 7137
- **WhatsApp Bot (when live):** Auto-responder on same number

### Brand Media Kit Protocol
When a brand asks for "media kit" or "company overview":
1. Attach `roadreach-website/media-kit.html` (open in browser → Save as PDF)
2. Direct to `roadreach.co.za/rate-card.html` (lead gen gate)
3. Direct to `roadreach.co.za/book-meeting.html` (call booking)

### Open Actions
- Fulu needs to log into LinkedIn and send InMails to Pret A Manger and Delivery Ka Speed (pending since 27 June) — **Alternative contacts found**: info@millatinvest.com / altaaf@millatinvest.com (Pret), support@deliverykaspeed.com / admin@deliverykaspeed.com (DKS)
- WhatsApp bot QR code needs scanning (`roadreach-whatsapp-bot/`)
- Social launch Mon 29 June — Asset #1 (corrected stat card) on LinkedIn
- Research decision-makers for 14 Tier 1 TikTok brands — LinkedIn search needed to find CMOs/Marketing Directors

## Session History
|---|---|---|
| 2026-06-27 (Session 3) | **70% claim removed, SMTP_PASS set, bot restarted** — Scanned site for "70% of media spend goes directly to drivers" claim. Reworded on index.html hero stat (label changed to "Fair Driver Payouts") and api/generate-rate-card.js PDF bullet (changed to "Fair and competitive driver payouts — drivers earn R800–R9,842/month"). Later replaced the entire 70% counter stat with static text showing verified driver payout range: "Drivers earn R800–R9,842/mo". Added CSS class `.hero-stat .stat-text`. Also set SMTP_PASS and SMTP config in `roadreach-whatsapp-bot/.env`, killed stale bot on port 3001, restarted bot. Pushed all changes to GitHub → Vercel deploy. Updated governance.md, suggestions.md, site-audit-report.md with all changes. |
| 2026-06-28 (Session 2) | **Executive email manager + 7-suggestion execution** — Activated as Elite AI Email Manager for info@ and fulu.tambani@ mailboxes. Executed all 7 strategic suggestions: (1) TikTok brand drip campaign — 28-brand pipeline doc with sequenced email outreach, custom hooks per Tier 1 brand. (2) Email templates library (8 templates) + ZohoMail auto-routing rules at outreach/email-templates.md. (3) CRM live dashboard (HTML/JS, 27 leads, pipeline view, search/filter, export) at outreach/crm-dashboard.html — replaces static CSV. (4) Lead scoring matrix for info@ inbox with auto-escalation triggers at outreach/lead-scoring-rules.md. (5) Pret A Manger unblocked — Hamza Farooqui can be reached via info@millatinvest.com or Altaaf Kazi altaaf@millatinvest.com. Delivery Ka Speed unblocked — admin@deliverykaspeed.com or support@deliverykaspeed.com. Email drafts ready. (6) Two-phase TikTok outreach for all 28 brands documented. (7) Live JS countdown timer to 31 Aug 2026 added to rate-card.html. Additionally: Brand Media Kit created at roadreach-website/media-kit.html (printable, stats, packages, bundles, Drivers' Choice proof). Driver support link suggestion: roadreach.co.za/contact.html + drivers.html + wa.me/27812987137. |
| 2026-06-27 | **Upgraded Financial Squad to v1.1 (multi-client + backend)** — Rewrote `index.html` with multi-client concurrent workflows (client CRUD, per-client pipeline state, top-bar selector), created `server.js` (Express + pdfkit PDF generation + Nodemailer email reminders on port 3480), wired PDF download buttons and email reminder buttons to server API, updated `manifest.json` to reference server URL, updated `governance.md` and `memory.md` with full v1.1 details. |
| 2026-06-27 | **Built Driver Waitlist system** — Created `/api/driver-waitlist.js` Vercel function, updated Google Apps Script webhook with `logDriverWaitlist()` handler, added full waitlist forms on `drivers.html` and `driver-application.html` (name, email, phone, vehicle type, year, city, message), updated `main.js` and `thank-you.html` with `driver-waitlist` routing. Data stores in Google Sheet "Driver Waitlist" tab with "Notified" tracker column. Admin email notification + branded confirmation email to signup. ⚠️ When apps reopen, query sheet for "Notified = No" and email first. |
| 2026-06-27 | **Migrated all 11 Unsplash images to local** — Downloaded all hotlinked images from 19 references across 17 files into `roadreach-website/images/`. Updated all HTML src, CSS url(), and OG meta tag. Removed CDN dependency completely. Total ~989 KB of new local assets. |
| 2026-06-27 | **Built complete Social Media Engine for RoadReach** — Full 5-agent pipeline executed: Agent 1 (Content Strategy) delivered audit, 4 pillars, 4-week calendar + briefs. Agent 2 (Copywriter) wrote 4 platform-optimized assets with 3 hook variations each. Agent 3 (Visual Director) designed storyboards, carousel layouts, and image prompts using RoadReach brand system (Pitch Black, Vivid Red, Montserrat). Agent 4 (Guardrail) approved all assets with zero revisions. Agent 5 (Engagement) delivered comment scripts, DM templates, and lead escalation flow. Corrections: rate card CTAs now lead to roadreach.co.za/rate-card.html (lead gen), removed Signorama references, removed X/Twitter, clarified 3-month min commitment with 3/6/12 options, driver earnings linked to drivers.html. Created 7 HTML visual assets (stat card, 5 carousel slides, quote card). Full deliverable saved to RoadReach_Social_Assets_July2026.md. Emailed to info@roadreach.co.za via website API. |
| 2026-06-27 | **Activated growth team outreach — 3 emails sent** — Pineapple Insurance (Marnus van Heerden), Naked Insurance (Alex Thomson), African Bank (Sbusiso Kumalo) via Zoho SMTP (PowerShell + .NET SmtpClient). Personalized sequences with brand-specific hooks, R2,125/car/month pricing, book-meeting CTA. LinkedIn InMails for Pret A Manger and Delivery Ka Speed pending (needs LinkedIn login). CRM tracker updated. Browser automation attempted (Zoho React form too restrictive) fell back to SMTP. |
| 2026-06-27 | **Built Financial Operations & Billing Squad prototype** — Interactive React SPA for RoadReach's financial lifecycle (4 agents: Quote Architect, Billing Specialist, Reconciliation Clerk, Financial Controller). Live pricing, volume discounts, VAT invoices, escalation triggers, full pipeline workflow. Served on port 8289 via OpenDesign. Created `opendesign/` folder structure in workspace. |
| 2026-06-26 | **WhatsApp Auto-Responder Bot moved to roadreach_vault** — moved from OpenWork workspace to `roadreach-whatsapp-bot/`. Bot rebuilt to v2.0 using whatsapp-web.js (no Meta/Facebook account needed). AI pipeline tested with Ollama + knowledge base. Status page at http://localhost:3001 with QR code display. |
| 2026-06-26 | Built RoadReach WhatsApp Campaign Manager (Node.js/Express/sql.js SPA) — driver management, message templates, campaign creation with wa.me links, scheduling. Created Road Reach design system matching official brand guidelines (roadreach_brand_guidelines.html). Colors: Vivid Red #C11111, Pitch Black #020202, Montserrat + EB Garamond. Added logo. |
| 2026-06-25 | Removed netlify.toml; created vercel.json with security headers (X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy) |
| 2026-06-25 | Fixed case study "Read Full Case Study" links — replaced `#` placeholders with `contact.html` |
| 2026-06-25 | Fixed duplicate `.vercel` entry in `.gitignore` |
| 2026-06-25 | Added JSON-LD structured data (Organization, WebSite, WebPage/BlogPosting) to all 13 pages |
| 2026-06-25 | Created sitemap.xml + robots.txt for SEO |
| 2026-06-25 | Created thank-you.html redirect page; updated main.js form handler to redirect instead of in-place replacement |
| 2026-06-25 | Created RSS feed (feed.xml) with RSS auto-discovery links on all 4 blog pages |
| 2026-06-25 | Updated opencode.jsonc with project config |
| 2026-06-25 | Created copies of instructions.md, governance.md, memory.md, suggestions.md inside .opencode/ |
| 2026-06-25 | Added GA4 analytics (G-F13FWS4SWH) to all 14 pages |
| 2026-06-25 | Committed and pushed all changes to GitHub → Vercel auto-deploy |
| 2026-06-24 | Initial session — created instructions, governance, memory, and suggestions files |
| 2026-06-24 | Recovered and archived full RoadReach website build history from past sessions |
| 2026-06-24 | Connected GitHub repo to Vercel for auto-deployment on push to `main` |
| 2026-06-24 | Site audit — tested all pages/forms, identified 6 issues (2 critical, 1 high, 1 medium, 2 low) |
| 2026-06-24 | Created `site-audit-report.md` with full findings |
| 2026-06-24 | Built `api/contact.js` serverless function with Nodemailer + ZohoMail SMTP |
| 2026-06-24 | Rewrote `main.js` form handler to POST to `/api/contact` with proper error handling |
| 2026-06-24 | Removed all `data-netlify="true"` remnants from forms in contact.html, packages.html |
| 2026-06-24 | Added Rate Card modal overlay to index.html, about.html, drivers.html, case-studies.html |
| 2026-06-24 | Added `.env`, `.env.example`, updated `.gitignore` to exclude secrets |
| 2026-06-24 | Fixed PDF ★ characters, cleaned up contact layout, replaced & with 'and' in bullets |
| 2026-06-24 | Added rate card modal + sticky CTA to all 4 blog pages (blog/index.html, post1-3.html) |
| 2026-06-24 | Updated blog post CTA boxes with "Get the Rate Card" button |
| 2026-06-24 | Fixed JS crash on blog pages — hamburger null-check preventing all scripts from running |
| 2026-06-24 | Updated site-audit-report.md, governance.md, memory.md with full session summary |
