// Defaults to the live Render backend so local dev and existing deployments
// keep working with no env configured. Set NEXT_PUBLIC_API_BASE_URL in Vercel
// to point a given environment somewhere else.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.apexcourrier.com/api";

/**
 * Contact-form addresses.
 *
 * IMPORTANT: backend/src/routes/email.js validates `from` against a hardcoded
 * ALLOWED_SENDERS list. Until that list includes the apexcourrier.com address
 * (and the domain is verified in Resend), /api/email/send will reject this
 * sender with a 400 and the contact form will surface its error state.
 *
 * NEXT_PUBLIC_CONTACT_SENDER exists so the sender can be pointed back at an
 * already-whitelisted address without a code change while that is sorted out.
 */
const CONTACT_SENDER =
  process.env.NEXT_PUBLIC_CONTACT_SENDER || "noreply@apexcourrier.com";
const CONTACT_INBOX =
  process.env.NEXT_PUBLIC_CONTACT_INBOX || "support@apexcourrier.com";

class ApiService {
  static async makeRequest(url, config = {}) {
    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
        });
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`API request successful:`, { url, data });
      return data;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.error("Network error - Server may be down:", {
          url,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("API request failed:", {
          url,
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
      }
      throw error;
    }
  }

  static async getPackageByTracking(trackingNumber) {
    try {
      const pkgs = await this.makeRequest(
        `${API_BASE_URL}/packages?trackingNumber=${encodeURIComponent(
          trackingNumber
        )}`
      );
      // Since trackingNumber is unique, return the first match (if any)
      return Array.isArray(pkgs) && pkgs.length > 0
        ? pkgs[0]
        : null;
    } catch (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
  }

  static async getAllPackages() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/packages`);
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  }

  /**
   * Sends a contact-form enquiry to the company inbox.
   *
   * The backend whitelists which addresses may appear in `from`, so this must
   * stay CONTACT_SENDER rather than the visitor's address. The visitor's email
   * is carried in the body instead, for the team to reply to.
   */
  static async sendContactEnquiry({ name, email, subject, message }) {
    const body = [
      `New enquiry from the ApexCourrier website`,
      ``,
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Subject: ${subject}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    return await this.makeRequest(`${API_BASE_URL}/email/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_SENDER,
        recipients: [CONTACT_INBOX],
        subject: `Website enquiry: ${subject}`,
        text: body,
      }),
    });
  }
}

export default ApiService;
