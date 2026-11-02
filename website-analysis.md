# RoadReach Website — In-Depth Analysis

**Date:** 1 September 2026  
**Scope:** Full codebase, content, architecture, design, SEO, performance, security, and conversion strategy  
**Live URL:** https://www.roadreach.co.za/

---

## 1. Architecture & Tech Stack

### What the site is
A multi-page static website (20+ HTML files) with Vercel serverless API functions. No build step, no framework, no CMS. Pure HTML/CSS/JS with serverless backends.

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5, CSS3 (custom properties), Vanilla JS (no framework) |
| Fonts | Google Fonts — Montserrat (headings) + Bitter (body) |
| Icons | Font Awesome 6.5.0 (full CDN) |
| Hosting | Vercel (auto-deploy from GitHub) |
| API | Vercel Serverless Functions (Node.js, ES modules) |
| Email | Nodemailer → ZohoMail SMTP (smtp.zoho.com:465, SSL) |
| PDF Generation | pdfkit (on-the-fly A4 rate card) |
| Analytics | Google Analytics 4 (G-F13FWS4SWH) |
| CRM/Sheets | Google Apps Script webhook → Google Sheets |
| Version Control | GitHub (`fulutambani-lgtm/roadreach-website`) |

### Assessment
The stack is **appropriate for a startup website**. No build step means zero deployment complexity — push to GitHub and Vercel serves it. The trade-off is no component reuse, no templating, and massive HTML duplication across pages.

**Key concern:** Every page duplicates the full nav, footer, sticky CTA bar, and WhatsApp button. That's ~100 lines of boilerplate per page, multiplied by 20 pages. Any nav change requires editing 20 files.

---

## 2. Design System & Visual Identity

### Brand Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--brand-red` | `#D9040E` | Primary accent, CTAs, badges, links |
| `--dark-charcoal` | `#2C2C2C` | Nav, hero, footer, dark sections |
| `--medium-charcoal` | `#3A3A3A` | Body text, secondary dark |
| `--light-gray` | `#F5F5F5` | Section backgrounds |
| `--off-white` | `#FAFAFA` | Alternate section bg |
| `--white` | `#FFFFFF` | Card backgrounds |
| `--font-heading` | Montserrat | All headings, buttons, nav |
| `--font-body` | Bitter (serif) | Body text, paragraphs |

