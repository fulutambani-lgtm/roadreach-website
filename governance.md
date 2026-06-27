# Governance Log

This file records every significant decision, feature addition, architectural choice, and process change made in this workspace. The AI reads this at session start (alongside `instructions.md`) to stay aligned with prior agreements.

---

## How to Use

- **Add an entry** whenever a decision is made or a feature is added.
- **Format** (see template below):
  - **Date** – ISO format (YYYY-MM-DD)
  - **Title** – short, descriptive name
  - **Decision** – what was decided or done
  - **Rationale** – why this choice was made
  - **Alternatives considered** – what else was explored (if any)
  - **Status** – `active`, `superseded`, `reverted`, `completed`
- The newest entries go at the top.

---

## Entry Template

```markdown
### YYYY-MM-DD — Title
- **Decision**: (what was decided)
- **Rationale**: (why)
- **Alternatives considered**: (options weighed)
- **Status**: active
```

---

## Decision Log

### 2026-06-27 — 70% claim removed from website, replaced with factual driver payout range
- **Decision**: Reworded "70% of media spend goes directly to drivers" across the site. In `index.html` hero stats, changed label from "of Media Spend Goes Directly to Drivers" to "Fair Driver Payouts", then replaced the entire "70%" animated counter with static text: "Drivers earn R800–R9,842/mo" / "Monthly Driver Payout Range". In `api/generate-rate-card.js` PDF bullet, changed to "Fair and competitive driver payouts — drivers earn R800–R9,842/month". Added `.hero-stat .stat-text` CSS class and mobile breakpoint rule.
- **Rationale**: User asked to reword the 70% claim, then specifically requested replacing the 70% animation with the driver payout range. The new stat uses verified figures already published on driver-application.html and drivers.html (R800–R9,842/month range), removing a potentially challenged percentage claim.
- **Files modified**: `index.html`, `api/generate-rate-card.js`, `css/style.css`
- **Status**: active

### 2026-06-27 — WhatsApp bot SMTP_PASS configured and bot restarted
- **Decision**: Added SMTP_HOST=smtp.zoho.com, SMTP_PORT=465, SMTP_USER=info@roadreach.co.za, and SMTP_PASS to `roadreach-whatsapp-bot/.env` (previously only had ESCALATION_EMAIL). Killed stale node process on port 3001 (PID 16308). Restarted bot via start-bot.bat — confirmed listening on port 3001 (PID 3356).
- **Rationale**: Bot's escalation.js references SMTP_PASS for future email alerts. User explicitly asked to ensure SMTP_PASS was set and bot restarted.
- **Files modified**: `roadreach-whatsapp-bot/.env`
- **Status**: active

### 2026-06-27 — TikTok Automated Replies Blocked by Anti-Spam
- **Decision**: Abandoned all programmatic/browser-automated TikTok reply approaches after proving TikTok silently drops replies (returns HTTP 200 with "Comment sent successfully" but nothing persists). TikTok DM inbox checked — 244 pending message requests discovered including brand leads from **Cremora SA** and **Telkom**.
- **Rationale**: TikTok's server-side anti-spam detects non-human interaction regardless of method (XHR interceptor, native DOM events, React fiber dispatch, fetch() to /api/comment/publish/). All produce fake 200 success. Account trust level too low for automated writes. Manual replying via mobile app is the only reliable path.
- **Technical findings**: Intercepted the exact XHR request/response for `/api/comment/publish/` — correct URL params (X-Bogus, _signature, csrf tokens), correct JSON body, status_code=0 in response. Reply visible optimistically in React UI ("View 1 reply") but vanishes on hard reload. Tested across 3+ video comment threads, same result every time.
- **Alternatives considered**: Browser automation via `element.click()` (works for UI but same API rejection), React fiber tree manipulation (over-complex, same backend), fetch() with exact captured headers (same result), mobile viewport m.tiktok.com (not tested — user should try phone app), third-party TikTok APIs (SocialData, Apify — could work but costs money and integration time).
- **Impact**: All 11 prepared reply scripts remain unsent. Engagement SOP now requires manual mobile app interaction (5-10 min/day). DM discovery (244 requests, brand leads) is more urgent than comment replies.
- **Status**: active

