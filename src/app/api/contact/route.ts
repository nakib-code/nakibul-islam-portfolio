import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Prevent user input from being interpreted as HTML
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequest;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    // Required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and message are required.",
        },
        { status: 400 },
      );
    }

    // Basic length validation
    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        { status: 400 },
      );
    }

    if (email.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is too long.",
        },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is too long.",
        },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 },
      );
    }

    // Escape values before inserting them into HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    await transporter.sendMail({
      from: `"Nakibul.dev" <${process.env.EMAIL_SENDER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,

      subject: `New Portfolio Message — ${name}`,

      // Plain-text fallback
      text: `
New message from Nakibul.dev

Name: ${name}
Email: ${email}

Message:
${message}
      `,

      // HTML email
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>New Portfolio Message</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
    font-family: Arial, Helvetica, sans-serif;
    color: #18181b;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #f4f4f5;
      padding: 40px 16px;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 620px;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid #e4e4e7;
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                background-color: #0b1020;
                padding: 32px;
              "
            >

              <div
                style="
                  font-size: 12px;
                  color: #a1a1aa;
                  margin-bottom: 10px;
                  letter-spacing: 1.5px;
                  text-transform: uppercase;
                "
              >
                Portfolio Contact
              </div>

              <div
                style="
                  font-size: 28px;
                  font-weight: 700;
                  color: #ffffff;
                "
              >
                Nakibul<span style="color: #cc071e;">
                  .dev
                </span>
              </div>

              <div
                style="
                  margin-top: 10px;
                  font-size: 14px;
                  line-height: 22px;
                  color: #a1a1aa;
                "
              >
                You received a new message from your portfolio website.
              </div>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">

              <div
                style="
                  font-size: 21px;
                  font-weight: 700;
                  margin-bottom: 24px;
                  color: #18181b;
                "
              >
                New Portfolio Message
              </div>

              <!-- Name -->
              <div
                style="
                  background-color: #fafafa;
                  border: 1px solid #e4e4e7;
                  border-radius: 12px;
                  padding: 16px;
                  margin-bottom: 12px;
                "
              >

                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #71717a;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 7px;
                  "
                >
                  Name
                </div>

                <div
                  style="
                    font-size: 15px;
                    font-weight: 600;
                    color: #18181b;
                  "
                >
                  ${safeName}
                </div>

              </div>

              <!-- Email -->
              <div
                style="
                  background-color: #fafafa;
                  border: 1px solid #e4e4e7;
                  border-radius: 12px;
                  padding: 16px;
                  margin-bottom: 26px;
                "
              >

                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #71717a;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 7px;
                  "
                >
                  Email
                </div>

                <a
                  href="mailto:${safeEmail}"
                  style="
                    font-size: 15px;
                    color: #cc071e;
                    text-decoration: none;
                    word-break: break-word;
                  "
                >
                  ${safeEmail}
                </a>

              </div>

              <!-- Message -->
              <div>

                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #71717a;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 10px;
                  "
                >
                  Message
                </div>

                <div
                  style="
                    background-color: #f8f8f8;
                    border-left: 4px solid #cc071e;
                    border-radius: 10px;
                    padding: 18px;
                    font-size: 15px;
                    line-height: 25px;
                    color: #3f3f46;
                    white-space: pre-line;
                    word-break: break-word;
                  "
                >
                  ${safeMessage}
                </div>

              </div>

              <!-- Reply Button -->
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top: 26px;"
              >
                <tr>
                  <td
                    style="
                      border-radius: 10px;
                      background-color: #cc071e;
                    "
                  >

                    <a
                      href="mailto:${safeEmail}"
                      style="
                        display: inline-block;
                        padding: 13px 22px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #ffffff;
                        text-decoration: none;
                      "
                    >
                      Reply to ${safeName} →
                    </a>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                border-top: 1px solid #e4e4e7;
                padding: 22px 32px;
                background-color: #fafafa;
              "
            >

              <div
                style="
                  font-size: 12px;
                  line-height: 20px;
                  color: #71717a;
                  text-align: center;
                "
              >
                This message was sent from
                <strong style="color: #18181b;">
                  Nakibul.dev
                </strong>
                portfolio contact form.
              </div>

              <div
                style="
                  margin-top: 6px;
                  font-size: 11px;
                  color: #a1a1aa;
                  text-align: center;
                "
              >
                © 2026 Nakibul.dev
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}