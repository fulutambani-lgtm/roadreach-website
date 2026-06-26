/**
 * RoadReach — Book a Meeting API (Vercel Serverless)
 *
 * Handles POST from the book-meeting.html form.
 * 1. Sends detailed notification email to admin with Accept/Suggest Alternative action links
 * 2. Sends confirmation to the user
 * 3. Logs to Google Sheet via webhook (if SHEETS_WEBHOOK_URL is configured)
 *
 * The admin can use the action links in the email to confirm or suggest a different time.
 * Action links go to a lightweight admin response endpoint.
 *
 * Environment variables:
 *   ZOHO_EMAIL         — ZohoMail account
 *   ZOHO_PASSWORD      — ZohoMail app password
 *   CONTACT_EMAIL      — Where submissions are forwarded
 *   SHEETS_WEBHOOK_URL — Optional Google Apps Script webhook for sheet logging
 *   BASE_URL           — Site base URL for admin action links (defaults to https://www.roadreach.co.za)
 */

import nodemailer from 'nodemailer';
import crypto from 'crypto';

const ZOHO_EMAIL    = process.env.ZOHO_EMAIL;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || ZOHO_EMAIL;
const SHEETS_URL    = process.env.SHEETS_WEBHOOK_URL;
const BASE_URL      = process.env.BASE_URL || 'https://www.roadreach.co.za';

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
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function platformLabel(val) {
  const labels = {
    'zoom': 'Zoom',
    'google-meet': 'Google Meet',
    'whatsapp': 'WhatsApp Video / Voice',
    'phone': 'Phone Call',
    'in-person': 'In Person (Pretoria area)',
    'other': 'Other',
  };
  return labels[val] || val;
}

function buildAdminEmail(body) {
  const { name, email, phone, company, 'proposed-date': date, 'proposed-time': time, platform, message } = body;
  const meetingId = crypto.createHash('md5').update(`${email}-${date}-${time}-${Date.now()}`).digest('hex').slice(0, 12);

  return {
    meetingId,
    subject: `[RoadReach Booking] ${name} — ${date} at ${time}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#D9040E;">📅 New Meeting Booking Request</h2>
        <hr style="border:none;border-top:2px solid #D9040E;" />

        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px 0;font-weight:600;color:#333;width:140px;">Name</td>
              <td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Phone</td>
              <td style="padding:8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Company</td>
              <td style="padding:8px 0;">${escapeHtml(company || '—')}</td></tr>
        </table>

        <div style="background:#f9f9f9;border-left:4px solid #D9040E;padding:16px;margin:20px 0;">
          <h3 style="margin:0 0 12px;color:#333;">Proposed Meeting</h3>
          <p style="margin:4px 0;"><strong>Date:</strong> ${escapeHtml(date)}</p>
          <p style="margin:4px 0;"><strong>Time:</strong> ${escapeHtml(time)} (SAST)</p>
          <p style="margin:4px 0;"><strong>Platform:</strong> ${escapeHtml(platformLabel(platform))}</p>
          ${message ? `<p style="margin:4px 0;"><strong>Message:</strong> ${escapeHtml(message)}</p>` : ''}
        </div>

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

        <h3 style="color:#333;">Actions</h3>
        <p style="color:#555;">
          <a href="${BASE_URL}/api/meeting-response?id=${meetingId}&response=accepted&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}"
             style="background:#28a745;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;margin:4px;font-weight:600;">
            ✅ Accept This Time
          </a>
          <a href="${BASE_URL}/api/meeting-response?id=${meetingId}&response=needs-change&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}"
             style="background:#ffc107;color:#333;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;margin:4px;font-weight:600;">
            🔄 Suggest Alternative
          </a>
          <p style="margin-top:12px;font-size:0.85rem;color:#888;">
            Meeting ID: ${meetingId}<br/>
            <a href="mailto:${escapeHtml(email)}">Reply to ${escapeHtml(email)}</a> to coordinate directly.
          </p>
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#888;font-size:0.85rem;">
          Sent from <strong>roadreach.co.za/book-meeting</strong>
        </p>
      </div>
    `,
  };
}

