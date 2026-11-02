# Project Instructions

This file defines how the AI assistant (OpenWork) operates in this workspace. It is the first file to be read at the start of every session.

---

## 1. Required Reading at Session Start

Every time a new session begins, the AI **MUST** read these two files before doing any work:

1. **`instructions.md`** — this file (current context, rules, and file guide)
2. **`governance.md`** — the decision and feature log (to understand what has been agreed)
3. **If the task involves website QA, auditing, or pre-deploy review** — also load the `roadreach-website-audit` skill (`.opencode/skills/roadreach-website-audit/SKILL.md`) and run its `audit-runner.ps1` (see Section 12).

Only after reading both files should any conversation or work commence.

---

## 2. Primary Project

This workspace's primary project is the **RoadReach** website — a multi-page static site for South Africa's premier mobile billboard network.

- **Live site**: https://www.roadreach.co.za/
- **Source code**: `roadreach-website/` (14+ HTML pages + CSS + JS + XML + config)
- **GitHub**: `fulutambani-lgtm/roadreach-website`
- **Hosting**: Vercel

Full context is stored in `memory.md` under the "RoadReach Website" section. Read it for current status, unfinished work, and key facts.

### ⚡ Key Business Decisions (June 2026)
- **70% claim removed** — All "70% of media spend goes to drivers" claims replaced with factual driver payout range (R800–R9,842/month) across all 14 pages + blog + meta + JSON-LD
- **Launch Pricing** — Current prices tagged as limited-time Launch Pricing with strikethrough regular prices (~25-30% higher). Expires 31 August 2026.
- **Campaign bundles** — HyperLocal (R68K), City Impact (R136K), Metro Dominance (R245K), National Takeover (R550K) — shifts conversation from per-car cost to outcome-based buying
- **Drivers' Choice campaign** — 104.2K-view TikTok campaign leveraged as social proof on rate-card.html and packages.html
- **Future regular prices** (post 31 Aug): Lite R2,800 | Standard R6,100 | Premium R11,000 (Small base; Medium ×1.25, Large ×1.5, XL ×2.0)
- See `memory.md` → "Pricing & Messaging — 28 June 2026 Update" for full details

## 2a. Outreach & CRM Infrastructure — June 2026

A comprehensive outreach system built to convert the TikTok 104.2K-view viral moment into a revenue pipeline.

| Asset | Location | Purpose |
|-------|----------|---------|
| Email Templates | `outreach/email-templates.md` | 8 standard templates + ZohoMail routing rules |
| TikTok Brand Drip | `outreach/tiktok-brand-drip-campaign.md` | 28-brand sequenced outreach with custom hooks |
| Lead Scoring Rules | `outreach/lead-scoring-rules.md` | Scoring matrix + auto-escalation for info@ |
| CRM Dashboard | `outreach/crm-dashboard.html` | Live pipeline (27 leads, search, export) — replaces static CSV |
| Media Kit | `roadreach-website/media-kit.html` | Brand-facing overview (stats, packages, bundles, proof points) |
| Countdown Timer | `rate-card.html` (live JS) | Dynamic countdown to 31 Aug 2026 pricing deadline |

**Email flows**: 3 outreach emails sent (Pineapple, Naked Insurance, African Bank) via Zoho SMTP. LinkedIn InMails pending for Pret A Manger and Delivery Ka Speed (alternative contacts found: info@millatinvest.com / support@deliverykaspeed.com).

**Lead scoring triggers**: "10+ cars", "CMO", "Marketing Director", "partnership", "budget" → auto-escalate to fulu.tambani@roadreach.co.za.

## 2b. Secondary Project — RoadReach WhatsApp Auto-Responder Bot

An AI-powered WhatsApp auto-responder for RoadReach that answers customer questions using local AI (Ollama).

- **Location**: `roadreach-whatsapp-bot/`
- **Stack**: Node.js + Express + whatsapp-web.js + Ollama (llama3.2)
- **Port**: 3001
- **Start**: `cd roadreach-whatsapp-bot && npm start` or double-click `start-bot.bat`
- **Status page**: http://localhost:3001
- **Connection**: WhatsApp Web QR code scan (no Meta/Facebook account needed)
- **Escalation**: Emails fulu.tambani@roadreach.co.za when AI is unsure

Full context is stored in `memory.md` under the "WhatsApp Auto-Responder Bot" section.

## 2c. Tertiary Project — RoadReach WhatsApp Campaign Manager

A full-stack web application for sending bulk personalized WhatsApp messages to RoadReach's 750+ driver network.

... (existing content retained) ...

## 2d. Quaternary Project — RoadReach Financial Operations & Billing Squad

An interactive React-based multi-agent financial operations prototype for the full client financial lifecycle.

