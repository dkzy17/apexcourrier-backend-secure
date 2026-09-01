import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Inter({
  subsets: ["latin"],
  display: "auto",
  weight: "400",
});
export const metadata = {
  title: "ApexCourrier Admin - Dashboard",
  description:
    "Admin dashboard for managing packages, tracking, and delivery operations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: "#F4D06F",
            secondary: "#FF8811", 
            almond: "#FFF8E7",
            "almond-light": "#FFFCF0",
            "almond-dark": "#F0E68C",
            dark: "#8B4513",
            light: "#FFFFFF"
          },
          fontFamily: {
            sans: ["var(--font-geist-sans)"],
            mono: ["var(--font-geist-mono)"]
          }
        }
      }
    }
  `,
          }}
        />
      </head>
      <body className={`${lato.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}

