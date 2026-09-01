import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import FloatingTranslate from "@/components/FloatingTranslate";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

/**
 * Canonical origin for metadata, OG tags and sitemaps.
 *
 * Set NEXT_PUBLIC_SITE_URL in the Vercel project to the real domain. Preview
 * deployments fall back to their own generated URL so OG tags point at the
 * deployment being previewed rather than production. The final fallback keeps
 * local builds working with no env configured.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "https://apexcourrier.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "ApexCourrier - Reliable Delivery Services",
  description:
    "Your trusted partner for fast, secure, and reliable delivery services.",
  keywords: [
    "delivery services",
    "courier",
    "shipping",
    "logistics",
    "fast delivery",
    "reliable delivery",
    "package delivery",
    "express delivery",
    "same day delivery",
    "apexcourrier",
  ],
  authors: [{ name: "ApexCourrier" }],
  creator: "ApexCourrier",
  publisher: "ApexCourrier",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons are intentionally NOT declared here. Next's App Router file
  // convention picks up app/favicon.ico, app/icon.png and app/apple-icon.png
  // automatically and emits correctly-sized <link> tags with cache-busting
  // hashes. The previous manual block pointed every size at the 1.3 MB
  // public/logo.png, so browsers downloaded a 1024x1024 image to draw a 16px
  // favicon.
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ApexCourrier - Reliable Delivery Services",
    description:
      "Your trusted partner for fast, secure, and reliable delivery services.",
    url: siteUrl,
    siteName: "ApexCourrier",
    images: [
      {
        url: "/logo-smartsupp.png",
        width: 1024,
        height: 1024,
        alt: "ApexCourrier Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexCourrier - Reliable Delivery Services",
    description:
      "Your trusted partner for fast, secure, and reliable delivery services.",
    creator: "@apexcourrier",
    site: "@apexcourrier",
    images: {
      url: "/logo-smartsupp.png",
      alt: "ApexCourrier Logo",
      width: 1024,
      height: 1024,
    },
  },
  // Only emitted when a real token is configured — the previous placeholder
  // strings shipped bogus verification meta tags on every page.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  alternates: {
    canonical: siteUrl,
  },
  category: "business",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${manrope.variable}`}
    >
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      var _smartsupp = _smartsupp || {};
      _smartsupp.key = '1392dba928fbbd0b9aa8812278e8a41313ed1488';
      window.smartsupp||(function(d) {
        var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
        c.type='text/javascript';c.charset='utf-8';c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
      })(document);
    `,
          }}
        />
        <noscript>
          Powered by{" "}
          <a href="https://www.smartsupp.com" target="_blank">
            Smartsupp
          </a>
        </noscript>
      </head>
      <body className="font-sans text-body antialiased">
        {children}
        <FloatingTranslate />
      </body>
    </html>
  );
}