- **Location**: `opendesign/mockups/roadreach-financial-squad/index.html`
- **Stack**: React 18 (UMD, no build step), vanilla CSS with RoadReach design system tokens
- **Port**: 8289 (OpenDesign viewer)
- **Preview**: http://localhost:8289/opendesign/
- **Agents**: Quote Architect, Billing Specialist, Reconciliation Clerk, Financial Controller

Full documentation in `memory.md` under "RoadReach Financial Operations & Billing Squad — Interactive Prototype".

---

## 2e. Social Media Engine — July 2026 Launch

### ⚠️ TikTok Automated Replies — Confirmed Blocked

TikTok silently drops programmatic reply submissions. The API returns `"status_code":0,"status_msg":"Comment sent successfully"` with HTTP 200, but the reply never persists (not visible after page reload). This is TikTok's server-side anti-automation — browser automation, `fetch()` POST to `/api/comment/publish/`, React event dispatching, and native `.click()` all produce the same result.

**Do not spend time trying to automate TikTok replies.** They must be done manually via the TikTok mobile app.

**Daily engagement SOP** (whoever manages the account):
1. Open TikTok app → Inbox/Activity → Comments
2. Read each new comment
3. Reply using the templates below (from `RoadReach_Social_Assets_July2026.md`)
4. Escalate high-value leads to fulu.tambani@roadreach.co.za
5. Do NOT send links in first reply — TikTok may flag them
6. Estimated time: 5–10 min/day

### 📱 TikTok DM Inbox — 244 Pending Requests (CRITICAL)

Check this from the mobile app every day:
- **Cremora SA** (6/10) — brand reached out to RoadReach
- **Telkom** (6/9) — message request ACCEPTED; major brand lead
- **Avha creations** (6/20) — potential creative partner
- 241 other pending requests (mostly driver inquiries, apps are closed)

Do NOT reply to driver applicants — redirect to roadreach.co.za/drivers.html earnings calculator.

### 🏷️ Known Brand DM Conversations (already initiated by RoadReach)
- GoTyme Bank ZA — pitched, awaiting meeting response
- Discovery South Africa — responded positively
- Pineapple — responded positively
- Bp Lavender — pitched
- Naked Insurance — responded positively

A complete social media content engine for RoadReach, built as a 5-agent pipeline.

- **Strategy**: `RoadReach_Social_Assets_July2026.md` (full deliverable with copy, visuals, engagement playbook)
- **Visual assets**: `RoadReach_Visual_Assets/` (7 HTML/CSS brand-accurate templates)
- **Primary goal**: Advertiser/client acquisition (driver applications closed)
- **Priority platforms**: LinkedIn (advertisers/leads) + TikTok (drivers/culture)
- **Also active**: Instagram, Facebook
- **Not on**: X/Twitter
- **4 pillars**: ROI & Data, Fleet in Action, Founder & Mission, Education
- **Brand rules**: Rate card → roadreach.co.za/rate-card.html (lead gen, not giveaway). No Signorama. 3-month min commitment (3/6/12 options). Driver earnings → drivers.html calculator.
- **Status**: All 4 Week 1 assets approved. Publishing starts Mon 29 June 2026.

Full context stored in `memory.md` under "Social Media Strategy — July 2026 Launch".

---

## 3. Project File Guide

This workspace uses four complementary files to keep the AI and the user aligned across sessions:

| File | Purpose | Who updates it |
|---|---|---|
| `instructions.md` | Master instructions — read first every session. Defines rules, file guide, and behavior. | AI + User |
| `governance.md` | Record of every decision made, feature added, or architectural choice. Updated whenever something is agreed or changed. | AI (prompted by decision) |
| `memory.md` | Working memory for the AI. Tracks project state, current focus, key facts, recent changes, open questions. Kept concise and current. | AI (ongoing) |
| `suggestions.md` | A running list of ideas to improve workflow, code quality, product direction, or tooling. | AI (whenever an idea arises) |

**Files live at the workspace root** alongside `opencode.jsonc`. Copies also exist in `.opencode/` for OpenCode discovery.

---

## 4. Governance Rules

- **Whenever a decision is made** (feature choice, architecture, tooling, process change), the AI **must** add an entry to `governance.md`.
- Each entry should include: date, title, decision summary, rationale, and any alternatives considered.
- The user may also add entries directly.
- Before proposing a new feature or change, the AI should check `governance.md` for prior decisions.

---

## 5. Memory Rules

- The AI maintains `memory.md` to persist context across sessions.
- Update `memory.md` whenever:
  - A task is completed or a milestone is reached.
  - The project focus or priority shifts.
  - Important facts, constraints, or preferences are learned.
  - The session ends (write a brief summary of what was accomplished and what is next).
- Keep entries concise and overwrite/archive stale information rather than letting the file grow indefinitely.