### 2026-06-28 — Executive Assistant activated: Email management system + 7-suggestion execution
- **Decision**: Activated the Elite AI Email Manager for both mailboxes (info@ + fulu.tambani@). Executed all 7 strategic suggestions from intake session: (1) TikTok brand drip campaign — 14 Tier 1 brand outreach pipeline created. (2) Email templates library (8 templates) + ZohoMail auto-routing rules. (3) CRM live dashboard (HTML/JS, replaces CSV). (4) Lead scoring system for info@ inbox. (5) Pret A Manger and Delivery Ka Speed unblocked — alternative contacts researched. (6) Two-phase TikTok outreach for all 28 brands. (7) Countdown timer added to rate-card.html.
- **Also built**: Brand Media Kit at media-kit.html (brand-facing overview with stats, packages, bundles, proof points). Driver support link suggestion documented.
- **Rationale**: Systematic approach to turn the TikTok 104.2K-view viral moment into a revenue pipeline. Standardised email operations reduce response time and ensure brand consistency. Live CRM replaces the stale CSV that was missing 28 TikTok leads.
- **Files created/modified**:
  - `roadreach-website/rate-card.html` — live JS countdown to 31 Aug 2026
  - `roadreach-website/media-kit.html` — brand media kit (HTML + printable PDF)
  - `outreach/email-templates.md` — 8 standard templates + auto-routing rules
  - `outreach/tiktok-brand-drip-campaign.md` — 28-brand sequenced outreach with custom hooks
  - `outreach/lead-scoring-rules.md` — scoring matrix + ZohoMail filter specs
  - `outreach/crm-dashboard.html` — live pipeline dashboard (replaces static CSV)
- **Alternatives considered**: Keeping static CSV (loses 28 TikTok leads), sending generic outreach without TikTok proof (colder response rates), no email template system (inconsistent brand voice).
- **Status**: active

