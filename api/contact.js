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
import { generateRateCardPDF, buildAutoReplyText } from './generate-rate-card.js';

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

    // ── 1. Send notification to RoadReach ──
    await transport.sendMail({
      from: `"RoadReach Website" <${ZOHO_EMAIL}>`,
      replyTo: body.email,
      to: CONTACT_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Notification sent: ${emailContent.subject}`);

    // ── 2. Send auto-reply to the submitter ──
    if (isRateCard) {
      // Rate card request → send PDF + Google Sheets link
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
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #D9040E; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">RoadReach</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">
                  South Africa's Premier Mobile Billboard Network
                </p>
              </div>

              <div style="padding: 32px 24px; background: #ffffff;">
                <h2 style="color: #1A1A1A; margin-top: 0;">Hi ${body.name || 'there'},</h2>

                <p style="color: #444; line-height: 1.6;">
                  Thank you for your interest in RoadReach's mobile billboard advertising solutions!
                </p>

                <p style="color: #444; line-height: 1.6;">
                  Attached to this email you'll find our complete
                  <strong style="color: #D9040E;">Rate Card &amp; Media Kit</strong>
                  with full package pricing, fleet information, and volume discounts.
                </p>

                <p style="color: #444; line-height: 1.6;">
                  You can also view the full interactive rate card here:<br/>
                  <a href="https://docs.google.com/spreadsheets/d/1YjVG0nhpl42n0k7sbnY1gKBscE25L9fztjma6piZAdI/edit?usp=sharing" 
                     style="background: #D9040E; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; display: inline-block; margin-top: 6px; font-weight: 600;">
                    📊 Open Rate Card in Google Sheets
                  </a>
                </p>

                <p style="color: #444; line-height: 1.6;">
                  One of our campaign specialists will follow up within
                  <strong>24 hours</strong> with a personalised proposal tailored to your needs.
                </p>

                <div style="background: #f9f9f9; border-left: 4px solid #D9040E; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #333; font-size: 14px;">
                    <strong>Quick questions?</strong><br/>
                    WhatsApp us directly: <a href="https://wa.me/27812987137" style="color: #D9040E;">+27 81 298 7137</a>
                  </p>
                </div>
              </div>

              <div style="background: #1A1A1A; padding: 20px 24px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
                  © 2026 RoadReach Media &bull; info@roadreach.co.za &bull; www.roadreach.co.za
                </p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: 'RoadReach-Rate-Card.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });

        console.log(`Rate card auto-reply sent to ${body.email}`);
      } catch (autoReplyErr) {
        console.error('Rate card auto-reply failed:', autoReplyErr.message);
        // Try plain-text fallback without attachment
        try {
          await transport.sendMail({
            from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
            replyTo: ZOHO_EMAIL,
            to: body.email,
            subject: 'Thank you for contacting RoadReach',
            text: buildAutoReplyText(body.name),
          });
          console.log(`Fallback auto-reply sent to ${body.email}`);
        } catch (fallbackErr) {
          console.error('Fallback auto-reply also failed:', fallbackErr.message);
        }
      }
    } else {
      // General contact form submission → send simple confirmation (no PDF)
      try {
        await transport.sendMail({
          from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
          replyTo: ZOHO_EMAIL,
          to: body.email,
          subject: 'Thank you for contacting RoadReach',
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #D9040E; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">RoadReach</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">
                  South Africa's Premier Mobile Billboard Network
                </p>
              </div>
              <div style="padding: 32px 24px; background: #ffffff;">
                <h2 style="color: #1A1A1A; margin-top: 0;">Hi ${body.name || 'there'},</h2>
                <p style="color: #444; line-height: 1.6;">
                  Thanks for reaching out! We've received your message and will get back to you within <strong>24 hours</strong>.
                </p>
                <p style="color: #444; line-height: 1.6;">
                  In the meantime, feel free to explore our
                  <a href="https://www.roadreach.co.za/packages.html" style="color: #D9040E;">packages</a>
                  or view our
                  <a href="https://www.roadreach.co.za/rate-card.html" style="color: #D9040E;">interactive rate card</a>.
                </p>
                <div style="background: #f9f9f9; border-left: 4px solid #D9040E; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #333; font-size: 14px;">
                    <strong>Urgent?</strong><br/>
                    WhatsApp us: <a href="https://wa.me/27812987137" style="color: #D9040E;">+27 81 298 7137</a>
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
        console.log(`Contact confirmation sent to ${body.email}`);
      } catch (confirmErr) {
        console.error('Contact confirmation failed:', confirmErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: isRateCard
        ? 'Your message has been received. Check your email for your Rate Card.'
        : 'Your message has been received. We\'ll be in touch within 24 hours.',
    });
  } catch (err) {
    console.error('Failed to send email:', err.message, err.code);
    return res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
}
