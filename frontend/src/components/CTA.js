"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CTA = () => (
  <section className="relative overflow-hidden bg-light py-14 lg:py-16">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-20 right-0 hidden h-[331px] w-[564px] lg:block"
    >
      <Image
        src="/express.jpg"
        alt=""
        fill
        sizes="564px"
        className="object-cover"
      />
    </div>

    <div className="container-wide relative">
      <motion.div
        className="flex max-w-[600px] flex-col gap-7"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-[26px] font-medium leading-snug text-ink sm:text-[30px] lg:text-[34px]">
          Ready to Elevate Your <span className="font-bold">Delivery</span> and{" "}
          <span className="font-bold">Logistics Operations</span>?
        </h2>

        <Link
          href="#contact"
          className="inline-flex w-fit items-center gap-[14px] bg-brand px-[15px] py-[14px] text-[14px] font-bold uppercase leading-[17px] tracking-[1.3px] text-white transition-colors hover:bg-brand-dark"
        >
          Take the next step with us today
          <span className="inline-flex size-[11px] items-center justify-center">
            <span className="size-[8px] -rotate-45 border-b-[1.6px] border-r-[1.6px] border-white" />
          </span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTA;
