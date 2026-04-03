import type { Request, Response } from "express";
import { Resend } from "resend";
import { validationResult } from "express-validator";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "support@urbankey.com";

export const sendContactEmail = async (req: Request, res: Response) => {
  // 1. Validate Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, subject, message, phone } = req.body;

  try {
    // 2. Send email to Admin
    const { data, error } = await resend.emails.send({
      from: `UrbanKey Contact <onboarding@resend.dev>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[UrbanKey Contact] ${subject} from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
              <p>UrbanKey Platform</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              ${
                phone
                  ? `<div class="field"><div class="label">Phone:</div><div class="value">${phone}</div></div>`
                  : ""
              }
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${message.replace(
                  /\n/g,
                  "<br>"
                )}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the UrbanKey contact form.</p>
              <p>Reply to this email to respond to ${name}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }

    // 3. Send auto-reply to user (optional)
    await resend.emails
      .send({
        from: `UrbanKey Support <onboarding@resend.dev>`,
        to: email,
        subject: "We've received your message!",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank you for contacting UrbanKey! 🏠</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to us. We have received your message and will get back to you within 24-48 hours.</p>
              <p>Here's a summary of your message:</p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>Subject:</strong> ${subject}<br/><br/>
                <strong>Message:</strong><br/>
                ${message.replace(/\n/g, "<br>")}
              </div>
              <p>In the meantime, you can:</p>
              <ul>
                <li>Browse properties on our <a href="${
                  process.env.FRONTEND_URL || "http://localhost:3001"
                }/properties/search">search page</a></li>
                <li>Check our <a href="${
                  process.env.FRONTEND_URL || "http://localhost:3001"
                }/faqs">FAQs</a> for quick answers</li>
                <li>Join our WhatsApp community for updates</li>
              </ul>
              <p>Best regards,<br/>UrbanKey Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} UrbanKey. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      })
      .catch((err) => console.error("Auto-reply failed:", err));

    res.status(200).json({
      success: true,
      message: "Email sent successfully! We'll get back to you soon.",
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
