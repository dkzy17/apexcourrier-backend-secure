"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Globe } from "lucide-react";
import { Chevron } from "@/components/ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/testimonials", label: "Success Stories" },
  { href: "/#tracking", label: "Track Package" },
  { href: "/#contact", label: "Contact" },
];

const utilityLinks = [
  { href: "mailto:support@apexcourrier.com", label: "support@apexcourrier.com" },
  { href: "/#tracking", label: "Track a shipment" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    window.open(`/tracking?number=${encodeURIComponent(trackingNumber)}`, "_blank");
  };

  return (
    // Deliberately not a motion element: site chrome must be visible without
    // JS. An entry animation here ships `opacity:0` in the SSR HTML, so a slow
    // or failed hydration leaves the whole header invisible.
    <header
      className={`fixed z-50 w-full border-b border-[rgba(51,51,51,0.2)] bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container-wide">
        {/* Utility bar */}
        <div className="hidden items-center justify-end gap-px py-[10px] lg:flex">
          {utilityLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="border-r-[0.8px] border-black px-[14px] text-[11px] font-medium leading-4 text-black transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <span className="flex items-center gap-[10px] px-[14px] text-[11px] font-medium leading-4 text-black">
            <Globe className="size-[15px] text-black" strokeWidth={1.75} aria-hidden="true" />
            UK - English
          </span>
        </div>

        {/* Main row */}
        <div className="flex items-center justify-between py-3 lg:py-0 lg:pb-[10px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ApexCourrier"
              width={44}
              height={44}
              className="size-11 object-contain"
              priority
            />
            <span className="font-display text-[20px] leading-8 text-dark">
              <span className="font-extrabold">Apex</span>Courrier
            </span>
          </Link>

          <div className="hidden items-center lg:flex">
            <nav className="flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-[17px] text-[12px] font-semibold leading-[21px] text-body transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-2 flex items-center gap-2">
              <form
                onSubmit={handleTrack}
                className="flex h-[34px] w-[184px] items-center border border-line"
              >
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number"
                  aria-label="Tracking number"
                  className="h-full min-w-0 flex-1 px-2 text-[12px] text-body placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  aria-label="Track package"
                  className="grid h-full w-[26px] place-items-center text-body transition-colors hover:text-brand"
                >
                  <Search className="size-[14px]" strokeWidth={1.75} />
                </button>
              </form>

              <Link
                href="#contact"
                className="group relative flex items-center gap-[14px] overflow-hidden bg-brand px-[15px] py-2 text-[14px] font-bold uppercase leading-[17px] text-white transition-colors hover:bg-brand-dark"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-[-19px] top-1/2 h-[45px] w-[7px] -translate-y-1/2 -rotate-12 bg-white/70 blur-[7px] animate-sheen [--sheen-travel:220px]"
                />
                Contact Us
                <Chevron />
              </Link>
            </div>
          </div>

          <motion.button
            className="text-2xl text-dark transition-colors hover:text-brand focus:outline-none lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X strokeWidth={1.75} /> : <Menu strokeWidth={1.75} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 top-full max-h-[80vh] w-full overflow-y-auto border-t border-line bg-white shadow-md lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-wide flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="border-b border-line py-3 text-[14px] font-semibold text-body transition-colors hover:text-brand"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contact"
                className="mt-4 flex items-center justify-center gap-[14px] bg-brand px-[15px] py-3 text-[14px] font-bold uppercase leading-[17px] text-white"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
                <Chevron />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
