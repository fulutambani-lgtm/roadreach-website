/**
 * RoadReach — Contact Form API (Vercel Serverless)
 *
 * Accepts POST from the contact form and rate-card modal,
 * sends email via ZohoMail SMTP using Nodemailer.
 *
 * Environment variables (set in Vercel project):
 *   ZOHO_EMAIL    — ZohoMail account (e.g. info@roadreach.co.za)
 *   ZOHO_PASSWORD — ZohoMail app password
 *   CONTACT_EMAIL — Where form submissions are forwarded (defaults to ZOHO_EMAIL)
 */

import nodemailer from 'nodemailer';

// ---- Configuration ----
const ZOHO_EMAIL    = process.env.ZOHO_EMAIL;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || ZOHO_EMAIL;

// ---- SMTP Transport (ZohoMail) ----
function createTransport() {
  // ZohoMail SMTP: try port 465 (SSL) first, fallback to 587 (STARTTLS)
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: ZOHO_EMAIL,
      pass: ZOHO_PASSWORD,
    },
  });
}

// ---- Email Content Builders ----

function buildContactEmail(body) {
  const { name, email, company, phone, interest, message } = body;

  return {
    subject: `[RoadReach Contact] ${name} — ${interest || 'General Enquiry'}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D9040E;">New Contact Form Submission</h2>
        <hr style="border: none; border-top: 2px solid #D9040E;" />

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333; width: 130px;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Company</td>
              <td style="padding: 8px 0;">${escapeHtml(company || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Phone</td>
              <td style="padding: 8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Interest</td>
              <td style="padding: 8px 0;">${escapeHtml(interest || '—')}</td></tr>
        </table>

        <h3 style="color: #333;">Message</h3>
        <blockquote style="background: #f5f5f5; padding: 16px; border-left: 4px solid #D9040E; margin: 8px 0; white-space: pre-wrap;">
          ${escapeHtml(message)}
        </blockquote>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 0.85rem;">
          Sent from <strong>roadreach.co.za</strong> contact form
        </p>
      </div>
    `,
  };
}

function buildRateCardEmail(body) {
  const { name, company, email, phone, interest, 'fleet-size': fleetSize, ...rest } = body;

  return {
    subject: `[RoadReach Rate Card] ${name} — ${company}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D9040E;">Rate Card / Media Kit Request</h2>
        <hr style="border: none; border-top: 2px solid #D9040E;" />

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333; width: 130px;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Company</td>
              <td style="padding: 8px 0;">${escapeHtml(company)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Phone</td>
              <td style="padding: 8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Package Interest</td>
              <td style="padding: 8px 0;">${escapeHtml(interest || '—')}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #333;">Fleet Size</td>
              <td style="padding: 8px 0;">${escapeHtml(fleetSize || '—')}</td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 0.85rem;">
          Sent from <strong>roadreach.co.za</strong> rate-card request form
        </p>
      </div>
    `,
  };
}

// ---- Helpers ----

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---- Main Handler ----

export default async function handler(req, res) {
  // CORS headers
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

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Validate environment
  if (!ZOHO_EMAIL || !ZOHO_PASSWORD) {
    console.error('Missing ZohoMail credentials in environment variables');
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const body = req.body || {};
    const formName = body['form-name'] || 'contact';

    // --- Validation ---
    if (!body.name || !body.email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    if (formName === 'contact' && !body.message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // --- Build email ---
    const isRateCard = formName === 'rate-card';
    const emailContent = isRateCard ? buildRateCardEmail(body) : buildContactEmail(body);

    // --- Send ---
    const transport = createTransport();
    await transport.sendMail({
      from: `"RoadReach Website" <${ZOHO_EMAIL}>`,
      replyTo: body.email,
      to: CONTACT_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Email sent: ${emailContent.subject}`);

    return res.status(200).json({ success: true, message: 'Your message has been received.' });
  } catch (err) {
    console.error('Failed to send email:', err.message, err.code, err.response);
    // Return a slightly more specific error for debugging (remove in production if desired)
    return res.status(500).json({ success: false, error: 'Failed to send message. SMTP error: ' + (err.code || err.message) });
  }
}