---

## 6. Suggestions Rules

- Whenever the AI has an idea that could improve the user's work, codebase, workflow, or products, it adds an entry to `suggestions.md`.
- Entries should be specific, actionable, and include a brief rationale.
- The user can review, adopt, or dismiss suggestions at any time.
- Do **not** implement a suggestion without the user's approval unless it is trivial and clearly safe.

---

## 7. Behavioral Guidelines

- **Safety first**: Never execute destructive commands (delete, overwrite, force-push) without explicit confirmation.
- **Clarity over brevity**: Explain *what* you are doing and *why*, especially when modifying files or suggesting changes.
- **Minimal surprise**: Prefer the simplest, most maintainable solution. Favor existing patterns in the codebase.
- **Commit discipline**: Do not commit, push, or create PRs unless explicitly asked. When asked, review the diff first.
- **Ask once**: If you need credentials, permissions, or missing context, ask one targeted question and wait for an answer.
- **Prevent drift**: If you notice the project state is out of sync with `memory.md` or `governance.md`, flag it.

---

## 8. File Locations

All paths are relative to the workspace root:
```
C:\Users\ianic\OneDrive - sanbi.org.za\Desktop\roadreach_vault\
```

### Vault Files
- `instructions.md` — this file
- `governance.md` — decision log
- `memory.md` — context memory
- `suggestions.md` — improvement ideas
- `opencode.jsonc` — OpenWork project config

