const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { contactLimiter, adminEmailLimiter } = require("../middleware/rateLimit");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ALLOWED_SENDERS = [
  "support@apexcourrier.com",
  "noreply@apexcourrier.com",
];

const CONTACT_SENDER =
  process.env.CONTACT_SENDER || "noreply@apexcourrier.com";

const CONTACT_INBOX =
  process.env.CONTACT_INBOX || "support@apexcourrier.com";

// ------------------------------------------------------------
// Public contact form
// ------------------------------------------------------------
// This endpoint intentionally does NOT expose arbitrary Resend
// functionality. It only accepts website contact messages and
// sends them to the configured company inbox.
// ------------------------------------------------------------

router.post("/contact", contactLimiter, async (req, res) => {
  if (!resend) {
    return res.status(503).json({
      message: "Email service is not configured.",
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid contact form data.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanSubject ||
      !cleanMessage
    ) {
      return res.status(400).json({
        message: "Name, email, subject and message are required.",
      });
    }

    if (
      cleanName.length > 120 ||
      cleanEmail.length > 254 ||
      cleanSubject.length > 200 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields are too long.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const body = [
      "New enquiry from the ApexCourrier website",
      "",
      `Name: ${cleanName}`,
      `Email: ${cleanEmail}`,
      `Subject: ${cleanSubject}`,
      "",
      "Message:",
      cleanMessage,
    ].join("\n");

    const response = await resend.emails.send({
      from: CONTACT_SENDER,
      to: CONTACT_INBOX,
      replyTo: cleanEmail,
      subject: `Website enquiry: ${cleanSubject}`,
      text: body,
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
      id: response?.data?.id || null,
    });
  } catch (error) {
    console.error("Public contact email error:", error);

    return res.status(500).json({
      message: "Unable to send your message right now.",
    });
  }
});

// ------------------------------------------------------------
// Protected admin email dispatch
// ------------------------------------------------------------

router.post(
  "/send",
  requireAuth,
  requireAdmin,
  adminEmailLimiter,
  async (req, res) => {
    if (!resend) {
      return res.status(503).json({
        message: "Email service is not configured.",
      });
    }

    try {
      const {
        from,
        recipients,
        subject,
        html,
        text,
        attachments,
      } = req.body;

      if (!from || !ALLOWED_SENDERS.includes(from)) {
        return res.status(400).json({
          message: "Invalid sender address.",
        });
      }

      if (
        !Array.isArray(recipients) ||
        recipients.length === 0 ||
        recipients.length > 100
      ) {
        return res.status(400).json({
          message: "Recipients must contain between 1 and 100 addresses.",
        });
      }

      if (
        typeof subject !== "string" ||
        !subject.trim() ||
        subject.length > 200
      ) {
        return res.status(400).json({
          message: "A valid email subject is required.",
        });
      }

      if (
        (!html || typeof html !== "string") &&
        (!text || typeof text !== "string")
      ) {
        return res.status(400).json({
          message: "Email content is required.",
        });
      }

      const cleanRecipients = recipients
        .filter((email) => typeof email === "string")
        .map((email) => email.trim().toLowerCase())
        .filter((email) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );

      if (cleanRecipients.length === 0) {
        return res.status(400).json({
          message: "No valid recipient email addresses provided.",
        });
      }

      let formattedAttachments;

      if (attachments !== undefined) {
        if (!Array.isArray(attachments) || attachments.length > 5) {
          return res.status(400).json({
            message: "A maximum of 5 attachments is allowed.",
          });
        }

        formattedAttachments = attachments
          .filter(
            (att) =>
              att &&
              typeof att.filename === "string" &&
              typeof att.content === "string"
          )
          .map((att) => {
            const base64Data = att.content.includes(";base64,")
              ? att.content.split(";base64,").pop()
              : att.content;

            return {
              filename: att.filename.slice(0, 255),
              content: Buffer.from(base64Data, "base64"),
            };
          });
      }

      if (cleanRecipients.length > 30) {
        const batchPayload = cleanRecipients.map((recipient) => ({
          from,
          to: recipient,
          subject: subject.trim(),
          ...(html ? { html } : {}),
          ...(text ? { text } : {}),
          ...(formattedAttachments?.length
            ? { attachments: formattedAttachments }
            : {}),
        }));

        const response = await resend.batch.send(batchPayload);

        return res.status(200).json({
          success: true,
          method: "batch",
          recipientCount: cleanRecipients.length,
          message: "Email batch submitted successfully.",
          id: response?.data?.id || null,
        });
      }

      const response = await resend.emails.send({
        from,
        to: cleanRecipients.length === 1
          ? cleanRecipients[0]
          : cleanRecipients,
        subject: subject.trim(),
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
        ...(formattedAttachments?.length
          ? { attachments: formattedAttachments }
          : {}),
      });

      return res.status(200).json({
        success: true,
        method: "standard",
        recipientCount: cleanRecipients.length,
        message: "Email sent successfully.",
        id: response?.data?.id || null,
      });
    } catch (error) {
      console.error("Admin email dispatch error:", error);

      return res.status(500).json({
        message: "Unable to send the email right now.",
      });
    }
  }
);

module.exports = router;
