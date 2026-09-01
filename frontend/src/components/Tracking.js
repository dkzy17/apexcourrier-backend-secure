"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    window.open(
      `/tracking?number=${encodeURIComponent(trackingNumber)}`,
      "_blank"
    );
  };

  return (
    <section id="tracking" className="bg-white py-14 lg:py-16">
      <div className="container-wide flex flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-11">
        <motion.div
          className="relative aspect-[570/321] w-full shrink-0 overflow-hidden lg:w-[570px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/pexels-tomfisk-3075996.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 570px"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-5 lg:w-[618px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-display text-[26px] font-medium text-ink sm:text-[30px] lg:text-[34px]">
            Track Your <span className="font-bold">Package</span>
          </h2>

          <p className="text-[14px] leading-6 text-body">
            Enter your tracking number to get real-time updates on your
            shipment. You&apos;ll see every scan from collection to delivery,
            the current location of your consignment and its estimated arrival
            time.
          </p>

          <form
            onSubmit={handleTrack}
            className="flex h-[52px] items-center border border-line pl-4 pr-[5px]"
          >
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              aria-label="Tracking number"
              className="h-full min-w-0 flex-1 text-[14px] text-body placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="h-[42px] shrink-0 bg-brand px-6 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
            >
              Track
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Tracking;
