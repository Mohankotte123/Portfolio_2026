import nodemailer from "nodemailer";
import type { LeadServiceType } from "@/constants/leadServiceTypes";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRequirementsHtml(req: Record<string, unknown>): string {
  try {
    const json = JSON.stringify(req, null, 2);
    return `<pre style="margin:0;font-family:ui-monospace,monospace;font-size:12px;line-height:1.5;color:#d4d4d8;white-space:pre-wrap;">${esc(json)}</pre>`;
  } catch {
    return `<p style="color:#a1a1aa;">${esc(String(req))}</p>`;
  }
}

export function buildLeadEmailHtml(params: {
  name: string;
  email: string;
  organization: string;
  serviceType: LeadServiceType;
  requirements: Record<string, unknown>;
  message: string;
}): string {
  const { name, email, organization, serviceType, requirements, message } = params;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:24px;background:#020202;font-family:Georgia,serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;border:1px solid #c9a43a;border-radius:12px;background:#050505;overflow:hidden;">
    <tr>
      <td style="padding:28px 28px 8px 28px;">
        <p style="margin:0;font-family:'Syne',sans-serif;font-size:11px;letter-spacing:0.35em;color:#a78bfa;text-transform:uppercase;">Private Lead Intake</p>
        <h1 style="margin:12px 0 0 0;font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#f5f0e6;letter-spacing:0.02em;">New inquiry</h1>
        <p style="margin:8px 0 0 0;font-size:13px;color:#9ca3af;">Service: <strong style="color:#e9ddff;">${esc(serviceType)}</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px;">
        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(201,164,58,0.55),transparent);"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 8px 28px;">
        <h2 style="margin:0 0 12px 0;font-family:'Syne',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.12em;color:#d4af37;text-transform:uppercase;">Client profile</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;color:#e4e4e7;">
          <tr><td style="padding:6px 0;color:#a1a1aa;width:120px;">Name</td><td style="padding:6px 0;">${esc(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#a1a1aa;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#c4b5fd;">${esc(email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#a1a1aa;">Organization</td><td style="padding:6px 0;">${esc(organization)}</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 8px 28px;">
        <h2 style="margin:0 0 12px 0;font-family:'Syne',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.12em;color:#d4af37;text-transform:uppercase;">Technical requirements</h2>
        <div style="padding:14px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);">
          ${formatRequirementsHtml(requirements)}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 28px 28px;">
        <h2 style="margin:0 0 8px 0;font-family:'Syne',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.12em;color:#d4af37;text-transform:uppercase;">Message</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#d4d4d8;">${message.trim() ? esc(message) : "<em style='color:#71717a;'>No additional message provided.</em>"}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendLeadNotificationEmail(params: {
  name: string;
  email: string;
  organization: string;
  serviceType: LeadServiceType;
  requirements: Record<string, unknown>;
  message: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  const to = process.env.LEAD_NOTIFY_EMAIL ?? "Mohankrish.kotte@gmail.com";

  if (!user || !pass || !from) {
    console.warn("[sendLeadEmail] SMTP_USER / SMTP_PASS / SMTP_FROM not set — skipping email send.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `[URGENT] New ${params.serviceType} Inquiry from ${params.name}`;
  const html = buildLeadEmailHtml(params);

  const info = await transporter.sendMail({
    from: `"Portfolio Vault" <${from}>`,
    to,
    replyTo: params.email,
    subject,
    html,
  });

  console.log("[sendLeadEmail] Message sent:", info.messageId);
}
