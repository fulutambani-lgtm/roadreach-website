/**
 * RoadReach — Meeting Response Handler (Vercel Serverless)
 *
 * Handles GET requests from admin action links in booking notification emails.
 * Accept or suggest-alternative responses are logged and a notification
 * email is sent to the user.
 *
 * URL params:
 *   id       — Meeting ID (unique hash from the booking)
 *   response — "accepted" or "needs-change"
 *   email    — The user's email address
 *   name     — The user's name
 */

import nodemailer from 'nodemailer';

const ZOHO_EMAIL    = process.env.ZOHO_EMAIL;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || ZOHO_EMAIL;

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

export default async function handler(req, res) {
  // Allow any origin for admin link clicks
  res.setHeader('Access-Control-Allow-Origin', '*');

  // ── POST: Admin submits an alternative time from the Suggest Alternative form ──
  if (req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const body = req.body || {};
      if (body.action === 'send-alternative') {
        const { email, name, newDate, newTime, message } = body;
        if (!email || !newDate || !newTime) {
          return res.status(400).json({ success: false, error: 'Email, date, and time are required' });
        }
        if (ZOHO_EMAIL && ZOHO_PASSWORD) {
          const transport = createTransport();
          await transport.sendMail({
            from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
            replyTo: CONTACT_EMAIL,
            to: email,
            subject: 'RoadReach — Alternative Meeting Time Proposed',
            html: `
              <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:#ffc107;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
                  <h1 style="color:#333;margin:0;font-size:24px;">🔄 Alternative Time Proposed</h1>
                </div>
                <div style="padding:32px 24px;">
                  <h2 style="color:#1A1A1A;margin-top:0;">Hi ${escapeHtml(name || 'there')},</h2>
                  <p style="color:#444;line-height:1.6;">
                    Thank you for your meeting request. Unfortunately your proposed time conflicts with our schedule, 
                    but we'd love to meet at this alternative time instead:
                  </p>
                  <div style="background:#f9f9f9;border-left:4px solid #ffc107;padding:16px;margin:24px 0;">
                    <p style="margin:4px 0;color:#333;"><strong>Proposed Alternative:</strong></p>
                    <p style="margin:4px 0;color:#555;"><strong>Date:</strong> ${escapeHtml(newDate)}</p>
                    <p style="margin:4px 0;color:#555;"><strong>Time:</strong> ${escapeHtml(newTime)} (SAST)</p>
                    ${message ? `<p style="margin:4px 0;color:#555;"><strong>Note:</strong> ${escapeHtml(message)}</p>` : ''}
                  </div>
                  <p style="color:#444;line-height:1.6;">
                    Does this work for you? Please reply to this email or WhatsApp us to confirm.
                  </p>
                  <div style="background:#f9f9f9;border-left:4px solid #D9040E;padding:16px;margin:24px 0;">
                    <p style="margin:0;color:#333;font-size:14px;">
                      <strong>WhatsApp:</strong> <a href="https://wa.me/27812987137" style="color:#D9040E;">+27 81 298 7137</a><br/>
                      <strong>Email:</strong> <a href="mailto:${ZOHO_EMAIL}" style="color:#D9040E;">${ZOHO_EMAIL}</a>
                    </p>
                  </div>
                </div>
                <div style="background:#1A1A1A;padding:20px 24px;border-radius:0 0 8px 8px;text-align:center;">
                  <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">
                    &copy; 2026 RoadReach Media &bull; www.roadreach.co.za
                  </p>
                </div>
              </div>
            `,
          });
          console.log(`Alternative time sent to ${email}`);
        }
        return res.json({ success: true, message: 'Alternative time sent to user.' });
      }
      return res.status(400).json({ success: false, error: 'Unknown action' });
    } catch (err) {
      console.error('POST meeting-response error:', err.message);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  // ── GET: Admin clicks Accept / Suggest Alternative link ──
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const { id, response, email, name } = req.query;

  if (!id || !response || !email) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h1 style="color:#D9040E;">Missing Parameters</h1>
        <p>The action link appears to be malformed.</p>
        <p><a href="mailto:${ZOHO_EMAIL}" style="color:#D9040E;">Contact support</a></p>
      </body></html>
    `);
  }

  try {
    if (response === 'accepted') {
      // ——— ACCEPTED ———
      if (ZOHO_EMAIL && ZOHO_PASSWORD) {
        const transport = createTransport();
        await transport.sendMail({
          from: `"RoadReach Media" <${ZOHO_EMAIL}>`,
          replyTo: CONTACT_EMAIL,
          to: email,
          subject: 'Your Meeting is Confirmed — RoadReach',
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#28a745;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
                <h1 style="color:#fff;margin:0;font-size:24px;">✅ Meeting Confirmed</h1>
              </div>
              <div style="padding:32px 24px;">
                <h2 style="color:#1A1A1A;margin-top:0;">Hi ${name || 'there'},</h2>
                <p style="color:#444;line-height:1.6;">
                  Great news! Your meeting request has been <strong style="color:#28a745;">accepted</strong>.
                  We look forward to speaking with you at the proposed time.
                </p>
                <p style="color:#444;line-height:1.6;">
                  We'll send you a calendar invitation and link shortly.
                  If you don't receive it within 2 hours, please WhatsApp us.
                </p>
                <div style="background:#f9f9f9;border-left:4px solid #28a745;padding:16px;margin:24px 0;">
                  <p style="margin:0;color:#333;font-size:14px;">
                    <strong>Need to reschedule?</strong><br/>
                    WhatsApp: <a href="https://wa.me/27812987137" style="color:#D9040E;">+27 81 298 7137</a>
                  </p>
                </div>
              </div>
              <div style="background:#1A1A1A;padding:20px 24px;border-radius:0 0 8px 8px;text-align:center;">
                <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">
                  &copy; 2026 RoadReach Media &bull; www.roadreach.co.za
                </p>
              </div>
            </div>
          `,
        });
      }

      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Meeting Accepted — RoadReach</title>
        <style>
          body { font-family:'Segoe UI',Arial,sans-serif;padding:40px 20px;text-align:center;background:#f5f5f5; }
          .card { background:#fff;border-radius:12px;padding:40px;max-width:500px;margin:0 auto;box-shadow:0 4px 20px rgba(0,0,0,0.08); }
          h1 { color:#28a745;margin-bottom:8px; }
          p { color:#555;line-height:1.6;margin-bottom:20px; }
          .btn { display:inline-block;background:#D9040E;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600; }
        </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Meeting Accepted</h1>
            <p>The meeting has been accepted. The user has been notified via email.</p>
            <p><a href="mailto:${email}" style="color:#D9040E;">Reply to ${name || email}</a> to send a calendar invitation.</p>
            <a href="https://www.roadreach.co.za/" class="btn">Back to RoadReach</a>
          </div>
        </body>
        </html>
      `);
    }

    if (response === 'needs-change') {
      // ——— SUGGEST ALTERNATIVE ———
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Suggest Alternative — RoadReach</title>
        <style>
          body { font-family:'Segoe UI',Arial,sans-serif;padding:40px 20px;background:#f5f5f5; }
          .card { background:#fff;border-radius:12px;padding:40px;max-width:500px;margin:0 auto;box-shadow:0 4px 20px rgba(0,0,0,0.08); }
          h1 { color:#D9040E;margin-bottom:8px; }
          p { color:#555;line-height:1.6;margin-bottom:16px; }
          label { display:block;font-weight:600;color:#333;margin-bottom:4px;margin-top:16px; }
          input,select,textarea { width:100%;padding:10px 12px;border:2px solid #ddd;border-radius:6px;font-size:0.95rem;font-family:inherit;box-sizing:border-box; }
          button { background:#D9040E;color:#fff;border:none;padding:12px 24px;border-radius:6px;font-size:1rem;font-weight:600;cursor:pointer;margin-top:16px; }
          button:hover { background:#b5040b; }
          .msg { display:none;margin-top:16px;padding:16px;background:#d4edda;border-radius:6px;color:#155724; }
        </style>
        </head>
        <body>
          <div class="card">
            <h1>🔄 Suggest an Alternative</h1>
            <p>Propose a new date and time for <strong>${name || 'the requester'}</strong> (${email}).</p>
            <form id="altForm">
              <label for="alt-date">New Date</label>
              <input type="date" id="alt-date" required />
              <label for="alt-time">New Time</label>
              <input type="time" id="alt-time" required />
              <label for="alt-message">Message (optional)</label>
              <textarea id="alt-message" rows="3" placeholder="Explain the change..."></textarea>
              <button type="submit">📨 Send Alternative to User</button>
            </form>
            <div id="successMsg" class="msg"></div>
          </div>
          <script>
            document.getElementById('altForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              const date = document.getElementById('alt-date').value;
              const time = document.getElementById('alt-time').value;
              const msg = document.getElementById('alt-message').value;
              const btn = this.querySelector('button');
              btn.disabled = true; btn.textContent = 'Sending...';
              try {
                const res = await fetch('/api/meeting-response', {
                  method: 'POST',
                  headers: {'Content-Type':'application/json'},
                  body: JSON.stringify({
                    action: 'send-alternative',
                    meetingId: '${id}',
                    email: '${email}',
                    name: '${name || ''}',
                    newDate: date,
                    newTime: time,
                    message: msg,
                  })
                });
                const data = await res.json();
                if (data.success) {
                  document.getElementById('successMsg').style.display = 'block';
                  document.getElementById('successMsg').textContent = '✅ Alternative sent to ' + '${email}';
                  this.style.display = 'none';
                } else {
                  alert('Failed to send: ' + (data.error || 'Unknown error'));
                  btn.disabled = false; btn.textContent = '📨 Send Alternative to User';
                }
              } catch(err) {
                alert('Network error. Please try again.');
                btn.disabled = false; btn.textContent = '📨 Send Alternative to User';
              }
            });
          </script>
        </body>
        </html>
      `);
    }

    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h1 style="color:#D9040E;">Invalid Response</h1>
        <p>The response type "${response}" is not recognised.</p>
      </body></html>
    `);
  } catch (err) {
    console.error('Meeting response handler error:', err.message);
    return res.status(500).send('<h1>Internal Server Error</h1><p>Please try again or email us directly.</p>');
  }
}
