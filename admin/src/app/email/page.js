"use client";
import { useState } from "react";
import Link from "next/link";
import PasswordProtection from "../components/PasswordProtection";
import ApiService from "../utils/api";
import {
  FaEnvelope,
  FaPaperPlane,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSpinner,
  FaInfoCircle,
  FaCode,
  FaEye,
  FaPaperclip,
  FaTrash,
  FaFileAlt,
  FaMagic,
} from "react-icons/fa";

export default function EmailPage() {
  const [from, setFrom] = useState("support@apexcourrier.com");
  const [recipientsInput, setRecipientsInput] = useState("");
  const [subject, setSubject] = useState("");
  const [editorMode, setEditorMode] = useState("text");
  const [textContent, setTextContent] = useState(
    `Hello,\n\nWe are reaching out to you from ApexCourrier Logistics regarding your shipment status and updates.\n\nThank you for choosing ApexCourrier!\n\nBest regards,\nApexCourrier Logistics Team`
  );
  const [htmlContent, setHtmlContent] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("https://apexcourrier.com/tracking");
  const [attachments, setAttachments] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Recipient analysis
  const recipientList = recipientsInput
    .split(/[\n,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  const recipientCount = recipientList.length;
  const isBatchMode = recipientCount > 30;

  const buildTemplate = ({ subjectPreview = "", trackingLink = "https://apexcourrier.com/tracking" } = {}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ApexCourrier</title>
</head>
<body style="margin:0;padding:0;background-color:#f0eeeb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:transparent;">${subjectPreview || "Update from ApexCourrier"}&#847;&#847;&#847;&#847;&#847;&#847;</div>
<div style="background-color:#f0eeeb;padding:40px 16px;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:460px;margin:0 auto;">
    <tr><td style="background:#ffffff;border-radius:12px;overflow:hidden;">

      <!-- BRAND BANNER -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ff7700;">
        <tr><td style="padding:22px 28px;">
          <img src="https://apexcourrier.com/logo.png" alt="" width="28" height="28" style="display:inline-block;vertical-align:middle;border:0;filter:brightness(0) invert(1);">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#ffffff;vertical-align:middle;padding-left:7px;letter-spacing:-.2px;"><b>Apex</b>Courrier</span>
        </td></tr>
      </table>

      <!-- MESSAGE -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding:36px 32px 0;">
          <p style="font-size:14px;color:#4a4a4a;line-height:1.65;margin:0;">Dear Customer,</p>
          <p style="font-size:14px;color:#4a4a4a;line-height:1.65;margin:14px 0 0;">We have an update regarding your shipment with ApexCourrier. Please use the button below to track your order in real time.</p>
        </td></tr>
      </table>

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding:28px 32px 36px;" align="center">
          <a href="${trackingLink}" style="display:block;background:#ff7700;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 24px;border-radius:12px;text-align:center;letter-spacing:.2px;">Track Order</a>
        </td></tr>
      </table>

      <!-- SIGN OFF -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #ebe8e4;"></div></td></tr>
        <tr><td style="padding:20px 32px 24px;">
          <p style="font-size:13px;color:#4a4a4a;line-height:1.5;margin:0;">Thank you,<br><span style="font-weight:600;color:#1a1a1a;">The ApexCourrier Team</span></p>
        </td></tr>
      </table>

    </td></tr>

    <!-- FOOTER -->
    <tr><td style="padding:28px 4px 0;text-align:center;">
      <p style="font-size:11px;color:#b0b0b0;line-height:1.7;margin:0;">ApexCourrier &middot; 5 Montague Close, London SE1 9BB</p>
      <p style="font-size:11px;color:#b0b0b0;margin:6px 0 0;">
        <a href="#" style="color:#b0b0b0;text-decoration:none;">Terms</a>
        <span style="padding:0 6px;">&middot;</span>
        <a href="#" style="color:#b0b0b0;text-decoration:none;">Privacy</a>
      </p>
    </td></tr>

  </table>
</div>
</body>
</html>`;
  };

  const handleUseTemplate = () => {
    setEditorMode("html");
    setIsPreview(false);
    setHtmlContent(buildTemplate({ subjectPreview: subject, trackingLink: trackingUrl }));
  };

  const handleFetchPackageEmails = async () => {
    try {
      setError(null);
      const packages = await ApiService.getPackages();
      const emails = new Set();
      packages.forEach((pkg) => {
        if (pkg.receiver?.email) emails.add(pkg.receiver.email);
        if (pkg.sender?.email) emails.add(pkg.sender.email);
      });
      const emailArray = Array.from(emails);
      if (emailArray.length === 0) {
        alert("No recipient emails found in packages.");
        return;
      }
      setRecipientsInput((prev) =>
        prev
          ? prev + (prev.endsWith("\n") ? "" : "\n") + emailArray.join("\n")
          : emailArray.join("\n")
      );
    } catch (err) {
      console.error("Failed to fetch customer emails:", err);
      setError("Failed to fetch emails from existing packages: " + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            filename: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            type: file.type,
            content: event.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    if (recipientList.length === 0) {
      setError("Please add at least one recipient email address.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter an email subject.");
      return;
    }

    const finalHtml = editorMode === "html" ? htmlContent : null;
    const finalText = editorMode === "text" ? textContent : null;

    if (editorMode === "html" && !htmlContent.trim()) {
      setError("Please enter email body content.");
      return;
    }
    if (editorMode === "text" && !textContent.trim()) {
      setError("Please enter email text message.");
      return;
    }

    setSending(true);

    try {
      const response = await ApiService.sendEmail({
        from,
        recipients: recipientList,
        subject,
        html: finalHtml,
        text: finalText,
        attachments: attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
        })),
      });

      setResult({
        success: true,
        method: response.method,
        recipientCount: response.recipientCount,
        message: `Successfully sent email to ${response.recipientCount} recipient(s) using ${
          response.method === "batch"
            ? "Resend Batch Send (>30 recipients)"
            : "Resend Standard Send (<=30 recipients)"
        }.`,
        details: response.response,
      });
    } catch (err) {
      console.error("Error sending email:", err);
      setError(err.message || "An error occurred while sending email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaEnvelope className="text-secondary" />
                Email Dispatch
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-secondary">
                Powered by Resend
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Sender Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender Address (From)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${
                          from === "noreply@apexcourrier.com"
                            ? "border-secondary bg-orange-50/50 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fromSender"
                          value="noreply@apexcourrier.com"
                          checked={from === "noreply@apexcourrier.com"}
                          onChange={(e) => setFrom(e.target.value)}
                          className="h-4 w-4 text-secondary focus:ring-secondary"
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-bold text-gray-900">
                            noreply@apexcourrier.com
                          </span>
                          <span className="block text-xs text-gray-500">
                            General announcements & info
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${
                          from === "support@apexcourrier.com"
                            ? "border-secondary bg-orange-50/50 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fromSender"
                          value="support@apexcourrier.com"
                          checked={from === "support@apexcourrier.com"}
                          onChange={(e) => setFrom(e.target.value)}
                          className="h-4 w-4 text-secondary focus:ring-secondary"
                        />
                        <div className="ml-3">
                          <span className="block text-sm font-bold text-gray-900">
                            support@apexcourrier.com
                          </span>
                          <span className="block text-xs text-gray-500">
                            Customer support & tracking
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Recipients Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Recipients (To)
                      </label>
                      <button
                        type="button"
                        onClick={handleFetchPackageEmails}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
                      >
                        <FaUsers /> Pull Customer Emails from Packages
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={recipientsInput}
                      onChange={(e) => setRecipientsInput(e.target.value)}
                      placeholder="Enter recipient email addresses (e.g. john@gmail.com, sarah@gmail.com or one per line)"
                      className="block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary focus:border-secondary font-mono"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Separate emails with commas or newlines</span>
                      <span className="font-semibold text-gray-700">
                        Total valid: {recipientCount}
                      </span>
                    </div>
                  </div>

                  {/* Mode Banner Indicator */}
                  <div
                    className={`p-3.5 rounded-lg border flex items-center justify-between ${
                      isBatchMode
                        ? "bg-purple-50 border-purple-200 text-purple-800"
                        : "bg-blue-50 border-blue-200 text-blue-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-lg flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold">
                          Sending Strategy:{" "}
                          {isBatchMode
                            ? "Resend Batch Send API"
                            : "Resend Standard Send API"}
                        </p>
                        <p className="opacity-90">
                          {isBatchMode
                            ? "Over 30 recipients (> 30). Sending via bulk batch process."
                            : "30 or fewer recipients (<= 30). Sending via normal email dispatch."}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        isBatchMode
                          ? "bg-purple-200 text-purple-900"
                          : "bg-blue-200 text-blue-900"
                      }`}
                    >
                      {isBatchMode ? "Batch Mode (>30)" : "Standard Mode (<=30)"}
                    </span>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Important Update Regarding Your Shipment"
                      className="block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>

                  {/* Tracking URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tracking URL{" "}
                      <span className="text-gray-400 font-normal">(used in template "Track Order" button)</span>
                    </label>
                    <input
                      type="text"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="https://apexcourrier.com/tracking"
                      className="block w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary focus:border-secondary"
                    />
                  </div>

                  {/* Editor Mode Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Content
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Use Template button */}
                        <button
                          type="button"
                          onClick={handleUseTemplate}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                        >
                          <FaMagic className="text-[10px]" />
                          Use Template
                        </button>
                        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorMode("text");
                              setIsPreview(false);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                              editorMode === "text"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Normal Text
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorMode("html")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                              editorMode === "html"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            HTML Code
                          </button>
                        </div>
                      </div>
                    </div>

                    {editorMode === "text" ? (
                      <div>
                        <textarea
                          rows={8}
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          placeholder="Type your message here naturally..."
                          className="block w-full border border-gray-300 rounded-lg p-3.5 text-sm leading-relaxed focus:ring-2 focus:ring-secondary focus:border-secondary"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Plain text email editor. Simple and easy to write.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-end mb-1">
                          <button
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded"
                          >
                            {isPreview ? (
                              <>
                                <FaCode /> Edit HTML Code
                              </>
                            ) : (
                              <>
                                <FaEye /> Preview HTML
                              </>
                            )}
                          </button>
                        </div>
                        {isPreview ? (
                          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white min-h-[200px] max-h-[500px] overflow-y-auto">
                            <iframe
                              srcDoc={htmlContent || "<p style='padding:16px;color:#aaa;font-style:italic'>No HTML content to preview</p>"}
                              title="Email preview"
                              className="w-full border-0"
                              style={{ height: "500px" }}
                            />
                          </div>
                        ) : (
                          <textarea
                            rows={8}
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            placeholder="Paste HTML or click 'Use Template' above to load the branded template..."
                            className="block w-full border border-gray-300 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-secondary focus:border-secondary"
                            required
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Attachments
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors">
                        <FaPaperclip className="text-gray-500" />
                        <span>Add File Attachment</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-500">
                        Images, PDFs, Documents (Max 10MB per file)
                      </span>
                    </div>

                    {attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FaFileAlt className="text-secondary flex-shrink-0" />
                              <span className="font-semibold text-gray-800 truncate">
                                {att.filename}
                              </span>
                              <span className="text-gray-400">({att.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove file"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-base disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <FaSpinner className="animate-spin text-lg" />
                          <span>Sending Emails via Resend...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>
                            Send Email ({recipientCount}{" "}
                            {recipientCount === 1 ? "recipient" : "recipients"})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Side Column / Result / Instructions */}
            <div className="space-y-6">
              {/* Feedback Alert Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm text-red-800">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Failed to Send Email</h4>
                      <p className="text-xs mt-1 leading-relaxed">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm text-green-800">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <h4 className="font-bold text-sm">Dispatch Successful</h4>
                      <p className="text-xs mt-1">{result.message}</p>
                      {result.details && (
                        <div className="mt-3 p-3 bg-white/80 rounded border border-green-200 font-mono text-[11px] overflow-x-auto max-h-48">
                          <pre>{JSON.stringify(result.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Template Preview Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100 space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  <FaMagic className="text-orange-500" />
                  Branded Email Template
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Click <strong>Use Template</strong> to load the ApexCourrier branded HTML email with your logo, orange banner, message body, and a Track Order button.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>① Fill in Subject + Tracking URL</li>
                  <li>② Click <strong>Use Template</strong></li>
                  <li>③ Switch to <strong>Preview HTML</strong> to review</li>
                  <li>④ Edit the message body in the HTML if needed</li>
                  <li>⑤ Hit <strong>Send</strong></li>
                </ul>
                <button
                  type="button"
                  onClick={handleUseTemplate}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <FaMagic />
                  Load Branded Template
                </button>
              </div>

              {/* Information Box */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-500" />
                  Sending Rules & Features
                </h3>
                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Normal Text Editor:</strong> Non-technical users can type clean, standard emails without touching any HTML code.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>File Attachments:</strong> Attach images, PDFs, or documents directly to your emails.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Allowed Senders:</strong>{" "}
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">
                        noreply@apexcourrier.com
                      </code>{" "}
                      or{" "}
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">
                        support@apexcourrier.com
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Automatic Batch Mode (&gt;30):</strong> Uses Resend batch endpoint automatically when recipient count exceeds 30.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PasswordProtection>
  );
}