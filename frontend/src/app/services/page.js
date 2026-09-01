"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActionLink, OutlineLink, SectionHeading } from "@/components/ui";

const services = [
  {
    id: "express-delivery",
    image: "/express.jpg",
    title: "Express Delivery",
    detailedDescription:
      "Our Express Delivery service is designed for time-sensitive shipments that require immediate attention. Whether you're sending important documents, medical supplies, or urgent business materials, our express service ensures your packages reach their destination quickly and safely.",
    benefits: [
      "Same-day delivery within city limits",
      "Next-day delivery for domestic shipments",
      "Real-time GPS tracking",
      "SMS and email notifications",
      "Signature confirmation",
      "Insurance coverage up to $5,000",
      "Priority handling at all facilities",
      "Dedicated customer support",
    ],
  },
  {
    id: "international-shipping",
    image: "/international.jpg",
    title: "International Shipping",
    detailedDescription:
      "Expand your business globally with our comprehensive international shipping solutions. We handle all aspects of cross-border logistics, from customs documentation to final delivery, ensuring your packages reach over 150 countries worldwide.",
    benefits: [
      "Delivery to 150+ countries",
      "Complete customs clearance",
      "Duty and tax calculation",
      "Multi-language support",
      "International tracking",
      "Prohibited items screening",
      "Documentation assistance",
      "Flexible delivery options",
    ],
  },
  {
    id: "cargo-services",
    image: "/cargo.jpg",
    title: "Cargo Services",
    detailedDescription:
      "Our Cargo Services cater to businesses requiring transportation of large, heavy, or specialized items. From industrial equipment to bulk shipments, we provide the expertise and equipment needed for safe and efficient cargo handling.",
    benefits: [
      "Heavy cargo up to 50 tons",
      "Specialized handling equipment",
      "Temperature-controlled transport",
      "Oversized cargo capability",
      "Loading and unloading services",
      "Route optimization",
      "Fleet tracking and management",
      "Dedicated project managers",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesPage = () => (
  <div className="min-h-screen bg-white">
    <Header />

    <main className="pt-[70px] lg:pt-[90px]">
      {/* Page intro */}
      <section className="bg-light py-14">
        <div className="container-wide flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back to Home
          </Link>

          <SectionHeading
            align="left"
            body="Comprehensive logistics solutions tailored to meet your business needs. From express delivery to international shipping, we've got you covered."
          >
            Our <strong>Services</strong>
          </SectionHeading>
        </div>
      </section>

      {/* Service detail rows */}
      <section className="py-14 lg:py-16">
        <div className="container-wide flex flex-col gap-16 lg:gap-20">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              id={service.id}
              className={`flex scroll-mt-32 flex-col items-center gap-10 lg:flex-row lg:gap-[60px] ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="relative aspect-[574/380] w-full shrink-0 overflow-hidden lg:w-1/2">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="flex w-full flex-col gap-6 lg:w-1/2">
                <h2 className="font-display text-[26px] font-bold text-ink lg:text-[34px]">
                  {service.title}
                </h2>

                <p className="text-[14px] leading-6 text-body">
                  {service.detailedDescription}
                </p>

                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-[18px] font-bold text-ink">
                    Key Benefits
                  </h3>
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-[14px] leading-6 text-body"
                      >
                        <Check
                          className="mt-1 size-4 shrink-0 text-brand"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <ActionLink href="/#contact" sheenTravel={280}>
                  Get a quote for {service.title}
                </ActionLink>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand py-14 text-white">
        <div className="container-wide flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-[26px] font-medium sm:text-[30px] lg:text-[34px]">
            Ready to <span className="font-bold">Get Started</span>?
          </h2>
          <p className="max-w-[720px] text-[14px] leading-6">
            Contact our team today to discuss your logistics needs and get a
            customised quote for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <OutlineLink href="/#contact" onBrand>
              Request a quote
            </OutlineLink>
            <OutlineLink href="mailto:support@apexcourrier.com" onBrand>
              Email us
            </OutlineLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default ServicesPage;
