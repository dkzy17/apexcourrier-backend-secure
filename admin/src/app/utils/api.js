const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.apexcourrier.com/api";

const SESSION_KEY = "admin_auth_token";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const isLoginRequest = endpoint === "/auth/login";

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(SESSION_KEY)
        : null;

    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };

    // Add the admin JWT automatically to authenticated requests.
    if (!isLoginRequest && token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (
      !isFormData &&
      config.body &&
      typeof config.body === "object"
    ) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        // An expired/invalid admin session should be removed locally.
        if (
          response.status === 401 &&
          typeof window !== "undefined" &&
          !isLoginRequest
        ) {
          localStorage.removeItem(SESSION_KEY);
        }

        let errMsg =
          `HTTP error! status: ${response.status} - ${response.statusText}`;

        if (data?.errors && Array.isArray(data.errors)) {
          errMsg = data.errors
            .map(
              (err) =>
                `${err.path || err.param || "Field"}: ${
                  err.msg || "Invalid value"
                }`
            )
            .join("\n");
        } else if (data?.message) {
          errMsg = data.message;
        }

        const error = new Error(errMsg);
        error.status = response.status;
        error.details = data;

        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------------------------
  // Package endpoints
  // ----------------------------------------------------------

  async getPackages() {
    return this.request("/packages");
  }

  async getPackage(id) {
    return this.request(`/packages/${id}`);
  }

  buildPackageForm(packageData, imageFile) {
    const form = new FormData();

    Object.entries(packageData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      form.append(
        key,
        typeof value === "object"
          ? JSON.stringify(value)
          : String(value)
      );
    });

    if (imageFile) {
      form.append("packageImage", imageFile);
    }

    return form;
  }

  async createPackage(packageData, imageFile) {
    return this.request("/packages", {
      method: "POST",
      body: imageFile
        ? this.buildPackageForm(packageData, imageFile)
        : packageData,
    });
  }

  async updatePackage(id, packageData, imageFile) {
    return this.request(`/packages/${id}`, {
      method: "PUT",
      body: imageFile
        ? this.buildPackageForm(packageData, imageFile)
        : packageData,
    });
  }

  async deletePackage(id) {
    return this.request(`/packages/${id}`, {
      method: "DELETE",
    });
  }

  async addTrackingEvent(id, eventData) {
    return this.request(`/packages/${id}/events`, {
      method: "POST",
      body: eventData,
    });
  }

  async getPackageByTracking(trackingNumber) {
    const pkgs = await this.request(
      `/packages?trackingNumber=${encodeURIComponent(trackingNumber)}`
    );

    return Array.isArray(pkgs) && pkgs.length > 0
      ? pkgs[0]
      : null;
  }

  // ----------------------------------------------------------
  // Admin email
  // ----------------------------------------------------------

  async sendEmail(emailPayload) {
    return this.request("/email/send", {
      method: "POST",
      body: emailPayload,
    });
  }

  // ----------------------------------------------------------
  // Authentication
  // ----------------------------------------------------------

  async login(email, password) {
    // Login intentionally does not use an existing token.
    return this.request("/auth/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    });
  }

  async verifyToken(token) {
    if (!token) {
      throw new Error("No authentication token provided");
    }

    return this.request("/auth/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();