function buildUserConfirmationHtml(body) {
  const { name, date, time, platform } = body;
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#D9040E;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:24px;">RoadReach</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">
          South Africa's Premier Mobile Billboard Network
        </p>
      </div>
      <div style="padding:32px 24px;background:#ffffff;">
        <h2 style="color:#1A1A1A;margin-top:0;">Hi ${escapeHtml(name || 'there')},</h2>
        <p style="color:#444;line-height:1.6;">
          We've received your meeting request and will confirm within <strong>24 hours</strong>.
        </p>
        <div style="background:#f9f9f9;border-left:4px solid #D9040E;padding:16px;margin:24px 0;">
          <h4 style="margin:0 0 8px;color:#333;">Your Proposed Meeting</h4>
          <p style="margin:4px 0;color:#555;"><strong>Date:</strong> ${escapeHtml(date)}</p>
          <p style="margin:4px 0;color:#555;"><strong>Time:</strong> ${escapeHtml(time)} (SAST)</p>
          <p style="margin:4px 0;color:#555;"><strong>Platform:</strong> ${escapeHtml(platformLabel(platform))}</p>
        </div>
        <p style="color:#444;line-height:1.6;">
          If your preferred time isn't available, we'll suggest an alternative that works for both of us.
        </p>
        <div style="background:#f9f9f9;border-left:4px solid #D9040E;padding:16px;margin:24px 0;">
          <p style="margin:0;color:#333;font-size:14px;">
            <strong>Need to change or cancel?</strong><br/>
            WhatsApp us: <a href="https://wa.me/27812987137" style="color:#D9040E;">+27 81 298 7137</a>
          </p>
        </div>
      </div>
      <div style="background:#1A1A1A;padding:20px 24px;border-radius:0 0 8px 8px;text-align:center;">
        <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">
          &copy; 2026 RoadReach Media &bull; info@roadreach.co.za &bull; www.roadreach.co.za
        </p>
      </div>
    </div>
  `;
}

async function logToSheet(data) {
  if (!SHEETS_URL) return;
  try {
    const payload = {
      type: 'book-meeting',
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company || '',
      date: data['proposed-date'],
      time: data['proposed-time'],
      platform: data.platform,
      message: data.message || '',
      source: 'book-meeting',
    };
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Sheet log sent for booking:', data.email);
  } catch (err) {
    console.error('Sheet logging failed (non-fatal):', err.message);
  }
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://www.roadreach.co.za', 'https://roadreach.co.za',
    'http://localhost:3000', 'http://localhost:5173',
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  if (!ZOHO_EMAIL || !ZOHO_PASSWORD) {
    console.error('Missing ZohoMail credentials');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const body = req.body || {};

    if (!body.name || !body.email || !body['proposed-date'] || !body['proposed-time'] || !body.platform) {
      return res.status(400).json({ success: false, error: 'Name, email, date, time, and platform are required' });
    }

    const transport = createTransport();

    // 1. Send detailed notification to admin with action links
    const adminEmail = buildAdminEmail(body);
    await transport.sendMail({
      from: `"RoadReach Website" <${ZOHO_EMAIL}>`,
      replyTo: body.email,
      to: CONTACT_EMAIL,
      subject: adminEmail.subject,
      html: adminEmail.html,
    });
    console.log(`Booking admin notification sent: ${adminEmail.subject}`);

    // 2. Send confirmation to user
    try {
      await transport.sendMail({
        from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
        replyTo: ZOHO_EMAIL,
        to: body.email,
        subject: 'Your RoadReach Meeting Request — Received',
        html: buildUserConfirmationHtml({
          name: body.name,
          date: body['proposed-date'],
          time: body['proposed-time'],
          platform: body.platform,
        }),
      });
      console.log(`Booking confirmation sent to ${body.email}`);
    } catch (confirmErr) {
      console.error('Confirmation email failed (non-fatal):', confirmErr.message);
    }

    // 3. Log to Google Sheet
    await logToSheet(body);

    return res.status(200).json({
      success: true,
      message: 'Your meeting request has been submitted! We\'ll confirm within 24 hours.',
    });
  } catch (err) {
    console.error('Failed to process booking:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to submit booking. Please try again later.' });
  }
}
