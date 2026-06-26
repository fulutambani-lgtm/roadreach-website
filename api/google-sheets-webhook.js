/**
 * ===============================================================
 *  RoadReach — Google Sheets Webhook (Google Apps Script)
 * ===============================================================
 *
 * WHAT THIS DOES:
 *   This is NOT a Vercel serverless function.
 *   It is a Google Apps Script that you deploy as a web app.
 *   The RoadReach API POSTs to this webhook, which writes data
 *   to a Google Sheet in real time.
 *
 * HOW TO INSTALL:
 *   1. Create or open your Google Sheet (e.g. the one at
 *      https://docs.google.com/spreadsheets/d/1YjVG0nhpl42n0k7sbnY1gKBscE25L9fztjma6piZAdI)
 *   2. Go to Extensions → Apps Script
 *   3. Delete any placeholder code and paste this entire file
 *   4. Save (Ctrl+S) and name the project "RoadReach Webhook"
 *   5. Click Deploy → New Deployment
 *      - Type: Web App
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   6. Click Deploy and copy the Web App URL
 *   7. In your Vercel project, set the environment variable:
 *      SHEETS_WEBHOOK_URL = <the URL you just copied>
 *   8. (Optional) Add sheet names matching the tab names below.
 *
 * SHEET STRUCTURE:
 *   The script creates two tabs (if they don't exist):
 *     "Rate Cards"  — for rate card PDF downloads
 *     "Bookings"    — for meeting booking requests
 *
 * ===============================================================
 */

/**
 * Google Sheet ID where webhook data is stored.
 * Replace this with your own sheet ID if you want to use a different sheet.
 * To get the ID: open your Google Sheet, look at the URL:
 * https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit
 */
const SHEET_ID = '132fBCwviAIEhVgKc3UegnsERQ21p2hvA4ullmBWVsjk';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type || 'unknown';
    let ss = SpreadsheetApp.openById(SHEET_ID);

    if (type === 'rate-card') {
      logRateCard(ss, data);
    } else if (type === 'book-meeting') {
      logBooking(ss, data);
    } else {
      // Generic fallback sheet
      logGeneric(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'RoadReach Google Sheets Webhook is running.',
      endpoints: { POST: '/ (rate-card, book-meeting)' },
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Rate Card Requests ──
function logRateCard(ss, data) {
  const sheet = ensureSheet(ss, 'Rate Cards', [
    'Timestamp', 'Name', 'Company', 'Email', 'Phone', 'Interest', 'Fleet Size', 'Source'
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.company || '',
    data.email || '',
    data.phone || '',
    data.interest || '',
    data.fleetSize || '',
    data.source || '',
  ]);
}

// ── Meeting Bookings ──
function logBooking(ss, data) {
  const sheet = ensureSheet(ss, 'Bookings', [
    'Timestamp', 'Name', 'Email', 'Phone', 'Company', 'Proposed Date', 'Proposed Time', 'Platform', 'Message', 'Source'
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.date || '',
    data.time || '',
    data.platform || '',
    data.message || '',
    data.source || '',
  ]);
}

// ── Generic fallback ──
function logGeneric(ss, data) {
  const sheet = ensureSheet(ss, 'All Submissions', [
    'Timestamp', 'Type', 'Raw JSON'
  ]);
  sheet.appendRow([
    new Date().toISOString(),
    data.type || 'unknown',
    JSON.stringify(data),
  ]);
}

// ── Helper: Get or create a sheet tab with headers ──
function ensureSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    // Bold the header row
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight('bold');
    range.setBackground('#D9040E');
    range.setFontColor('#FFFFFF');
  }
  return sheet;
}
