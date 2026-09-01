"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const segments = [
  {
    image: "/express.jpg",
    title: "Express Delivery",
    description:
      "Same-day and next-day movement for urgent packages and documents, with real-time tracking from collection to signature and secure handling at every hand-off.",
    href: "/services",
  },
  {
    image: "/international.jpg",
    title: "International Shipping",
    description:
      "Cross-border shipping to destinations worldwide. Customs paperwork, duties and clearance are handled for you, and every consignment is insured as standard.",
    href: "/services",
  },
  {
    image: "/cargo.jpg",
    title: "Cargo Services",
    description:
      "Palletised and heavy freight for businesses, backed by specialised equipment, fleet management and dedicated capacity when volumes spike.",
    href: "/services",
  },
];

const Services = () => (
  <section id="services" className="bg-light py-10 lg:py-16">
    <div className="container-wide flex flex-col items-center gap-12">
      <motion.h2
        className="text-center font-display text-[26px] font-medium text-black sm:text-[30px] lg:text-[34px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Learn More About the{" "}
        <span className="font-bold">Segments We Serve</span>
      </motion.h2>

      <div className="grid w-full gap-x-[26px] gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment, index) => (
          <motion.article
            key={segment.title}
            className="group flex flex-col gap-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative aspect-[427/297] w-full overflow-hidden">
              <Image
                src={segment.image}
                alt={segment.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 427px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <h3 className="font-display text-[20px] font-bold text-ink">
              {segment.title}
            </h3>

            <p className="text-[14px] leading-6 text-body">
              {segment.description}
            </p>

            <Link
              href={segment.href}
              className="mt-auto inline-flex items-center gap-4 self-start text-[14px] font-bold uppercase tracking-[1px] text-brand transition-colors hover:text-brand-dark"
            >
              Explore
              <span className="inline-flex size-[14px] items-center justify-center">
                <span className="size-[10px] -rotate-45 border-b-[1.6px] border-r-[1.6px] border-current transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
