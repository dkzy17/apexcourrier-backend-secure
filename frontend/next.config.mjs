/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Partner logos (logo proxy)
      {
        protocol: "https",
        hostname: "logo.brandfetch.io",
        port: "",
        pathname: "/**",
      },
      // Partner logos (CDN — FedEx, DHL, UPS use cdn.brandfetch.io)
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
        port: "",
        pathname: "/**",
      },
      // Backend uploaded images — https (Render / custom domain in production)
      {
        protocol: "https",
        hostname: "veno-atlas-2.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Backend uploaded images — http (local dev: req.protocol is http when
      // BACKEND_URL is not set, so the returned packageImageUrl starts with http)
      {
        protocol: "http",
        hostname: "veno-atlas-2.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Custom domain alias — https
      {
        protocol: "https",
        hostname: "api.apexcourrier.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Custom domain alias — http (local dev fallback)
      {
        protocol: "http",
        hostname: "api.apexcourrier.com",
        port: "",
        pathname: "/uploads/**",
      },
      // Local dev backend on port 4000
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
