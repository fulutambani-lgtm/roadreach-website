/**
 * RoadReach — Rate Card Download API (Vercel Serverless)
 *
 * Handles POST from the rate-card.html download form.
 * 1. Sends notification email to admin
 * 2. Sends auto-reply to user with Rate Card PDF
 * 3. Logs to Google Sheet via webhook (if SHEETS_WEBHOOK_URL is configured)
 *
 * Environment variables:
 *   ZOHO_EMAIL         — ZohoMail account
 *   ZOHO_PASSWORD      — ZohoMail app password
 *   CONTACT_EMAIL      — Where submissions are forwarded
 *   SHEETS_WEBHOOK_URL — Optional Google Apps Script webhook for sheet logging
 */

import nodemailer from 'nodemailer';
import { generateRateCardPDF, buildAutoReplyText } from './generate-rate-card.js';

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
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildAdminEmail(body) {
  const { name, company, email, phone, interest, 'fleet-size': fleetSize } = body;
  return {
    subject: `[RoadReach Rate Card] ${name} — ${company || 'No company'}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#D9040E;">📄 Rate Card Request</h2>
        <hr style="border:none;border-top:2px solid #D9040E;" />
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px 0;font-weight:600;color:#333;width:130px;">Name</td>
              <td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Company</td>
              <td style="padding:8px 0;">${escapeHtml(company || '—')}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Phone</td>
              <td style="padding:8px 0;">${escapeHtml(phone || '—')}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Interest</td>
              <td style="padding:8px 0;">${escapeHtml(interest || '—')}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#333;">Fleet Size</td>
              <td style="padding:8px 0;">${escapeHtml(fleetSize || '—')}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#888;font-size:0.85rem;">
          Downloaded from <strong>roadreach.co.za/rate-card</strong>
        </p>
      </div>
    `,
  };
}

function buildAutoReplyHtml(name) {
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
          Thank you for your interest in RoadReach! Attached is your Rate Card & Media Kit.
        </p>
        <p style="color:#444;line-height:1.6;">
          One of our campaign specialists will follow up within <strong>24 hours</strong>
          with a personalised proposal tailored to your needs.
        </p>
        <div style="background:#f9f9f9;border-left:4px solid #D9040E;padding:16px;margin:24px 0;">
          <p style="margin:0;color:#333;font-size:14px;">
            <strong>Quick questions?</strong><br/>
            WhatsApp us: <a href="https://wa.me/27812987137" style="color:#D9040E;">+27 81 298 7137</a>
          </p>
        </div>
        <p style="text-align:center;margin-top:24px;">
          <a href="https://www.roadreach.co.za/rate-card"
             style="background:#D9040E;color:#fff;text-decoration:none;padding:10px 24px;border-radius:6px;display:inline-block;font-weight:600;">
            📊 View Interactive Rate Card
          </a>
        </p>
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
      type: 'rate-card',
      timestamp: new Date().toISOString(),
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone || '',
      interest: data.interest || '',
      fleetSize: data['fleet-size'] || '',
      source: 'rate-card',
    };
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Sheet log sent for rate-card:', data.email);
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

    if (!body.name || !body.email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const transport = createTransport();

    // 1. Send notification to admin
    const adminEmail = buildAdminEmail(body);
    await transport.sendMail({
      from: `"RoadReach Website" <${ZOHO_EMAIL}>`,
      replyTo: body.email,
      to: CONTACT_EMAIL,
      subject: adminEmail.subject,
      html: adminEmail.html,
    });
    console.log(`Rate-card admin notification sent: ${adminEmail.subject}`);

    // 2. Send auto-reply with PDF to user
    try {
      const pdfBuffer = await generateRateCardPDF({
        name: body.name,
        company: body.company,
      });
      await transport.sendMail({
        from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
        replyTo: ZOHO_EMAIL,
        to: body.email,
        subject: 'Your RoadReach Rate Card & Media Kit',
        html: buildAutoReplyHtml(body.name),
        attachments: [{
          filename: 'RoadReach-Rate-Card.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        }],
      });
      console.log(`Rate-card auto-reply sent to ${body.email}`);
    } catch (autoReplyErr) {
      console.error('Auto-reply failed:', autoReplyErr.message);
      try {
        await transport.sendMail({
          from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
          replyTo: ZOHO_EMAIL,
          to: body.email,
          subject: 'Thank you for contacting RoadReach',
          text: buildAutoReplyText(body.name),
        });
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr.message);
      }
    }

    // 3. Log to Google Sheet (fire-and-forget)
    logToSheet(body);

    return res.status(200).json({
      success: true,
      message: 'Your Rate Card is on its way! Check your email.',
    });
  } catch (err) {
    console.error('Failed to send rate card email:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to send. Please try again later.' });
  }
}
