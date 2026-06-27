# RoadReach Website — Suggestions & Future Improvements

**Updated:** 27 June 2026

---

## High Priority

### 1. Driver Application Reopening Workflow
- **When**: Driver recruitment reopens
- **What**: Query "Driver Waitlist" sheet tab for rows where `Notified` = `No`, email each signup with the application link, update to `Notified` = `Yes`
- **Automation potential**: Create a simple admin page or API endpoint that sends batch notifications in one click

### 2. Submit Sitemap to Google Search Console
- `rate-card.html` and `driver-application.html` are newly indexable and should be submitted to Search Console for faster discovery

---

## Medium Priority

### 3. Case Study Detail Pages
- Currently all "Read Full Case Study" links go to `contact.html`
- Create dedicated case study pages with real campaign data and results
- Would improve SEO and serve as social proof for prospects

### 4. Visible FAQ Sections
- FAQPage schema exists on 3 pages (`index.html`, `packages.html`, `drivers.html`) but is schema-only
- Adding visible FAQ accordions matching the schema would improve both UX and search ranking for featured snippets / AI Overviews

### 5. Earnings Calculator CTA
- The earnings calculator on `drivers.html#earnings-calculator` still shows a "Get Notified" button below the results
- Update to link to `#driver-waitlist` section on the same page (now that the waitlist form exists)

---

## Lower Priority

### 6. Blog Content Cadence
- Only 3 blog posts — consider a regular publishing cadence for SEO momentum
- Topics: mobile billboard effectiveness, case studies, SA advertising trends

### 7. Automated Follow-Up Emails
- Currently all emails are one-shot (notification + auto-reply)
- Consider a CRM integration or automated follow-up sequence for leads who submit rate card requests but don't book a meeting

### 8. Admin Dashboard
- Simple password-protected page showing recent submissions, waitlist signups, booking requests
- Would reduce dependency on checking Gmail and Google Sheets manually

### 9. Test the Waitlist on the Live Site
- After deploy, submit the waitlist form and confirm:
  - ✅ Waitlist confirmation email received (not rate card PDF)
  - ✅ Row appears in Google Sheets "Driver Waitlist" tab
  - ✅ Admin notification email sent
  - ✅ Redirect to `thank-you.html?type=driver-waitlist` with branded message
