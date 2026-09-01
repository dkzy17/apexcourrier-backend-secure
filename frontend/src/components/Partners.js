"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Handshake } from "lucide-react";

const Partners = () => {
  const partners = [
    {
      name: "FedEx",
      domain: "fedex.com",
      category: "Express Delivery",
      logoUrl:
        "https://cdn.brandfetch.io/idVIIZH-LB/w/800/h/220/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
    {
      name: "DHL",
      domain: "dhl.com",
      category: "International Shipping",
      logoUrl:
        "https://cdn.brandfetch.io/idv0ZbfQqf/w/800/h/114/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
    {
      name: "UPS",
      domain: "ups.com",
      category: "Logistics",
      logoUrl:
        "https://cdn.brandfetch.io/id5aN1Q7um/w/800/h/952/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    },
    {
      name: "Emirates",
      domain: "emirates.com",
      category: "Air Cargo",
      logoUrl: "https://logo.brandfetch.io/emirates.com",
    },
    {
      name: "Lufthansa",
      domain: "lufthansa.com",
      category: "Air Freight",
      logoUrl: "https://logo.brandfetch.io/lufthansa.com",
    },
    {
      name: "Maersk",
      domain: "maersk.com",
      category: "Ocean Freight",
      logoUrl: "https://logo.brandfetch.io/maersk.com",
    },
    {
      name: "TNT",
      domain: "tnt.com",
      category: "Express Services",
      logoUrl: "https://logo.brandfetch.io/tnt.com",
    },
    {
      name: "USPS",
      domain: "usps.com",
      category: "Postal Services",
      logoUrl: "https://logo.brandfetch.io/usps.com",
    },
  ];

  const [loadedLogos, setLoadedLogos] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4; // Number of items visible at once
  const maxIndex = Math.max(0, partners.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Section Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 backdrop-blur-sm rounded-full border border-secondary/20 mb-6"
            variants={itemVariants}
          >
            <Handshake className="text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Trusted Partners
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800"
            variants={itemVariants}
          >
            Our{" "}
            <span className="bg-gradient-to-r from-secondary to-orange-600 bg-clip-text text-transparent">
              Partners
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            We collaborate with world-class shipping and logistics companies to
            ensure your packages reach their destination safely and on time.
          </motion.p>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <div className="text-3xl font-bold text-secondary mb-2">50+</div>
            <div className="text-sm text-gray-600">Global Partners</div>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <div className="text-3xl font-bold text-secondary mb-2">200+</div>
            <div className="text-sm text-gray-600">Countries Covered</div>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <div className="text-3xl font-bold text-secondary mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Delivery Success</div>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
            <div className="text-sm text-gray-600">Support Network</div>
          </motion.div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
            disabled={currentIndex === 0}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
            disabled={currentIndex === maxIndex}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden p-5">
            <motion.div
              className="flex space-x-6"
              animate={{
                x: `${-currentIndex * (100 / itemsPerView)}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - 1.5rem)` }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    {/* Partner Logo */}
                    <motion.div
                      className="w-full h-16 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                      whileHover={{
                        rotate: [0, -2, 2, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={partner.logoUrl}
                          alt={`${partner.name} logo`}
                          fill
                          className="object-contain filter group-hover:brightness-100 transition-all duration-300"
                          onError={(e) => {
                            // Fallback to a simple text logo if Brandfetch fails
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        {/* Fallback text logo */}
                        <div className="hidden w-full h-full items-center justify-center bg-gray-100 rounded-lg">
                          <span className="text-gray-800 font-bold text-sm">
                            {partner.name}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {partner.name}
                    </h4>

                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {partner.category}
                    </p>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="text-yellow-400 text-xs"
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        Trusted
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-secondary scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-lg text-gray-600 mb-6">
            Want to become our partner? Let's work together to deliver
            excellence.
          </p>
          <motion.button
            className="bg-gradient-to-r from-secondary to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Handshake className="text-lg" />
            Partner With Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
