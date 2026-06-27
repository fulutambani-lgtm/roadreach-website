# RoadReach Website — Memory

## Driver Waitlist System (Jun 2026)

### What was built
- `/api/driver-waitlist.js` — dedicated Vercel endpoint for waitlist signups. Sends admin notification + branded waitlist confirmation email + logs to Google Sheets.
- Updated `api/google-sheets-webhook.js` — added `logDriverWaitlist()` handler, creates "Driver Waitlist" sheet tab.
- Updated `drivers.html` — replaced old "Get Notified" CTA with full waitlist form (`form-name=driver-waitlist`).
- Updated `driver-application.html` — replaced old single-email notify form with full multi-field waitlist form.
- Updated `js/main.js` — routes `driver-waitlist` form-name to `/api/driver-waitlist`, redirects to `thank-you.html?type=driver-waitlist`.
- Updated `thank-you.html` — branded message for driver-waitlist signups.

### Critical bug fixed
- **`api/contact.js`** was sending rate card PDF to ALL form submissions unconditionally.
- **Fix**: Rate card PDF auto-reply only fires when `form-name === 'rate-card'` (the `isRateCard` variable). General contact submissions get a simple confirmation email with no PDF.
- **Fix**: Inline `onsubmit="return submitWaitlist(this)"` handlers removed from `drivers.html` and `driver-application.html` — they caused double-submit conflicts with `main.js` (which already handles all forms via `forms.forEach`). Now only `main.js` submits the form, avoiding duplicate emails and sheet rows.

### When Driver Applications Reopen
1. Query "Driver Waitlist" sheet tab for rows where "Notified" = "No"
2. Email each signup with application link
3. Update "Notified" to "Yes"

### Deployment Status
- All changes are local only — **not yet deployed to Vercel**.
- Need to push to GitHub for Vercel auto-deploy.