### 2026-06-28 — Board Analysis: Pricing restructure, 70% claim correction, Drivers' Choice campaign
- **Decision**: Accepted full Board analysis. Implemented three major changes: (1) Current pricing designated as **Launch Pricing** with strikethrough regular prices (~25-30% higher after 31 Aug 2026) across rate-card.html and packages.html. (2) All "70% to drivers" claims removed from all 14 HTML pages and replaced with factual driver payout ranges (R800–R9,842/month). (3) Campaign outcome bundles added (HyperLocal R68K, City Impact R136K, Metro Dominance R245K, National Takeover R550K). (4) Drivers' Choice TikTok campaign section added to rate-card.html, packages.html, and social assets doc.
- **Rationale**: Board identified 19-29 percentage point gap between "70%" claim and actual payout ratios (41-51%) — a trust liability. Launch pricing creates urgency and frames current low prices as a limited opportunity rather than permanent under-pricing. Campaign bundles shift conversation from per-car line-item scrutiny to outcome-based buying. Drivers' Choice TikTok (104.2K views) provides powerful social proof.
- **Technical details**: Updated 11 HTML files total. rate-card.html received new CSS (strikethrough, launch badges, campaign bundle cards, Drivers' Choice section), updated package cards, pricing table, calculator JS (now shows savings vs regular price), and benefits section. packages.html received matching treatment. All 9 footer trust badges updated across site. Blog posts post1.html and post3.html corrected. Meta descriptions and JSON-LD updated. growth-team-lead-dossier.md updated with launch pricing urgency and Drivers' Choice hook in outreach sequences. RoadReach_Social_Assets_July2026.md updated with Asset #5 (Drivers' Choice) and pricing correction notice.
- **Future regular prices set**: Lite R2,800 (was R2,125), Standard R6,100 (was R4,675), Premium R11,000 (was R8,500) — Small vehicle base. Medium/Large/XL scale by 1.25x/1.5x/2.0x multipliers.
- **Launch period ends**: 31 August 2026
- **Alternatives considered**: Immediate price increase without grandfathering (rejected — kills urgency play), keeping 70% claim with a disclaimer (rejected — still misleading), partial site update (rejected — inconsistency across pages creates trust issues).
- **Status**: active

### 2026-06-27 — Financial Squad v1.1: Multi-client workflows + PDF generation + email reminders
- **Decision**: Upgraded the Financial Operations & Billing Squad prototype from single-client to multi-client concurrent workflow. Created `server.js` (Express + pdfkit + Nodemailer) on port 3480. Added PDF generation endpoints (`/api/generate-quote-pdf`, `/api/generate-invoice-pdf`) and email reminder endpoint (`/api/send-reminder`). Frontend rewritten with client CRUD, per-client pipeline state, top-bar client selector with dropdown, dashboard with aggregate stats (active/completed/overdue clients), and all client management view.
- **Rationale**: The v1.0 prototype could only handle one client at a time. Real billing ops need concurrent per-client pipelines. PDF generation and email sending were mocked in the UI — now they produce real documents and hit real SMTP.
- **Technical details**: Express server on port 3480 serves static files + API. pdfkit generates professional branded PDFs (A4, RoadReach red header, line-item tables, VAT calculations, footer). Nodemailer transport via ZohoMail SMTP (same pattern as `roadreach-website/api/contact.js`). Frontend client state uses `clients[]` array with `selectedClientId` for routing. State sync between TopBar and InternalApp via custom DOM events (`rr-sync`). 4 agents unchanged but now parameterized per selected client. Financial Controller view shows all-client escalation queue + status table.
- **Alternatives considered**: Server-sent events for real-time state sync (over-engineered), rendering TopBar inside App (CSS positioning conflict with fixed topbar), keeping single-client (limiting), static PDF generation only (missed email integration).
- **Status**: active

### 2026-06-27 — Social media strategy: 4 pillars, LinkedIn + TikTok focus, advertiser acquisition
- **Decision**: Built a complete social media engine for RoadReach with 4 content pillars (ROI & Data, Fleet in Action, Founder & Mission, Education). Primary goal: advertiser/client acquisition. Priority platforms: LinkedIn (advertisers) and TikTok (drivers). Instagram and Facebook kept active. X/Twitter removed entirely.
- **Rationale**: User confirmed driver applications are closed. All energy goes into selling the fleet to brands. LinkedIn is the B2B lead gen channel; TikTok builds driver culture and brand awareness.
- **Key corrections locked**: (1) Rate card CTAs always lead to roadreach.co.za/rate-card.html (visitor enters details → lead generated, NOT a direct giveaway). (2) No Signorima — replaced with "professional installers" / "professional partners". (3) Minimum commitment: 3 months with 3/6/12 options. (4) Driver earnings point to roadreach.co.za/drivers.html earnings calculator. (5) Industries: "any brand with physical presence or online with specific geographic targets."
- **Alternatives considered**: Single-platform focus (rejected — spreads risk), X/Twitter (removed per user), giving rate card freely (rejected — misses lead gen opportunity).
- **Status**: active

### 2026-06-27 — Visual assets built as HTML/CSS templates (no Canva integration available)
- **Decision**: Created 7 HTML/CSS visual assets (stat card, 5 LinkedIn carousel slides, founder quote card) using RoadReach brand tokens — Pitch Black (#020202), Vivid Red (#C11111), Montserrat typography. Stored in `RoadReach_Visual_Assets/`.
- **Rationale**: No Canva extension exists in OpenWork's ecosystem. HTML renders pixel-perfect brand-accurate designs that can be screenshot for publishing.
- **Alternatives considered**: Canva browser automation (no OpenWork extension available for Canva API), manual design in Canva by user (user asked agent to handle it).
- **Status**: active

### 2026-06-27 — Engagement playbook with lead escalation flow to Fulu
- **Decision**: Delivered complete engagement playbook with platform-specific comment replies, DM templates (advertiser inquiry, pricing objection, proof of ROI, driver inquiry), and lead escalation flow. High-value triggers: 10+ vehicle proposals, Marketing Director/CMO titles, specific campaign budgets, competitor mentions, partnership inquiries → escalate to fulu.tambani@roadreach.co.za + WhatsApp.
- **Rationale**: Ensures consistent brand voice across all interactions and catches high-value leads before they go cold.
- **Status**: active

### 2026-06-27 — Growth team outreach activated — 3 emails sent via Zoho SMTP
- **Decision**: Sent personalized outreach emails from fulu.tambani@roadreach.co.za to 3 high-priority leads: Pineapple Insurance (marnus@pineapple.co.za), Naked Insurance (alex@naked.insure), and African Bank (sbusiso.kumalo@africanbank.co.za). Used PowerShell + .NET SmtpClient via Zoho SMTP (smtp.zoho.com:587, STARTTLS, app-specific password). LinkedIn InMails to Pret A Manger and Delivery Ka Speed remain pending (user ended session before LinkedIn login).
- **Rationale**: User gave "go all out" directive — fire all sequences simultaneously. Zoho browser automation was attempted first but failed due to React-controlled form inputs rejecting programmatic values. SMTP approach succeeded on first try once correct app password was provided.
- **Alternatives considered**: Zoho Mail browser automation (failed — React state not updatable via JS), Send-MailMessage PowerShell cmdlet (failed — deprecated SMTP client), .NET SmtpClient (succeeded).
- **Technical details**: Used `System.Net.Mail.SmtpClient` with explicit `NetworkCredential`, port 587, `EnableSsl=$true` (STARTTLS). Emails sent as HTML with personalized hooks: Pineapple (Oct 2024 blog post hook), Naked (Senior Art Director job posting hook), African Bank ("You Audacious People" campaign hook). Each included R2,125/car/month pricing and roadreach.co.za/book-meeting.html CTA.
- **Status**: active

### 2026-06-26 — WhatsApp Campaign Manager sends via wa.me click-to-chat links (not API)
- **Decision**: Built the send flow around `wa.me` links that open in browser tabs with pre-filled messages, rather than integrating WhatsApp Cloud API for programmatic sending.
- **Rationale**: User has the WhatsApp Business App, not a WhatsApp Business Account (WABA) with API access. Click-to-chat is immediately usable — open links, hit Send on WhatsApp Web. Cloud API can be added later as an upgrade.
- **Alternatives considered**: WhatsApp Cloud API (requires WABA setup — not yet configured), third-party services like WATI/Twilio (monthly cost), WhatsApp Business App broadcast lists (limited to 256 contacts).
- **Status**: active

### 2026-06-26 — Road Reach brand design system matches official guidelines
- **Decision**: Updated the Road Reach design system (`design-systems/road-reach/`) and all app CSS to use exact values from the official brand guidelines file (`roadreach_brand_guidelines.html`).
- **Rationale**: Earlier version used guessed colors (navy #1B2A3C, orange #E07A2F, DM Sans). Official spec uses Vivid Red #C11111, Pitch Black #020202, Montserrat (headings), EB Garamond (body). Ensures brand consistency.
- **Alternatives considered**: N/A — brand guidelines are authoritative.
- **Status**: active

### 2026-06-26 — Chose sql.js (WASM SQLite) over better-sqlite3 for database
- **Decision**: Used `sql.js` (WebAssembly SQLite) instead of `better-sqlite3` for the database layer.
- **Rationale**: `better-sqlite3` requires native compilation (node-gyp + Visual Studio C++ build tools). The Windows environment lacks these. `sql.js` is pure WebAssembly — no compilation needed, works on any Node.js version.
- **Alternatives considered**: better-sqlite3 (failed at build), JSON file storage (no query support), full PostgreSQL/MySQL (too heavy for a local tool).
- **Status**: active

### 2026-06-25 — Google Analytics 4 added to all pages
- **Decision**: Added GA4 gtag.js snippet (Measurement ID: G-F13FWS4SWH) to all 14 HTML pages.
- **Rationale**: User chose GA4 over paid alternatives (Plausible) and self-hosted options (Umami) due to zero cost. GA4 provides pageviews, events, and audience data.
- **Alternatives considered**: Plausible (€9/mo — no budget), Umami (self-hosted — maintenance overhead), Cloudflare Web Analytics (free but less data).
- **Status**: active

### 2026-06-25 — Created thank-you.html redirect page
- **Decision**: Created `thank-you.html` as a dedicated post-submission page. Updated `main.js` `showFormSuccess()` to `window.location.href = '/thank-you.html'` instead of replacing the form in-place.
- **Rationale**: Better UX (clear confirmation, works if JS fails), follows standard Vercel/Netlify form flow, and allows users to see a proper branded page with next steps.
- **Alternatives considered**: In-place form replacement (previous behavior — broke if JS partially failed), alert-only (poor UX).
- **Status**: active

### 2026-06-25 — Added RSS feed with auto-discovery on blog pages
- **Decision**: Created `feed.xml` (RSS 2.0) with all 3 blog posts as items. Added `<link rel="alternate" type="application/rss+xml">` to all 4 blog page `<head>` sections.
- **Rationale**: Gives the blog a distribution channel beyond the website. RSS auto-discovery lets feed readers find it automatically.
- **Alternatives considered**: Atom format (less widely supported by readers), no feed (status quo — no distribution).
- **Status**: active

### 2026-06-25 — Added sitemap.xml and robots.txt
- **Decision**: Created `sitemap.xml` with all 14 pages, priorities, and change frequencies. Created `robots.txt` disallowing `/api/` and pointing to the sitemap.
- **Rationale**: Essential for search engine indexing. Sitemap helps Google discover all pages. robots.txt prevents API endpoints from being crawled.
- **Alternatives considered**: N/A — standard SEO practice.
- **Status**: active

### 2026-06-25 — Added JSON-LD structured data to all pages
- **Decision**: Added Organization, WebSite, and page-specific WebPage/BlogPosting schema.org JSON-LD to all 13 HTML pages inside `<script type="application/ld+json">` blocks.
- **Rationale**: Essential for rich search results (knowledge panel, sitelinks). Standard SEO best practice.
- **Alternatives considered**: Microdata (more verbose, harder to maintain), RDFa (less widely supported).
- **Status**: active

### 2026-06-25 — Security headers migrated from netlify.toml to vercel.json
- **Decision**: Removed `netlify.toml` (dead config after Vercel migration). Created `vercel.json` with security headers: X-Frame-Options: DENY, X-XSS-Protection: 1; mode=block, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin. Also added `/blog` → `/blog/` permanent redirect.
- **Rationale**: netlify.toml was a remnant from the Netlify hosting era. Vercel ignores it entirely, so security headers weren't being served. vercel.json ensures Vercel applies them.
- **Alternatives considered**: Using Vercel dashboard UI (less portable, no version control), ignoring headers (insecure).
- **Status**: active

### 2026-06-25 — Case study placeholder links pointed to contact.html
- **Decision**: Changed three `href="#"` case study links on case-studies.html to `href="contact.html"` with text "Enquire About This Campaign".
- **Rationale**: Dead links (`#`) cause confusion. Since no detail pages exist yet, pointing to the contact form is the most useful fallback.
- **Alternatives considered**: Removing the links entirely (loses conversion opportunity), creating fake detail pages (out of scope).
- **Status**: active

### 2026-06-25 — Fixed duplicate .vercel in .gitignore
- **Decision**: Removed the duplicate `.vercel` line at the end of `.gitignore`.
- **Rationale**: Cleanliness — duplicate entries cause no functional issue but are confusing.
- **Alternatives considered**: N/A
- **Status**: active

### 2026-06-25 — Created project context files in .opencode/
- **Decision**: Copied `instructions.md`, `governance.md`, `memory.md`, `suggestions.md` into `roadreach_vault/.opencode/` for OpenCode/OpenWork project discovery.
- **Rationale**: OpenCode reads `.opencode/` for project configuration. Having the context files there makes them discoverable by the AI tooling.
- **Alternatives considered**: Keeping them only at the workspace root (not discoverable by OpenCode's config loader).
- **Status**: active

### 2026-06-25 — JS form handler now redirects to thank-you page
- **Decision**: Changed `showFormSuccess()` in `js/main.js` from in-place HTML replacement to `window.location.href = '/thank-you.html'`.
- **Rationale**: The new thank-you.html is a proper branded page with nav, footer, and next-step CTAs. Redirect is more robust and follows web standards.
- **Alternatives considered**: Keep in-place replacement (less robust, no proper URL change), fetch-based redirect (over-engineered).
- **Status**: active

### 2026-06-25 — Initial full site scan and report
- **Decision**: Conducted a full scan of the RoadReach website (source code + live site), identifying 13 issues across code quality, security, SEO, UX, and configuration.
- **Rationale**: Systematic assessment to prioritize fixes before starting feature work.
- **Alternatives considered**: N/A
- **Status**: completed

### 2026-06-24 — JS null-safety: hamburger menu guarded for pages without mobile menu
- **Decision**: Wrapped hamburger menu code in `if (hamburger && navLinks)` guard. Also null-checked `modalClose`.
- **Rationale**: Blog pages have a simplified nav without the `.hamburger` button. The unguarded `hamburger.addEventListener(null)` threw a TypeError that killed ALL subsequent JS — including the rate card modal handler, form submission, and scroll animations.
- **Alternatives considered**: Adding a hamburger to blog pages (unnecessary — blog nav always shows all links), try/catch wrapping the whole block (masks errors).
- **Status**: active

### 2026-06-24 — Rate card modal + sticky CTA added to all blog pages
- **Decision**: Added sticky CTA bar and rate card modal to blog/index.html, post1.html, post2.html, post3.html. Updated existing post CTA boxes to include a "Get the Rate Card" button.
- **Rationale**: Blog pages were the only pages missing the rate card flow. Blog readers interested in advertising are the exact audience for a rate card CTA.
- **Alternatives considered**: Only adding a link to contact.html (less conversion-friendly).
- **Status**: active

### 2026-06-24 — PDF rate card font issue fixed (star characters removed)
- **Decision**: Replaced Unicode ★ characters (U+2605 BLACK STAR) in the PDF generator with plain text "(Most Popular)" label. Also fixed chained .text() calls in contact section and replaced "&" with "and" in bullet lists.
- **Rationale**: pdfkit's built-in Helvetica font cannot render the ★ character. It shows as a garbled .notdef glyph (hollow box or weird symbol) that the user reported as an "extra &" near "standard".
- **Alternatives considered**: Embedding a custom Unicode font (adds complexity and file size), using pdfkit's built-in ZapfDingbats (star available but different style).
- **Status**: active

### 2026-06-24 — Rate card auto-reply with PDF attachment
- **Decision**: The `/api/contact` function now sends TWO emails: a notification to info@roadreach.co.za AND an auto-reply to the submitter with the rate card PDF attached and a Google Sheets link.
- **Rationale**: Provides instant value to prospects requesting a rate card. The PDF is generated on-the-fly so it can be personalised per recipient (name, company).
- **Alternatives considered**: Static PDF file (no personalisation), redirect to Google Sheets only (less professional).
- **Status**: active

### 2026-06-24 — Google Sheets link included in auto-reply
- **Decision**: Added a link to the live Google Sheet rate card in the auto-reply email body alongside the PDF attachment.
- **Rationale**: Gives recipients both a downloadable PDF and access to the live, always-updated rate card. The Google Sheet URL was provided by the user.
- **Alternatives considered**: PDF only (static, can become stale), Sheets only (less formal).
- **Status**: active

### 2026-06-24 — Site audit conducted and issues documented
- **Decision**: Conducted a full manual audit of the live RoadReach website (roadreach.co.za), testing every page, link, form, and interactive element. Findings documented in `site-audit-report.md`.
- **Rationale**: Systematic assessment required before beginning form and UX fixes.
- **Alternatives considered**: N/A
- **Status**: completed

### 2026-06-24 — Forms migrated from Netlify to Vercel serverless function
- **Decision**: Replaced the broken `data-netlify="true"` form approach with a Vercel serverless function at `api/contact.js` using Nodemailer + ZohoMail SMTP (smtp.zoho.com:587). Contact form and Rate Card modal form both POST to `/api/contact`.
- **Rationale**: Netlify forms no longer work after Vercel migration. Serverless function keeps everything self-contained on Vercel. User provided ZohoMail credentials directly.
- **Alternatives considered**: Third-party form services (rejected by user), mailto: links (poor UX).
- **Status**: active (code complete — awaiting Vercel deploy + env vars)

### 2026-06-24 — Rate Card modal added to all pages with sticky CTA bar
- **Decision**: Added the `#rateCardModal` overlay to index.html, about.html, drivers.html, and case-studies.html so the "Get the Rate Card" button in the sticky CTA bar works on every page.
- **Rationale**: Previously the modal only existed on contact.html and packages.html. On other pages, the button appeared but did nothing (JS silently failed because modal element was missing).
- **Alternatives considered**: Switching `data-open-modal` buttons to `<a href="contact.html">` links.
- **Status**: active

### 2026-06-24 — GitHub auto-deploy connected to Vercel
- **Decision**: Linked GitHub repository `fulutambani-lgtm/roadreach-website` to Vercel project `roadreach-website` for automatic deployments on push to `main`.
- **Rationale**: Eliminates manual CLI deploys. Every git push now triggers a production deployment automatically.
- **Alternatives considered**: Manual CLI deploys (what we were doing before — error-prone and inconvenient).
- **Status**: active

### 2026-06-24 — Archived RoadReach website build history into project files
- **Decision**: Recovered full RoadReach website build history from two past OpenWork sessions and stored it permanently in `memory.md`, `governance.md`, `suggestions.md`, and `instructions.md`.
- **Rationale**: Prevents loss of critical project context, decisions, and unfinished work. Ensures continuity across future sessions.
- **Alternatives considered**: Leaving history only in session transcripts (lost after cleanup), summarizing only in memory (insufficient for governance).
- **Status**: completed

### 2026-06-24 — RoadReach form handling: Vercel serverless + Nodemailer + ZohoMail SMTP
- **Decision**: The contact form and "Book a Meeting" email flow will be implemented using a Vercel serverless function (Node.js) with Nodemailer, sending via ZohoMail SMTP (`smtp.zoho.com`).
- **Rationale**: User rejected third-party form services (Web3Forms). They use ZohoMail for their business email. Serverless approach keeps everything self-contained on Vercel with no external dependencies.
- **Alternatives considered**: Web3Forms (rejected by user), Netlify forms (broken after Vercel migration), mailto: links (poor UX).
- **Status**: superseded — implemented as `api/contact.js`; awaiting Vercel deploy + env vars

### 2026-06-24 — Hosting migrated from Netlify to Vercel
- **Decision**: RoadReach website migrated from Netlify to Vercel for hosting.
- **Rationale**: Vercel was chosen for the project hosting platform.
- **Alternatives considered**: Netlify original hosting, other providers.
- **Status**: active (deployed, but GitHub auto-deploy not yet linked)

### 2026-06-24 — GitHub repository created and code pushed
- **Decision**: Git repo initialized locally, GitHub remote created at `fulutambani-lgtm/roadreach-website`, and all 19 source files committed and pushed.
- **Rationale**: Version control essential for collaboration and deployment pipeline.
- **Alternatives considered**: N/A
- **Status**: active

### 2026-06-24 — RoadReach website built as multi-page static HTML site
- **Decision**: Built a 12+ page static HTML website for RoadReach (mobile billboard company) with HTML5, CSS3, and vanilla JavaScript. No framework used.
- **Rationale**: Fast, simple, no build step, easy for the user to edit directly. Perfect for a content/brochure site.
- **Alternatives considered**: React/Next.js (overkill for a brochure site), WordPress (too heavy), Webflow (vendor lock-in).
- **Status**: active

### 2026-06-27 — Driver Waitlist system built (Google Sheets + Vercel API + 2 forms)
- **Decision**: Built a complete driver waitlist system: created `/api/driver-waitlist.js` Vercel serverless function, updated the Google Apps Script webhook with a `logDriverWaitlist()` handler, added full waitlist forms on both `drivers.html` and `driver-application.html`, and added `driver-waitlist` routing to `main.js` and `thank-you.html`.
- **Rationale**: The existing "notify me" form on driver-application.html only sent an email — no structured data storage. The new system stores every signup in a Google Sheet with vehicle type, city, and contact info. When driver applications reopen, the spreadsheet query gives an immediate list of interested drivers to notify.
- **Fields collected**: Name, Email (required), Phone, Vehicle Type, Vehicle Year, City, Message. "Notified" column in sheet tracks who's been contacted.
- **Automated flow**: Form → `/api/driver-waitlist` → admin email notification + Google Sheet log + confirmation email to signup with branded content.
- **⚠️ REMEMBER**: When driver applications reopen, query the "Driver Waitlist" sheet tab and email everyone with "Notified = No" first. Then mark them as "Notified = Yes" after sending.
- **Alternatives considered**: Using only email (lost in inbox), using Typeform (monthly cost), manual CSV exports (error-prone).
- **Status**: active

### 2026-06-27 — All Unsplash images migrated to local serving
- **Decision**: Downloaded all 11 unique Unsplash images (19 references across 17 files) into `roadreach-website/images/`. Updated all HTML `src` attributes, CSS `url()` references, and the `og:image` meta tag to point to local paths. Root-level pages use `images/`. Blog subdirectory pages use `../images/`. CSS uses `../images/` from the `css/` folder.
- **Rationale**: Eliminates CDN dependency. Unsplash could change, throttle, or serve stale images. Local images also improve load speed (no cross-origin DNS lookups, no CDN latency).
- **Alternatives considered**: Keeping hotlinks (risky), switching to a different CDN (still external dependency), using a service worker to cache Unsplash images (over-engineered).
- **Status**: active

### 2026-06-27 — Financial Operations & Billing Squad interactive prototype built
- **Decision**: Built a comprehensive React-based interactive prototype of a multi-agent financial operations system for RoadReach at `opendesign/mockups/roadreach-financial-squad/index.html`. Includes Quote Architect, Billing Specialist, Reconciliation Clerk, and Financial Controller agents with full workflow state management.
- **Rationale**: The user requested a working clickable prototype of the financial agent team defined in their system prompt. React with vanilla `createElement` calls (no Babel/JSX) was chosen for reliability — Babel standalone v8's automatic JSX transform generates ESM imports incompatible with UMD builds.
- **Alternatives considered**: Babel standalone with JSX (failed due to v8 automatic runtime producing ESM imports), vanilla JS (less maintainable for complex state), platform-specific code (not portable).
- **Technical details**: 4 agent roles in sidebar, 5-step pipeline visualization, live pricing calculator with volume discounts (5%/10%/15% at 10/20/50+ cars), VAT at 15%, production fees at R1,500/vehicle. Escalation triggers for sub-10 fleets, custom discounts, overdue payments, and discrepancies. OpenDesign viewer served on port 8289.
- **Status**: active

### 2026-06-24 — Created project instructions & governance system
- **Decision**: Established four workspace files (`instructions.md`, `governance.md`, `memory.md`, `suggestions.md`) to standardize AI-assisted work across sessions.
- **Rationale**: Provides continuity, prevents repeated context loss, captures decisions, and logs improvement ideas systematically.
- **Alternatives considered**: Single monolithic file (less discoverable), using only `.opencode/` config (less visible to user), no formal system (status quo — leads to drift).
- **Status**: active
