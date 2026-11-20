import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendPaymentSubmittedEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  amountBdt: number;
  transactionId: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #f1f1f1; border-radius: 12px; overflow: hidden; border: 1px solid #1f2430;">
      <div style="background: linear-gradient(135deg, #6d28d9, #4f46e5); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Payment Received for Verification</h1>
        <p style="margin: 8px 0 0; color: #e9d5ff; font-size: 14px;">Order #${escapeHtml(params.orderNumber)}</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #cbd5e1;">Hi <strong>${escapeHtml(params.customerName)}</strong>,</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Thank you! We have received your bKash payment submission. Our team is manually verifying the transaction details with our bKash statement.
        </p>
        <div style="background: #131722; border: 1px solid #2d3748; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Order Number:</td>
              <td style="color: #ffffff; font-weight: 600; text-align: right;">${escapeHtml(params.orderNumber)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Transaction ID (TrxID):</td>
              <td style="color: #a855f7; font-weight: 600; font-family: monospace; text-align: right;">${escapeHtml(params.transactionId)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Amount Submitted:</td>
              <td style="color: #10b981; font-weight: 600; text-align: right;">৳${params.amountBdt} BDT</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Current Status:</td>
              <td style="color: #f59e0b; font-weight: 600; text-align: right;">PENDING VERIFICATION</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          You will receive an email confirmation and immediate access to your downloadable files as soon as the payment is approved.
        </p>
      </div>
      <div style="background: #0d1117; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2430;">
        Nakibul Islam Web Store • Manual bKash Payment System
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Nakibul Islam Store" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: `[Pending Verification] bKash Payment for Order #${params.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send payment submitted email:", error);
  }
}

export async function sendAdminNewPaymentNotification(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amountBdt: number;
  transactionId: string;
}) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!transporter || !adminEmail) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #fff; padding: 24px; border-radius: 8px;">
      <h2 style="color: #a855f7; margin-top: 0;">New bKash Payment Submitted</h2>
      <p style="color: #cbd5e1;">A new manual bKash transaction requires your verification:</p>
      <ul style="color: #e2e8f0; line-height: 1.8;">
        <li><strong>Order:</strong> #${escapeHtml(params.orderNumber)}</li>
        <li><strong>Customer:</strong> ${escapeHtml(params.customerName)} (${escapeHtml(params.customerEmail)})</li>
        <li><strong>TrxID:</strong> <code style="background: #1e1b4b; padding: 2px 6px; border-radius: 4px; color: #c084fc;">${escapeHtml(params.transactionId)}</code></li>
        <li><strong>Amount:</strong> ৳${params.amountBdt} BDT</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/payments" style="display: inline-block; background: #6d28d9; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Open Verification Panel
        </a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Store Notifications" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Action Required: New bKash Payment - Order #${params.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send admin payment notification:", error);
  }
}

export async function sendPaymentApprovedEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  amountBdt: number;
  downloadUrl: string;
  items: { title: string }[];
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const itemsList = params.items.map((it) => `<li>${escapeHtml(it.title)}</li>`).join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #f1f1f1; border-radius: 12px; overflow: hidden; border: 1px solid #1f2430;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Payment Approved!</h1>
        <p style="margin: 8px 0 0; color: #d1fae5; font-size: 14px;">Your order #${escapeHtml(params.orderNumber)} is ready</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #cbd5e1;">Hi <strong>${escapeHtml(params.customerName)}</strong>,</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Your bKash payment has been verified and approved. Your purchased digital products are now ready for immediate download!
        </p>
        <div style="background: #131722; border: 1px solid #2d3748; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-weight: 600; color: #e2e8f0;">Purchased Products:</p>
          <ul style="margin: 0; padding-left: 20px; color: #94a3b8; line-height: 1.6;">
            ${itemsList}
          </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.downloadUrl}" style="display: inline-block; background: #824CEA; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(130, 76, 234, 0.4);">
            Access Purchased Products
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
          You can also visit your account anytime at <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/web-store/purchased" style="color: #a855f7;">Purchased Products Dashboard</a>.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Nakibul Islam Store" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: `[Approved] Order #${params.orderNumber} - Downloads Available`,
      html,
    });
  } catch (error) {
    console.error("Failed to send payment approved email:", error);
  }
}

export async function sendPaymentRejectedEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  rejectionReason?: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0c10; color: #f1f1f1; border-radius: 12px; overflow: hidden; border: 1px solid #1f2430;">
      <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Payment Verification Failed</h1>
        <p style="margin: 8px 0 0; color: #fecaca; font-size: 14px;">Order #${escapeHtml(params.orderNumber)}</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #cbd5e1;">Hi <strong>${escapeHtml(params.customerName)}</strong>,</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          We reviewed the bKash payment submission for order <strong>#${escapeHtml(params.orderNumber)}</strong>, but were unable to verify the transaction.
        </p>
        ${
          params.rejectionReason
            ? `<div style="background: #1f1418; border: 1px solid #581c24; border-radius: 8px; padding: 14px; margin: 16px 0; color: #fca5a5; font-size: 14px;">
                <strong>Reason:</strong> ${escapeHtml(params.rejectionReason)}
              </div>`
            : ""
        }
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          If you believe this was in error, please reply to this email or re-submit the payment with the correct Transaction ID (TrxID) and amount.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/web-store/orders/${encodeURIComponent(params.orderNumber)}" style="display: inline-block; background: #374151; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            View Order & Resubmit
          </a>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Nakibul Islam Store" <${process.env.SMTP_USER}>`,
      to: params.to,
      subject: `[Attention Required] Payment Rejected for Order #${params.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send payment rejected email:", error);
  }
}