### Color palette assessment
The palette is **strong and consistent**. Red (#D9040E) is a confident, high-energy primary that suits a brand about movement and empowerment. The charcoal + white + red triad is classic corporate with enough contrast for readability.

**Issue:** No secondary/accent color exists. Everything is red-on-charcoal or red-on-white. A complementary accent (warm gold for "earnings/empowerment" sections, or a teal for "trust/POPIA" sections) would add visual hierarchy. The brand feels one-note after scrolling.

### Typography assessment
**Montserrat** (headings) is a strong, modern geometric sans-serif — appropriate for a tech-forward brand. **Bitter** (body) is a slab serif that adds warmth and readability — good pairing choice.

**Concern:** Bitter is loaded with 4 weights (400, 600, 700, 400 italic). Montserrat loads 9 weights (400–900). That's 13 font files from Google Fonts, which is heavy. Most pages use only 3-4 weights in practice. Reduce to `wght@400;600;700;800` for Montserrat and `wght@400;600` for Bitter.

### Component patterns
The design uses a consistent component library:
- **Cards:** Rounded corners (12px), subtle shadows, hover lift (translateY -4px to -8px)
- **Buttons:** 3 variants (primary red, secondary white, outline red), consistent padding
- **Section labels:** Uppercase, letter-spaced, red — excellent hierarchy signal
- **Stat blocks:** Large number + small label pattern used effectively

**Anti-pattern detected:** Inline styles are used extensively (especially in the social impact section, the drivers waitlist form, and the about page mission cards). This defeats the CSS architecture and makes maintenance harder. Example from `index.html`:
```html
<div class="impact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
```
These should be in the CSS file as utility classes or component classes.

---

## 3. Information Architecture & Navigation

### Page inventory (20+ pages)
| Page | Purpose | SEO Value |
|------|---------|-----------|
| `index.html` | Homepage — hero, pricing overview, fleet, how-it-works, social impact, testimonials, CTA | High |
| `packages.html` | Detailed wrap packages + campaign bundles + Drivers' Choice | High |
| `rate-card.html` | Gated rate card with cost calculator, fleet table, installation rates | **Highest** |
| `case-studies.html` | 3 case studies + testimonials | High |
| `drivers.html` | Driver programme, earnings calculator, waitlist | High |
| `about.html` | Founder story, mission, values | Medium |
| `contact.html` | Contact form + info | Medium |
| `book-meeting.html` | Meeting booking form | Medium |
| `driver-application.html` | Driver application process | Medium |
| `driver-terms.html` | Legal — driver terms | Low |
| `privacy.html` | Legal — privacy policy | Low |
| `terms-of-service.html` | Legal — ToS | Low |
| `refund-policy.html` | Legal — refund policy | Low |
| `media-kit.html` | Brand-facing media kit | Medium |
| `car-mockup-preview.html` | Vehicle mockup previewer | Low |
| `thank-you.html` | Post-submission thank you | None (noindex) |
| `blog/index.html` | Blog index | High |
| `blog/post1.html` | Blog — mobile billboards trend | Medium |
| `blog/post2.html` | Blog — neuroscience of vehicle ads | Medium |
| `blog/post3.html` | Blog — RoadReach launch | Medium |

### Navigation structure
**Desktop nav:** Home | Packages | Rate Card | Case Studies | Drivers | About | Contact | [Book a Meeting]
**Mobile nav:** Hamburger → slide-in panel from right

### Assessment
The navigation is **clear and well-organized**. The "Book a Meeting" CTA is properly elevated as a button. The nav order follows a logical buyer journey: understand → price → proof → engage → trust → contact.

**Issues:**
1. **Blog is hidden from main nav.** Only accessible via footer link "Insights". This is a missed SEO opportunity — blog content should be discoverable from the main nav.
2. **Media Kit page is unreachable** from any nav or footer. Only accessible via direct URL.
3. **Car Mockup Preview** is unreachable from nav. Appears to be a tool, not a content page — should be linked from packages or rate card.
4. **Missing breadcrumbs visually** — they exist in JSON-LD schema but not rendered on the page. Adding visual breadcrumbs on sub-pages helps navigation context.

---

## 4. Content Strategy & Copywriting

### Messaging hierarchy
1. **Primary:** "High-Impact Reach. Real-World Empowerment."
2. **Secondary:** "Turn city streets into brand galleries while creating sustainable income for drivers."
3. **Tertiary:** Pricing → packages → bundles → CTA

### Copy quality assessment

**Strengths:**
- The founder story on `about.html` is genuinely compelling. The school-run moment, the thought that "never gave her peace" — this is authentic storytelling.
- The Drivers' Choice campaign is brilliant social proof: "Your brand, chosen by our drivers" is an irresistible pitch.
- Pricing transparency is excellent — launch pricing with strikethrough regular prices creates urgency.
- The 15x effectiveness claim is well-sourced and repeated consistently.

**Weaknesses:**
- **Testimonials feel generic.** "Thabo M., Marketing Director, FMCG Brand" — no real names, no real company names. For a B2B site, this reads as fabricated. Either use real testimonials or remove them. Fabricated testimonials destroy trust if discovered.
- **Case studies are hypothetical.** "National Retail Chain boosts foot traffic by 34%" — no brand name, no timeframe specifics, no data source. The "Enquire About This Campaign" links go to contact.html, confirming these are illustrative, not real. This is a legal liability.
- **The "15x more effective" claim** appears on the homepage FAQ schema but the source isn't cited anywhere on the visible page. Add a source link (OAAA or relevant study).
- **Drivers page earnings range is inconsistent** — `index.html` says "R800–R9,842", `drivers.html` meta says "R1,700–R6,800", and the `drivers.html` page body shows the full table starting at R800. The meta description is stale.

### Content gaps
1. **No video content.** The Drivers' Choice section has a placeholder video player but no actual video embed. This is a missed opportunity — a 30-second explainer would convert far better than text.
2. **No real fleet photos.** The images directory has mockups and stock photos but no actual branded vehicles on the road. For a mobile billboard company, seeing real wraps in real locations is essential proof.
3. **Blog is thin.** Only 3 posts, all from June 2026. No updates in 3 months. This signals an abandoned blog to both users and search engines.

---

## 5. SEO & Technical SEO

### What's done well
- **JSON-LD structured data** on all pages: Organization, LocalBusiness, WebPage, BreadcrumbList, FAQPage (on 3 pages with 15 Q&As total). This is above-average for a startup site.
- **Canonical URLs** on all 10 indexable pages.
- **Meta descriptions** are keyword-rich with SA city names.
- **Sitemap.xml** exists with priorities and frequencies.
- **robots.txt** exists, blocks `/api/`.
- **Open Graph + Twitter Card** meta tags on homepage.
- **GA4** tracking on all pages.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| **OG:image is a local path** | 🔴 High | `og:image` on `index.html` is `images/hero-bg.jpg` — relative path won't resolve in social shares. Must be `https://www.roadreach.co.za/images/hero-bg.jpg` |
| **No OG meta on sub-pages** | 🟡 Medium | Only `index.html` has OG/Twitter tags. All 19 other pages have no Open Graph markup — social shares will show blank previews |
| **Stale meta description on drivers.html** | 🟡 Medium | Says "R1,700-R6,800" but actual range is R800-R9,842 |
| **No hreflang** | 🟠 Low | All content is English — acceptable for SA-only site |
| **Blog lacks BlogPosting schema** | 🟡 Medium | Blog posts have Organization/WebPage schema but no BlogPosting schema — missing rich results for articles |
| **FAQ schema not visible** | 🟠 Medium | 15 FAQ Q&As exist in JSON-LD on 3 pages but no visible FAQ accordion on the page. Google may not show FAQ rich results if content isn't visible |
| **No `<link rel="alternate">` for RSS on main site** | 🔵 Low | RSS auto-discovery only on blog pages, not on homepage |

### Local SEO
The LocalBusiness schema includes:
- Address (Festura Street, Lotus Gardens, Pretoria, 0008)
- Phone (+27-81-298-7137)
- Area served (Gauteng, Cape Town, Durban, Pretoria, Johannesburg, South Africa)
- Opening hours (Mo-Fr 08:00-17:00)
- Price range (R2,125 - R17,000/month)

**This is solid.** Missing: Google Business Profile link, Google Maps embed on contact page, and `geo` coordinates in the LocalBusiness schema.

---

## 6. Forms & Backend API

### API endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contact.js` | POST | Contact form → email admin + auto-reply |
| `/api/rate-card.js` | POST | Rate card request → email admin + PDF auto-reply + Sheets log |
| `/api/book-meeting.js` | POST | Meeting booking → email admin with Accept/Suggest links |
| `/api/meeting-response.js` | GET/POST | Admin response handler for meeting bookings |
| `/api/driver-waitlist.js` | POST | Driver waitlist → email admin + confirmation + Sheets log |
| `/api/google-sheets-webhook.js` | POST | Google Apps Script proxy for Sheets logging |
| `/api/generate-rate-card.js` | — | PDF generator (pdfkit) |

### Form flow assessment

**Rate card form (gate):**
1. User fills form (name, company, email, phone, interest, fleet size)
2. JavaScript intercepts submit (capture phase) → POST to `/api/rate-card`
3. On success: gate form hides, content reveals in-place (no redirect)
4. Server sends admin notification + PDF auto-reply + logs to Sheets

This is a **well-designed lead gate**. The content reveal (no redirect) keeps the user on the page where they can immediately explore pricing. The PDF attachment provides a portable reference. The dual-email pattern (admin notification + user auto-reply) is correct.

**Contact form:**
1. User fills form → POST to `/api/contact`
2. Redirects to `/thank-you.html?type=contact`
3. Server sends admin notification + user confirmation

**Issues:**
1. **Contact form uses `action="/api/contact" method="POST"`** which would submit as a regular form POST if JS fails. The `main.js` intercepts with `e.preventDefault()`, but the HTML has both an `action` and JS handler — this creates a fragile dual-path.
2. **No rate limiting** on API endpoints. A bot could spam thousands of submissions. Vercel's default rate limits are generous (100 invocations/second on Pro, but this is likely on Hobby/Free tier with 1000/day or similar).
3. **No CAPTCHA or honeypot** on any form. Vulnerable to automated spam.
4. **CORS is hardcoded** to localhost:3000 and localhost:5173 — appropriate for dev but should be removed or restricted in production (Vercel serves from same origin, so CORS headers are unnecessary for same-origin requests).
5. **PDF generation in `contact.js`** is imported but only used when `form-name === 'rate-card'`. This means the `contact.js` endpoint loads pdfkit even when it doesn't need it, increasing cold-start time for every contact form submission.

---

## 7. Performance

### What's good
- **Static HTML** — zero server-rendering overhead. Vercel's CDN serves files from edge locations.
- **`defer` attribute** on all `<script>` tags — eliminates render-blocking.
- **`loading="lazy"`** on below-fold images.
- **`preconnect`** to Google Fonts origins.
- **No framework overhead** — no React, no Vue, no build step.

### Concerns

| Issue | Impact | Detail |
|-------|--------|--------|
| **Font Awesome CDN (full)** | 🔴 High | Loading the entire FA 6.5.0 CSS (~90KB) when only ~15 icons are used. Could self-host only needed icons or use FA's SVG + JS subset approach. |
| **Google Fonts: 13 font weights** | 🟡 Medium | 13 files loaded. Reduce to 4-5 actual weights used. |
| **No image optimization** | 🟡 Medium | Images in `/images/` appear to be original JPEGs without WebP conversion or responsive `srcset`. The `car mockups/` folder has PNG files at presumably full resolution. |
| **Inline styles** | 🟠 Low | 50+ inline style attributes across pages increase HTML size and prevent caching. |
| **No CSS/JS minification** | 🟠 Low | `style.css` (1655 lines) and `main.js` (223 lines) are unminified. Vercel can handle this with a build step or edge middleware. |
| **Rate card page is very heavy** | 🟡 Medium | `rate-card.html` has ~1000 lines of HTML plus ~150 lines of inline JS (calculator, gate handler, countdown). Combined with the gated content, this is a large page. |
| **No service worker / offline** | 🔵 Low | Static site could benefit from a basic service worker for offline access. |

### Estimated Lighthouse scores (inferred)
- **Performance:** ~65-75 (fonts + FA CDN + unoptimized images)
- **Accessibility:** ~80-85 (good semantic HTML, some contrast issues)
- **Best Practices:** ~85 (no security headers beyond vercel.json, mixed content concerns)
- **SEO:** ~90-95 (excellent structured data, good meta tags)

---

## 8. Security

### What's in place
- **Security headers** via `vercel.json`: X-Frame-Options (DENY), X-XSS-Protection, X-Content-Type-Options (nosniff), Referrer-Policy
- **POPIA compliance** claimed in footer badges
- **`.env` in `.gitignore`** — credentials not committed
- **HTML escaping** in API email builders (`escapeHtml()` function)
- **CORS whitelist** on API endpoints

### Concerns

| Issue | Severity | Detail |
|-------|----------|--------|
| **No CSRF protection** | 🟡 Medium | Forms POST JSON without any CSRF token. Acceptable for stateless forms (no session), but a bot could still spam. |
| **No rate limiting** | 🟡 Medium | No per-IP or per-session rate limiting on API endpoints. |
| **No Content-Security-Policy** | 🟡 Medium | Missing CSP header. The site loads scripts from 3 origins (Google, Google Fonts, Font Awesome CDN) — a CSP would prevent XSS. |
| **No Strict-Transport-Security** | 🟠 Low | Vercel may handle this automatically, but explicit `Strict-Transport-Security: max-age=31536000` would be better. |
| **SMTP credentials in env** | ✅ Good | ZOHO_PASSWORD is in Vercel env vars, not in code. |
| **`.env.example` committed** | ✅ Good | Template shows required vars without exposing values. |

---

## 9. Business Logic & Conversion Strategy

### Conversion funnel
```
Homepage → Rate Card (gated) → Form submit → PDF email → Meeting booking
Homepage → Book a Meeting → Meeting form → Admin email → Accept/Decline
Drivers page → Waitlist form → Admin email → Notification
Contact page → Contact form → Admin email → Auto-reply
```

### Assessment

**Strengths:**
1. **Rate card gating is smart.** Hiding pricing behind a lead capture form is standard B2B practice. The in-place reveal (no redirect) keeps users engaged.
2. **PDF auto-reply with rate card** is excellent — gives the lead something portable and branded.
3. **Dual email pattern** (admin notification + user auto-reply) ensures no lead falls through cracks.
4. **Google Sheets logging** provides a lightweight CRM without software costs.
5. **Sticky CTA bar** on every page with dismiss state (sessionStorage) is well-implemented.
6. **WhatsApp floating button** is appropriate for SA market where WhatsApp is dominant.
7. **Countdown timer** on rate card creates genuine urgency for launch pricing.

**Weaknesses:**
1. **Pricing inconsistency across pages.** `index.html` shows Lite from R1,550, `packages.html` shows Lite from R1,550, but `rate-card.html` gated content shows R2,125. The "from" prices differ — R1,550 vs R2,125. This is confusing.
2. **"Back doors backwards" vs "back doors forward"** — `index.html` and `rate-card.html` say "back doors backwards" but `packages.html` says "back doors forward" for Standard. One of these is wrong.
3. **No A/B testing** on any CTA, form, or page layout. With GA4 in place, Google Optimize (or equivalent) could test headline variants, form field counts, or CTA button text.
4. **No exit-intent popup** to capture abandoning visitors.
5. **No live chat or chatbot** — WhatsApp is good but requires the user to leave the page.
6. **Case studies are unconvincing** — no real brand names, no verifiable data. A prospect seeing "National Retail Chain" will assume these are made up.

---

## 10. Mobile Experience

### Responsive breakpoints
The CSS defines 3 breakpoints:
- `1024px` — tablet: single-column grids, reduced padding
- `768px` — mobile: hamburger menu, further grid simplification
- `480px` — small mobile: stacked hero actions, single-column stats

### Assessment
**The responsive design is well-executed.** The hamburger menu slides in from the right with proper overlay and body scroll lock. Grids collapse cleanly. Touch targets meet the 44px minimum (buttons are 14px padding + content).

**Issues:**
1. **Sticky CTA bar hides on mobile (<480px)** — good decision, but the WhatsApp button isn't repositioned for the missing bar. It sits at `bottom: 24px` which may overlap page content.
2. **Hero stat grid on mobile** — at 480px, the 4 stats stack to 1 column, making the hero very tall. Consider hiding 1-2 stats on small screens.
3. **Rate card calculator** — the range slider works on mobile but the select dropdowns may be hard to tap on very small screens. The calculator section doesn't have a mobile-specific layout.
4. **Drivers waitlist form** — inline styles on form inputs set explicit widths that may not respect the container on very narrow screens.

---

## 11. Strengths Summary

1. **Excellent structured data** — Organization, LocalBusiness, FAQPage, BreadcrumbList schemas across 11+ pages. This is better than most SA startup sites.
2. **Lead capture architecture** — gated rate card, PDF auto-reply, dual email, Sheets logging — a complete lead generation system built from scratch.
3. **Consistent brand identity** — red/charcoal palette, Montserrat/Bitter typography, and component patterns are applied uniformly across 20+ pages.
4. **Strong founder story** — the about page has authentic, emotionally resonant copy that differentiates RoadReach from faceless OOH companies.
5. **Campaign bundles** — shifting from per-car pricing to outcome-based bundles (HyperLocal, City Impact, Metro Dominance, National Takeover) is sophisticated B2B pricing strategy.
6. **Drivers' Choice social proof** — leveraging TikTok virality (104.2K views) as a B2B sales tool is creative and effective.
7. **Earnings calculator** — interactive tool on drivers page gives immediate value to prospective drivers.
8. **Security headers** — Vercel config provides basic protections.
9. **Comprehensive legal pages** — privacy, terms, refund, driver terms all present.
10. **POPIA compliance** — claimed and architecturally supported (data handling, consent).

---

## 12. Weaknesses & Issues

### Critical (fix immediately)

1. **Pricing inconsistency.** Lite package shows R1,550 on index.html/packages.html but R2,125 on rate-card.html gated content. Standard shows R3,800 vs R4,675. Premium shows R7,550 vs R8,500. One set of numbers is wrong.
2. **Standard wrap description conflict.** "back doors backwards" on index/rate-card vs "back doors forward" on packages. Needs one truth source.
3. **OG:image is a relative path** — `images/hero-bg.jpg` won't resolve in social shares. Must be absolute URL.
4. **No Open Graph tags on 19 of 20 pages** — social shares from sub-pages show blank previews.

### High priority

5. **Testimonials and case studies appear fabricated** — no real names, no verifiable companies. This is a trust liability for a B2B brand.
6. **Drivers page meta description** says "R1,700-R6,800" but actual range is R800-R9,842.
7. **Blog is abandoned** — last post June 2026, now September. Three months of silence.
8. **No video content** — the Drivers' Choice placeholder video player is empty. Embed the actual TikTok or create a 30-second explainer.
9. **Blog hidden from main navigation.** Should be "Insights" or "Blog" in the nav.
10. **Media Kit and Car Mockup pages are unreachable** from any navigation.

### Medium priority

11. **No CSP header** — vulnerable to XSS.
12. **No CAPTCHA/rate limiting** on forms.
13. **Font Awesome CDN loads entire library** (~90KB) when ~15 icons are used.
14. **13 Google Font weights loaded** — should be 4-5.
15. **Inline styles** used extensively instead of CSS classes.
16. **No `srcset` or responsive images** — all images served at original resolution.
17. **No real fleet photos** — stock/mockup images don't prove the product works.
18. **FAQ schema exists but no visible FAQ accordion** — may not trigger rich results.

### Low priority

19. No service worker / PWA features.
20. No CSS/JS minification.
21. No A/B testing infrastructure.
22. No exit-intent capture.
23. No breadcrumbs rendered visually (only in schema).

---

## 13. Recommendations

### Immediate (this week)
1. **Audit all pricing across all pages** and create a single source of truth. Pick one set of numbers (the rate-card.html gated prices appear most current) and propagate.
2. **Fix the Standard wrap description** — choose "back doors backwards" or "back doors forward" and make it consistent.
3. **Add absolute OG:image URLs** to all 20 pages. Add full OG/Twitter meta tags to every page.
4. **Fix drivers.html meta description** to match actual payout range.

### Short-term (this month)
5. **Replace fabricated testimonials** with real ones or remove them. Even 1-2 genuine quotes from actual clients (even anonymous with company name verified) are worth more than 3 fake ones.
6. **Embed the actual TikTok video** in the Drivers' Choice sections on packages.html and rate-card.html.
7. **Add Blog to main navigation** as "Insights".
8. **Create visible FAQ accordions** matching the existing schema on index.html, packages.html, and drivers.html.
9. **Add real fleet photos** — even 3-4 photos of actual branded vehicles on SA roads would dramatically increase credibility.

### Medium-term (this quarter)
10. **Reduce font loading** — subset to 4-5 weights, self-host critical fonts, convert images to WebP.
11. **Add CSP header** to vercel.json.
12. **Implement basic rate limiting** on API endpoints (Vercel Edge Config or a simple IP-based counter).
13. **Create a shared HTML template** or consider migrating to a lightweight static site generator (11ty, Hugo) to eliminate 20x boilerplate duplication.
14. **Start publishing blog content** consistently — 1 post per month minimum, targeting SA-specific OOH advertising keywords.
15. **Add Google Business Profile** link and Google Maps embed on contact page.

### Strategic (next quarter)
16. **Build a real CRM** — the Google Sheets approach works now but won't scale. HubSpot Free or a custom solution.
17. **Create video content** — a 60-second brand explainer, driver testimonials, fleet showcase.
18. **Add A/B testing** — test headline variants, form field counts, CTA button text.
19. **Implement exit-intent capture** — offer a downloadable media kit in exchange for email.
20. **Consider a headless CMS** (Sanity, Strapi) for blog content management — current static HTML blog is unmaintainable for regular publishing.

---

## 14. File-Level Issues

| File | Line | Issue |
|------|------|-------|
| `index.html` | 8 | Meta description says "R2,125" for Lite but package card says "R1,550" |
| `index.html` | 204 | Hero stat says "R1,550" for Lite but rate-card.html says R2,125 |
| `index.html` | 262 | Standard description says "back doors backwards" |
| `packages.html` | 260 | Standard description says "back doors forward" — **contradicts index.html** |
| `drivers.html` | 8 | Meta description says "R1,700-R6,800" — should be "R800-R9,842" |
| `rate-card.html` | 178 | LocalBusiness priceRange says "R2,125 - R17,000" but index.html says "R2,125 - R17,000" |
| `index.html` | 15 | OG:image is relative path `images/hero-bg.jpg` |
| `about.html` | 159 | Emoji icons (🎯, 🤝, 📊) used as section icons — inconsistent with Font Awesome used everywhere else |
| `packages.html` | 243-245 | Lite claims "Professional installation included" but audit report says this was removed as misleading |
| All pages | — | ~100 lines of duplicated nav/footer/sticky bar HTML per page |

---

## 15. Competitive Position

RoadReach's website is **significantly better than most South African OOH competitors**. The structured data, lead capture system, and pricing transparency put it ahead of traditional billboard companies that often have outdated, Flash-era websites.

However, it lacks the polish of established OOH players like JCDecaux or Continental Outdoor Media. The fabricated testimonials and case studies are a notable weakness — these companies use verifiable client logos and named campaigns.

**The founder story and Drivers' Choice campaign are unique differentiators** that no competitor can replicate. These should be more prominently featured, not buried on sub-pages.

---

*Analysis complete. Total pages reviewed: 20 HTML, 1 CSS (1655 lines), 1 JS (223 lines), 7 API functions, 1 JSON config, 5 documentation files.*
