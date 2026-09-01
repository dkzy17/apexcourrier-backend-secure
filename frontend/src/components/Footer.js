"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer>
    {/* Main footer — dark */}
    <div className="bg-[#111] text-white">
      <div className="container-wide grid gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-2 lg:pr-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain brightness-0 invert"
            />
            <span className="font-display text-xl tracking-tight">
              <span className="font-extrabold">Apex</span>Courrier
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-neutral-400">
            Fast, secure and reliable delivery services across 50+ countries.
            Real-time tracking on every shipment.
          </p>
          <div className="mt-5 space-y-2 text-sm text-neutral-500">
            <a
              href="mailto:support@apexcourrier.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="size-3.5 shrink-0" strokeWidth={1.75} />
              support@apexcourrier.com
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
              5 Montague Close, London SE1 9BB
            </p>
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Company
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/testimonials" className="text-neutral-300 hover:text-white transition-colors">
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-neutral-300 hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Solutions
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">
                Express Delivery
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">
                International Shipping
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">
                Cargo &amp; Freight
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-neutral-300 hover:text-white transition-colors">
                Warehousing
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/tracking" className="text-neutral-300 hover:text-white transition-colors">
                Track Shipment
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-neutral-300 hover:text-white transition-colors">
                Get a Quote
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@apexcourrier.com"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="bg-black">
      <div className="container-wide flex flex-col items-center justify-between gap-2 py-4 text-xs text-neutral-600 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} ApexCourrier. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/#contact" className="hover:text-neutral-400 transition-colors">
            Privacy
          </Link>
          <Link href="/#contact" className="hover:text-neutral-400 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
