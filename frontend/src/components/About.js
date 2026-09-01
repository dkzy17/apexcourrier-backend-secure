"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const shipmentStats = [
  { value: "486", unit: " Km", label: "Travelled" },
  { value: "132", unit: " Km", label: "Remaining" },
  { value: "20º", unit: "C", label: "Temperature" },
];

const panels = [
  {
    title: "Real-Time Tracking",
    body: "Your single portal to follow every consignment from collection through to signature.",
    accent: true,
  },
  {
    title: "Modern Fleet and Equipment",
    items: [
      "Live location monitoring on every vehicle",
      "Customised logistics solutions for recurring lanes",
      "Secure, insured handling at every hand-off",
    ],
  },
  {
    title: "24/7 Customer Support",
    body: "Talk to a real person about any shipment, at any hour, in any timezone.",
  },
];

const Stripes = ({ className }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute bg-contain bg-no-repeat opacity-60 ${className}`}
    style={{ backgroundImage: "url('/figma/stripes.svg')" }}
  />
);

const About = () => (
  <section id="about" className="bg-white py-10 lg:py-16">
    <div className="container-wide flex flex-col items-center gap-10">
      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="max-w-[900px] font-display text-[26px] font-medium text-black sm:text-[30px] lg:text-[34px]">
          What is <span className="font-bold">ApexCourrier</span> Delivery and
          Logistics? What it can do for <span className="font-bold">my Business</span>?
        </h2>
        <p className="max-w-[1300px] text-[14px] leading-6 text-body">
          ApexCourrier is a delivery and logistics service built around
          visibility. Track every shipment in real time, see exactly where your
          freight is and when it will land, and reach a support team that knows
          your account — so you can reduce costs, tighten workflows and hit
          delivery commitments without chasing updates.
        </p>
      </motion.div>

      <div className="flex w-full flex-col items-stretch justify-center gap-6 lg:flex-row">
        {/* Shipment card */}
        <motion.div
          className="relative flex flex-1 items-center overflow-hidden rounded-[10px] bg-brand p-6 sm:p-10 lg:max-w-[536px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Stripes className="-left-12 -top-12 h-[327px] w-[236px] -rotate-[21.77deg]" />
          <Stripes className="-bottom-12 -right-12 h-[327px] w-[236px] -rotate-[21.77deg]" />

          <div className="relative flex w-full flex-col gap-7 overflow-hidden rounded-[19px] bg-white p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-[20px] font-extrabold text-black">
                  My Shipment
                </p>
                <Link
                  href="/tracking"
                  className="font-display text-[18px] font-medium text-brand hover:underline"
                >
                  See All
                </Link>
              </div>
              <span className="h-px w-full bg-line" />
            </div>

            <p className="font-display text-[28px] font-bold leading-none text-black sm:text-[32px]">
              Express Parcel
            </p>

            {shipmentStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <p className="font-display text-[28px] font-semibold leading-none tabular-nums text-black sm:text-[32px]">
                  <span className="font-bold">{stat.value}</span>
                  {stat.unit}
                </p>
                <p className="text-[16px] font-medium text-brand">{stat.label}</p>
              </div>
            ))}

            <div className="pointer-events-none absolute -right-10 bottom-6 hidden h-[300px] w-[240px] overflow-hidden rounded-l-[19px] sm:block">
              <Image
                src="/cargo.jpg"
                alt=""
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Feature panels */}
        <div className="flex flex-1 flex-col gap-7 lg:max-w-[698px]">
          {panels.map((panel, index) => (
            <motion.div
              key={panel.title}
              className={`relative flex flex-1 flex-col justify-center gap-[10px] overflow-hidden rounded-[10px] px-6 py-6 sm:px-10 ${
                panel.accent ? "bg-brand text-white" : "bg-light text-black"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {panel.accent && (
                <Stripes className="-top-16 right-0 h-[327px] w-[236px] -rotate-[21.77deg]" />
              )}

              <p
                className={`relative font-display text-[22px] sm:text-[24px] ${
                  panel.accent ? "font-bold" : "font-medium"
                }`}
              >
                {panel.title}
              </p>

              {panel.body && (
                <p className="relative text-[16px] font-medium">{panel.body}</p>
              )}

              {panel.items && (
                <ul className="relative flex flex-col gap-[10px] text-[16px] font-medium">
                  {panel.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
