/**
 * RoadReach — Rate Card PDF Generator
 *
 * Generates a professional rate card PDF on-the-fly using pdfkit.
 * Called by api/contact.js when an auto-reply with attachment is needed.
 */

import PDFDocument from 'pdfkit';

// Corporate colours
const RED = '#D9040E';
const DARK = '#1A1A1A';
const CHARCOAL = '#2C2C2C';
const WHITE = '#FFFFFF';
const GREY = '#f5f5f5';
const MID_GREY = '#888888';

/**
 * Build a Rate Card PDF as a Buffer.
 * @param {object} recipient - { name, company } for personalisation
 * @returns {Promise<Buffer>}
 */
export async function generateRateCardPDF(recipient = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: 'RoadReach Rate Card & Media Kit',
        Author: 'RoadReach Media',
        Subject: 'Mobile Billboard Advertising Rate Card',
      },
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // ── Helper: brand red divider line ──
    function divider(y) {
      doc
        .moveTo(50, y)
        .lineTo(545, y)
        .strokeColor(RED)
        .lineWidth(2)
        .stroke();
    }

    // ── Helper: filled bar ──
    function filledBar(y, color) {
      doc
        .rect(50, y, 495, 4)
        .fillColor(color)
        .fill();
    }

    // ═════════════════════ HEADER ═════════════════════
    // Top accent bar
    filledBar(40, RED);

    // Company name
    doc
      .font('Helvetica-Bold', 28)
      .fillColor(DARK)
      .text('RoadReach', 50, 65, { continued: false });

    doc
      .font('Helvetica', 12)
      .fillColor(MID_GREY)
      .text('South Africa\'s Premier Mobile Billboard Network', 50, 98);

    // Tagline red bar
    doc
      .rect(50, 122, 495, 28)
      .fillColor(RED);
    doc
      .font('Helvetica-Bold', 14)
      .fillColor(WHITE)
      .text('RATE CARD & MEDIA KIT', 50, 126, { width: 495, align: 'center' });

    // Personalised greeting
    if (recipient.name) {
      doc
        .font('Helvetica', 11)
        .fillColor(DARK)
        .text(`Prepared for: ${recipient.name}${recipient.company ? ` — ${recipient.company}` : ''}`, 50, 170);
    }

    // ═════════════════════ PACKAGES TABLE ═════════════════════
    const tableTop = 205;

    doc
      .font('Helvetica-Bold', 16)
      .fillColor(DARK)
      .text('Advertising Packages', 50, tableTop);

    divider(tableTop + 28);

    // Table header
    const col1 = 50;   // Package
    const col2 = 200;  // Coverage
    const col3 = 380;  // Price
    const col4 = 480;  // Note
    const rowH = 24;
    let y = tableTop + 42;

    // Header row
    doc
      .rect(50, y - 4, 495, rowH)
      .fillColor(CHARCOAL)
      .fill();

    doc
      .font('Helvetica-Bold', 9)
      .fillColor(WHITE);
    doc.text('PACKAGE', col1 + 8, y, { width: 140 });
    doc.text('COVERAGE', col2 + 8, y, { width: 170 });
    doc.text('PRICE / CAR / MO', col3 + 8, y, { width: 90 });
    doc.text('VOLUME DISCOUNTS', col4 + 8, y, { width: 70 });

    y += rowH;

    // Table rows
    const packages = [
      {
        name: 'LITE',
        coverage: 'Front door decals + rear window',
        price: 'From R2,125',
        discount: '10% off 20+',
      },
      {
        name: 'STANDARD ★',
        coverage: 'Half-car wrap (back doors forward)',
        price: 'From R4,675',
        discount: '15% off 20+',
      },
      {
        name: 'PREMIUM',
        coverage: 'Full vehicle wrap (entire car)',
        price: 'From R8,500',
        discount: '20% off 10+',
      },
    ];

    packages.forEach((pkg, i) => {
      const bg = i % 2 === 0 ? GREY : WHITE;
      doc
        .rect(50, y - 2, 495, rowH)
        .fillColor(bg)
        .fill();

      doc
        .font(pkg.name.includes('STANDARD') ? 'Helvetica-Bold' : 'Helvetica', 9)
        .fillColor(DARK);
      doc.text(pkg.name, col1 + 8, y, { width: 140 });

      doc
        .font('Helvetica', 9)
        .fillColor(DARK);
      doc.text(pkg.coverage, col2 + 8, y, { width: 170 });

      doc
        .font('Helvetica-Bold', 9)
        .fillColor(RED);
      doc.text(pkg.price, col3 + 6, y, { width: 90 });

      doc
        .font('Helvetica', 8)
        .fillColor(CHARCOAL);
      doc.text(pkg.discount, col4 + 4, y, { width: 70 });

      y += rowH;
    });

    // Table footer line
    divider(y);

    y += 18;

    // ═════════════════════ FLEET SECTION ═════════════════════
    doc
      .font('Helvetica-Bold', 16)
      .fillColor(DARK)
      .text('Our Fleet', 50, y);

    divider(y + 28);

    y += 42;

    const fleet = [
      { type: 'Small', vehicles: 'Hyundai i10, Kia Picanto, VW Up', use: 'Urban routes, tight spaces' },
      { type: 'Medium ★', vehicles: 'VW Polo, Ford Fiesta, Toyota Yaris', use: 'Versatile, all suburbs' },
      { type: 'Large', vehicles: 'Toyota Corolla, BMW 3 Series, Kia Optima', use: 'Bold, detailed branding' },
      { type: 'Extra Large', vehicles: 'SUVs, bakkies, delivery vans', use: 'Maximum surface area' },
    ];

    // Fleet mini-table header
    doc
      .rect(50, y - 4, 495, rowH)
      .fillColor(CHARCOAL)
      .fill();

    doc
      .font('Helvetica-Bold', 9)
      .fillColor(WHITE);
    doc.text('CATEGORY', col1 + 8, y, { width: 100 });
    doc.text('EXAMPLE VEHICLES', col1 + 120, y, { width: 200 });
    doc.text('BEST FOR', col1 + 340, y, { width: 150 });

    y += rowH;

    fleet.forEach((f, i) => {
      const bg = i % 2 === 0 ? GREY : WHITE;
      doc
        .rect(50, y - 2, 495, rowH)
        .fillColor(bg)
        .fill();

      doc
        .font(f.type.includes('★') ? 'Helvetica-Bold' : 'Helvetica', 9)
        .fillColor(DARK);
      doc.text(f.type, col1 + 8, y, { width: 100 });

      doc
        .font('Helvetica', 8)
        .fillColor(DARK);
      doc.text(f.vehicles, col1 + 120, y, { width: 200 });

      doc
        .font('Helvetica', 8)
        .fillColor(CHARCOAL);
      doc.text(f.use, col1 + 340, y, { width: 150 });

      y += rowH;
    });

    divider(y);

    y += 22;

    // ═════════════════════ WHY ROADREACH ═════════════════════
    doc
      .font('Helvetica-Bold', 14)
      .fillColor(DARK)
      .text('Why RoadReach?', 50, y);

    y += 22;

    const reasons = [
      '70% of campaign budget goes directly to drivers',
      'Professional installation & campaign management',
      'Real-time campaign analytics dashboard',
      'Volume-based pricing — the more vehicles, the better the value',
      'Nationwide reach across all major SA metros',
      'POPIA compliant with secure data handling',
    ];

    reasons.forEach((r) => {
      doc
        .font('Helvetica', 10)
        .fillColor(DARK)
        .text(`  •  ${r}`, 50, y, { width: 495 });
      y += 18;
    });

    y += 10;

    // ═════════════════════ CONTACT INFO ═════════════════════
    // Bottom footer bar
    filledBar(y, RED);
    y += 16;

    doc
      .font('Helvetica-Bold', 11)
      .fillColor(DARK)
      .text('Contact Us', 50, y);

    y += 18;

    doc
      .font('Helvetica', 10)
      .fillColor(CHARCOAL)
      .text('Email: info@roadreach.co.za', 50, y, { continued: true })
      .text('     WhatsApp: +27 81 298 7137', { continued: true })
      .text('     Web: www.roadreach.co.za', 50, y + 16);

    y += 44;

    doc
      .font('Helvetica', 8)
      .fillColor(MID_GREY)
      .text('© 2026 RoadReach Media. All rights reserved.', 50, y, { align: 'center', width: 495 });

    // ═════════════════════ FINALISE ═════════════════════
    doc.end();
  });
}

/**
 * Generate a minimal plain-text fallback for the auto-reply body
 * in case the PDF generation fails.
 */
export function buildAutoReplyText(recipientName) {
  return `
Hi ${recipientName || 'there'},

Thank you for your interest in RoadReach's mobile billboard advertising solutions!

We have received your enquiry and will be in touch within 24 hours with a personalised campaign proposal.

In the meantime, here's a quick overview:

PACKAGES (per car per month):
  • LITE — From R2,125 — Front door decals + rear window branding
  • STANDARD — From R4,675 — Half-car wrap (most popular)
  • PREMIUM — From R8,500 — Full vehicle wrap

Volume discounts available for fleets of 10+ vehicles.

FLEET CATEGORIES: Small, Medium, Large, Extra Large

CONTACT US:
  Email: info@roadreach.co.za
  WhatsApp: +27 81 298 7137
  Web: www.roadreach.co.za

We look forward to partnering with you!

Warm regards,
The RoadReach Team
  `;
}
