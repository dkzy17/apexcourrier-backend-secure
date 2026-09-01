"use client";
import { useState, useEffect } from "react";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt, FaSpinner } from "react-icons/fa";
import ApiService from "../utils/api";

const SESSION_KEY = "admin_auth_token";

export default function PasswordProtection({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check session token with backend API
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(SESSION_KEY);
        if (token) {
          const res = await ApiService.verifyToken(token);
          if (res && res.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await ApiService.login(email, password);
      if (response && response.token) {
        localStorage.setItem(SESSION_KEY, response.token);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password. Access denied.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your admin credentials to access the portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="admin@apexcourrier.com"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Enter password"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 text-base shadow-md"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FaLock className="text-sm" />
                  <span>Log In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-semibold">
              ApexCourrier Admin Portal
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Encrypted Server Authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render children with logout option
  return (
    <div className="relative">
      {/* Logout button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
          title="Logout from admin panel"
        >
          <FaLock className="text-xs" />
          <span>Logout</span>
        </button>
      </div>

      {children}
    </div>
  );
}