### WhatsApp Campaign Manager
- **App root**: `C:\Users\ianic\opendesign\mockups\road-reach-whatsapp\`
- **Server**: `server.js`
- **Frontend**: `public/index.html`, `public/styles.css`, `public/app.js`
- **DB**: `data/road-reach.db` (auto-saved SQLite)

### WhatsApp Auto-Responder Bot (v2.0 — whatsapp-web.js)
- **Location**: `roadreach-whatsapp-bot/`
- **Stack**: Node.js + Express + whatsapp-web.js + Ollama (local AI)
- **Port**: 3001
- **Start**: `cd roadreach-whatsapp-bot && node src/index.js` or double-click `start-bot.bat`
- **Status page**: http://localhost:3001
- **Health**: http://localhost:3001/health
- **AI**: Ollama with llama3.2 (local, free, open-source)
- **Connection**: WhatsApp Web QR code — no Meta/Facebook account needed
- **Session**: Saved in `roadreach-whatsapp-bot/.whatsapp-session/` — no re-scan after first time

### Design System
- **Root**: `C:\Users\ianic\opendesign\design-systems\road-reach\`
- **Tokens**: `tokens/colors_and_type.css`
- **Brand voice**: `brand/voice-and-tone.md`
- **Skill**: `SKILL.md`

---

## 9. Session Protocols — Good Morning & Good Night

The user has established two mandatory session protocols. These are HARD RULES — failure to follow them is a breach of trust.

### "Good Morning" Protocol (Session Start)
When the user says "good morning" or starts a new session:

1. **READ** `instructions.md` + `governance.md` immediately (per Section 1 above)
2. **READ** `memory.md` to understand current project state
3. **READ** `suggestions.md` for any pending ideas that could be actionable
4. **ANNOUNCE** what you've loaded and what the current state is
5. **ASK** "What's our priority today?" — do NOT start working until the user sets the direction
6. If it's a Monday before the Tier 1 campaign send, **CONFIRM** send script readiness and check if yesterday's sends had any replies

### "Good Night" Protocol (Session End)
When the user says "good night", "goodnight", "signing off", "wrapping up", or similar end-of-session signal:

1. **STOP** all active work immediately
2. **UPDATE ALL FOUR FILES** in this exact order:
   - `memory.md` — Add session entry to Session History with: date, session summary, what was accomplished, what remains, and explicit next-session starting point
   - `governance.md` — Log every decision, feature change, bug fix, architecture choice made this session
   - `suggestions.md` — Add any new improvement ideas that arose
   - `instructions.md` — If any workflows, rules, or behavioral guidelines changed
3. **SYNC .opencode copies**: Update `.opencode\instructions.md`, `.opencode\governance.md`, `.opencode\memory.md`, `.opencode\suggestions.md` to match
4. **FLAG** any critical follow-ups the user needs to handle manually (e.g., QR scan, LinkedIn login)
5. **SAY** "Good night — [brief status]. I'll pick up from here next time. [critical action items]"
6. Do **NOT** start new work after the user says good night. Only file updates and summary.

This protocol was established by the user after the 2026-06-27 session and must never be skipped.

## 10. End-of-Session Required Updates

At the end of every session (whether triggered by "good night" or natural end), the AI **must** update ALL of the following files before concluding:

1. **`memory.md`** — Update session history, project state, current status, open questions. Archive stale info.
2. **`governance.md`** — Log any new decisions, features added, architectural choices, or process changes made during the session.
3. **`suggestions.md`** — Add any new ideas that arose during the session for future improvement.
4. **`instructions.md`** — If any workflows, rules, or behavioral guidelines changed.
5. **`site-audit-report.md`** — (if inside a project repo) Keep in sync with the actual project state; mark resolved issues as fixed.
6. **`.opencode/` copies** — Mirror all changes to `.opencode/instructions.md`, `.opencode/governance.md`, `.opencode/memory.md`, `.opencode/suggestions.md`

The user explicitly requested this after the 2026-06-24 session — consider this a hard rule. Do not end a session with stale documentation.

---

## 11. Team/Agent System Inventory

This section is a quick-reference index of every team/agent system in the RoadReach vault. Full detail in `memory.md`.

| System | Agents/Roles | Key File(s) | Status |
|--------|-------------|-------------|--------|
| **Growth Team** | Lead Scout → Intelligence Analyst → Copywriter → Account Executive (4) | `growth-team-lead-dossier.md` | ✅ Complete — 28-brand pipeline, 5 ICP priorities, sequences A-E |
| **Social Media Agent Team** | Content Strategy → Copywriter → Visual Director → Guardrail → Engagement (5) | `RoadReach_Social_Assets_July2026.md`, `RoadReach_Visual_Assets/` | ✅ 4 assets approved — pending Fulu sign-off & 70% claim fix |
| **Financial Squad** | Quote Architect → Billing Specialist → Reconciliation Clerk → Financial Controller (4) | `opendesign/mockups/roadreach-financial-squad/` | ✅ Prototype v1.1 — not deployed to production |
| **Executive Assistant** | AI email manager — templates, scoring, CRM dashboard, TikTok drip | `outreach/email-templates.md`, `outreach/lead-scoring-rules.md`, `outreach/crm-dashboard.html`, `outreach/tiktok-brand-drip-campaign.md` | ✅ Active — manages info@ + fulu.tambani@ |
| **WhatsApp Auto-Responder Bot** | AI-powered (Ollama + whatsapp-web.js) driver support | `roadreach-whatsapp-bot/` | ❌ QR not scanned — offline |
| **WhatsApp Campaign Manager** | Bulk wa.me campaign sender for 750+ drivers | `opendesign/mockups/road-reach-whatsapp/` | ✅ Built — wa.me click-to-chat workflow |
| **Campaign Execution** | Tier 1 TikTok email send (14 brands), Tier 2 batch outreach (8 brands), LinkedIn InMails (2 brands) | `outreach/send-tier1-campaign.ps1`, `outreach/tier3-linkedin-inmails.md`, `outreach/tiktok-brand-drip-campaign.md` | ✅ Tier 1 scheduled Tue 30 Jun 08:00 — SMTP password moved to env var, test-send verified. African Bank → Tier 2 (Tammy Sondlo TSondlo@africanbank.co.za) |

### ⚡ Quick Facts
- **Outreach sent**: 3 emails (Pineapple, Naked, African Bank) — 27 Jun. African Bank bounced 550 (corrected to TSondlo@africanbank.co.za)
- **Tier 1 campaign**: Scheduled Tue 30 Jun 08:00 — 14 brands, 5-min spacing, logs to outreach/send-campaign-log.txt
- **LinkedIn InMails pending**: Pret A Manger, Delivery Ka Speed (alternative emails known)
- **70% claims**: ✅ ALL FIXED — packages.html footer deployed, growth dossier corrected, social assets verified clean
- **SMTP password**: ✅ Moved to Windows User env var `SMTP_PASS` (Machine fallback) — cleared from source
- **WhatsApp bot QR**: Never scanned — offline
- **Fleet**: 750+ drivers — waitlist only (apps closed)

---

## 12. Website Audits

When auditing or QA-ing the RoadReach website (source or live), use the `roadreach-website-audit` skill:

- **Skill**: `.opencode/skills/roadreach-website-audit/SKILL.md` — full audit checklist, severity model, endpoint map, known-good baseline, fix patterns
- **Runner**: `.opencode/skills/roadreach-website-audit/audit-runner.ps1` — automates the verification greps:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .opencode/skills/roadreach-website-audit/audit-runner.ps1
  ```
  Options: `-SitePath <path>`, `-LiveUrl <url>`, `-SkipLiveCheck`, `-SkipReportFreshness`. Exits 0 on PASS, 1 on any FAIL.
- **Report**: Update `site-audit-report.md` with findings (per Section 10). The runner flags when the report is not dated today.

---

*Last updated: 2026-09-22 (v11 — added Section 12: Website Audits + audit-runner.ps1)*
