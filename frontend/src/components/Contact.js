"use client";
import { useState } from "react";
import { Mail, MapPin, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { motion } from "framer-motion";
import ApiService from "@/app/utils/api";
import { SectionHeading, InfoTile } from "@/components/ui";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    serviceType: "",
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      await ApiService.sendContactEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        serviceType: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ isSubmitting: false, isSubmitted: false, error: null });
      }, 5000);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error:
          "We couldn't send your message just now. Please try again, or email us directly at support@apexcourrier.com.",
      });
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const contactItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <section id="contact" className="py-14 lg:py-16 bg-white">
      <motion.div
        className="container-wide"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        {/* Header */}
        <motion.div className="mb-12" variants={fadeIn}>
          <SectionHeading
            body="Ready to streamline your delivery needs? Tell us what you're moving and we'll come back with a quote and a plan."
          >
            Get in Touch with <strong>Our Team</strong>
          </SectionHeading>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <motion.div variants={contactItemVariants}>
            <InfoTile icon={Mail} label="Email">
              <a
                href="mailto:support@apexcourrier.com"
                className="transition-colors hover:text-brand"
              >
                support@apexcourrier.com
              </a>
            </InfoTile>
          </motion.div>

          <motion.div variants={contactItemVariants}>
            <InfoTile icon={MapPin} label="Address">
              5 Montague Close, London SE1 9BB
            </InfoTile>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          className="max-w-2xl mx-auto"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Success Message */}
          {formStatus.isSubmitted && (
            <motion.div
              className="bg-green-50 border border-green-200 p-6 mb-8 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheckCircle2 className="mr-3 size-5 shrink-0 text-green-600" strokeWidth={1.75} />
              <div>
                <h4 className="font-semibold text-green-800">Message Sent!</h4>
                <p className="text-green-600 text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {formStatus.error && (
            <motion.div
              className="bg-red-50 border border-red-200 p-6 mb-8 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="mr-3 size-5 shrink-0 text-red-600" strokeWidth={1.75} />
              <div>
                <h4 className="font-semibold text-red-800">Error</h4>
                <p className="text-red-600 text-sm">{formStatus.error}</p>
              </div>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="border border-line p-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h3
              className="font-display text-xl font-bold mb-6 text-ink"
              variants={formItemVariants}
            >
              Send us a message
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div variants={formItemVariants}>
                <label
                  htmlFor="name"
                  className="block mb-2 text-[14px] text-body font-medium"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-line"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <motion.p
                    className="text-red-500 text-sm mt-1 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertTriangle className="mr-1 size-3.5 shrink-0" strokeWidth={1.75} />
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={formItemVariants}>
                <label
                  htmlFor="email"
                  className="block mb-2 text-[14px] text-body font-medium"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-line"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <motion.p
                    className="text-red-500 text-sm mt-1 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertTriangle className="mr-1 size-3.5 shrink-0" strokeWidth={1.75} />
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div className="mb-6" variants={formItemVariants}>
              <label
                htmlFor="subject"
                className="block mb-2 text-[14px] text-body font-medium"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all ${
                  errors.subject
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-line"
                }`}
                placeholder="What can we help you with?"
              />
              {errors.subject && (
                <motion.p
                  className="text-red-500 text-sm mt-1 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="mr-1 size-3.5 shrink-0" strokeWidth={1.75} />
                  {errors.subject}
                </motion.p>
              )}
            </motion.div>

            <motion.div className="mb-6" variants={formItemVariants}>
              <label className="block mb-2 text-[14px] text-body font-medium">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all resize-none ${
                  errors.message
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-line"
                }`}
                placeholder="Tell us more about your delivery needs..."
              ></textarea>
              {errors.message && (
                <motion.p
                  className="text-red-500 text-sm mt-1 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="mr-1 size-3.5 shrink-0" strokeWidth={1.75} />
                  {errors.message}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={formStatus.isSubmitting}
              className={`w-full py-3 px-6 text-[14px] font-bold uppercase tracking-[1.3px] transition-all flex items-center justify-center gap-2 ${
                formStatus.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-brand-dark"
              }`}
              variants={formItemVariants}
              whileHover={{ scale: formStatus.isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: formStatus.isSubmitting ? 1 : 0.98 }}
            >
              {formStatus.isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="size-4" strokeWidth={1.75} />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
