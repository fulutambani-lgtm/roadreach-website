/**
 * RoadReach — Driver Waitlist API (Vercel Serverless)
 *
 * Accepts POST from the driver waitlist form on drivers.html and
 * driver-application.html. Stores data in Google Sheets via webhook.
 *
 * Environment variables:
 *   ZOHO_EMAIL         — ZohoMail account
 *   ZOHO_PASSWORD      — ZohoMail app password
 *   CONTACT_EMAIL      — Where waitlist notifications are forwarded
 *   SHEETS_WEBHOOK_URL — Google Apps Script webhook for sheet logging
 */

import nodemailer from 'nodemailer';

const ZOHO_EMAIL    = process.env.ZOHO_EMAIL;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || ZOHO_EMAIL;
const SHEETS_URL    = process.env.SHEETS_WEBHOOK_URL;

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: { user: ZOHO_EMAIL, pass: ZOHO_PASSWORD },
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Build notification email for RoadReach admin
 */
function buildNotificationEmail(body) {
  const { name, email, phone, vehicleType, vehicleYear, city, message } = body;

  return {
    subject: `[RoadReach Driver Waitlist] ${name} — ${vehicleType || 'Unknown vehicle'}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C11111;">New Driver Waitlist Signup</h2>
        <hr style="border: none; border-top: 2px solid #C11111;" />

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333; width: 140px;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Phone</td>
              <td style="padding: 8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Vehicle Type</td>
              <td style="padding: 8px 0;">${escapeHtml(vehicleType || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Vehicle Year</td>
              <td style="padding: 8px 0;">${escapeHtml(vehicleYear || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">City / Area</td>
              <td style="padding: 8px 0;">${escapeHtml(city || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Message</td>
              <td style="padding: 8px 0;">${escapeHtml(message || '—')}</td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 0.85rem;">
          Signed up from <strong>roadreach.co.za</strong> driver waitlist
        </p>
      </div>
    `,
  };
}

/**
 * Log to Google Sheet via webhook (non-fatal if it fails)
 */
async function logToSheet(data) {
  if (!SHEETS_URL) return;
  try {
    const payload = {
      type: 'driver-waitlist',
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      vehicleType: data.vehicleType || '',
      vehicleYear: data.vehicleYear || '',
      city: data.city || '',
      message: data.message || '',
      source: 'driver-waitlist',
    };
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Sheet log sent for driver waitlist:', data.email);
  } catch (err) {
    console.error('Sheet logging failed (non-fatal):', err.message);
  }
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://www.roadreach.co.za',
    'https://roadreach.co.za',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!ZOHO_EMAIL || !ZOHO_PASSWORD) {
    console.error('Missing ZohoMail credentials in environment variables');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const body = req.body || {};

    // ── Validation ──
    if (!body.name || !body.email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    if (!body.email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    // ── 1. Send notification to RoadReach admin ──
    const transport = createTransport();
    const emailContent = buildNotificationEmail(body);

    await transport.sendMail({
      from: `"RoadReach Waitlist" <${ZOHO_EMAIL}>`,
      replyTo: body.email,
      to: CONTACT_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Waitlist notification sent:', body.email);

    // ── 2. Log to Google Sheet ──
    await logToSheet(body);

    // ── 3. Send confirmation to the signup ──
    try {
      await transport.sendMail({
        from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
        replyTo: ZOHO_EMAIL,
        to: body.email,
        subject: "You're on the RoadReach Driver Waitlist",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #C11111; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #fff; margin: 0; font-size: 24px;">RoadReach</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">
                Driver Waitlist
              </p>
            </div>

            <div style="padding: 32px 24px; background: #ffffff;">
              <h2 style="color: #1A1A1A; margin-top: 0;">You're on the list, ${escapeHtml(body.name || 'driver')}</h2>

              <p style="color: #444; line-height: 1.6;">
                Thanks for your interest in becoming a RoadReach driver! We've added you to our
                <strong>Driver Waitlist</strong>.
              </p>

              <p style="color: #444; line-height: 1.6;">
                You'll be among the <strong>first to know</strong> when driver applications reopen.
                We'll send you an email with everything you need to apply.
              </p>

              <p style="color: #444; line-height: 1.6;">
                While you wait, feel free to use our
                <a href="https://www.roadreach.co.za/drivers.html#earnings-calculator" style="color: #C11111;">
                  earnings calculator
                </a>
                to see how much you could earn.
              </p>

              <div style="background: #f9f9f9; border-left: 4px solid #C11111; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #333; font-size: 14px;">
                  <strong>Questions?</strong><br/>
                  WhatsApp us: <a href="https://wa.me/27812987137" style="color: #C11111;">+27 81 298 7137</a>
                </p>
              </div>
            </div>

            <div style="background: #1A1A1A; padding: 20px 24px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
                &copy; 2026 RoadReach Media &bull; info@roadreach.co.za &bull; www.roadreach.co.za
              </p>
            </div>
          </div>
        `,
      });
      console.log('Confirmation sent to:', body.email);
    } catch (confirmErr) {
      // Non-fatal — the signup is still saved
      console.error('Confirmation email failed:', confirmErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "You're on the waitlist! We'll notify you when driver applications reopen.",
    });
  } catch (err) {
    console.error('Failed to process waitlist signup:', err.message);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again or email us at info@roadreach.co.za.' });
  }
}
