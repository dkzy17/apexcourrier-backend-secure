"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Rocket, ShieldCheck, Truck, Globe, ArrowRight } from "lucide-react";

const backgroundImages = [
  "/express.jpg",
  "/international.jpg",
  "/cargo.jpg",
  "/warehouse.jpg",
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section className="relative text-white min-h-[100svh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1.05 : 1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        ))}
      </div>

      {/* Subtle glow elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/[0.06] rounded-full blur-3xl" />
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-8 relative z-20 py-24 sm:py-32">
        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-5 sm:mb-6"
            variants={fadeInUp}
          >
            <span className="text-xs sm:text-sm font-medium text-white">
              ⭐ Trusted by 250,000+ customers worldwide
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 leading-[1.1]"
            variants={fadeInUp}
          >
            Fast &amp; Reliable
            <br />
            <span className="bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Delivery Services
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl mb-8 text-orange-100 max-w-xl leading-relaxed"
            variants={fadeInUp}
          >
            Experience world-class logistics solutions with real-time tracking,
            secure handling, and guaranteed on-time delivery for all your
            shipping needs.
          </motion.p>

          {/* Features */}
          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-3 mb-8"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 text-white/90">
              <ShieldCheck className="size-5" strokeWidth={1.75} />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Rocket className="size-5" strokeWidth={1.75} />
              <span className="text-sm font-medium">Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Globe className="size-5" strokeWidth={1.75} />
              <span className="text-sm font-medium">Global Coverage</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={fadeInUp}
          >
            <Link
              href="#about"
              className="bg-white text-ink px-7 py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-all inline-flex items-center justify-center gap-3 shadow-2xl shadow-black/25"
            >
              <Truck className="size-5" strokeWidth={1.75} />
              About Us
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>

            <Link
              href="#tracking"
              className="text-white px-7 py-3.5 rounded-xl font-semibold border-2 border-white/50 hover:border-white hover:bg-white/15 transition-all inline-flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <Rocket className="size-5" strokeWidth={1.75} />
              Track Package
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-8 border-t border-white/20"
            variants={fadeInUp}
          >
            {[
              ["500K+", "Deliveries"],
              ["150+", "Countries"],
              ["250K+", "Satisfied Customers"],
              ["98.9%", "On-Time Delivery"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-0.5">{value}</div>
                <div className="text-xs sm:text-sm text-orange-200">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
