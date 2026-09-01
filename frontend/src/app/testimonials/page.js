"use client";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Heart,
  Building2,
  CalendarDays,
  ThumbsUp,
  Zap,
  Globe,
  Truck,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActionLink, OutlineLink, SectionHeading } from "@/components/ui";

const testimonials = [
  {
    id: 1,
    name: "Sarah Williams",
    position: "CEO",
    company: "TechFlow Solutions",
    industry: "Technology",
    rating: 5,
    date: "December 2023",
    content:
      "ApexCourrier has transformed our logistics operations. Their real-time tracking and professional team have made our supply chain incredibly efficient. We've seen a 40% improvement in delivery times since partnering with them.",
    avatar: "SW",
    serviceUsed: "Express Delivery",
    detailedReview:
      "Working with ApexCourrier has been a game-changer for our tech company. We ship sensitive electronic components daily, and their express delivery service ensures our products reach clients quickly and safely. The real-time tracking gives us and our customers peace of mind, and their customer service team is always available to address any concerns. The 40% improvement in delivery times has significantly boosted our customer satisfaction scores.",
    highlights: [
      "40% faster delivery times",
      "Real-time tracking system",
      "Professional handling of sensitive items",
      "24/7 customer support",
    ],
  },
  {
    id: 2,
    name: "David Chen",
    position: "Operations Director",
    company: "Global Commerce Ltd",
    industry: "E-commerce",
    rating: 5,
    date: "November 2023",
    content:
      "Outstanding service! ApexCourrier handles our international shipments with precision and care. Their customer support is available 24/7, and they always go above and beyond to ensure our packages arrive safely.",
    avatar: "DC",
    serviceUsed: "International Shipping",
    detailedReview:
      "As an e-commerce business shipping to over 50 countries, we needed a reliable international shipping partner. ApexCourrier exceeded our expectations with their comprehensive customs handling and global network. They've helped us expand into new markets with confidence, knowing our products will arrive on time and in perfect condition. Their customs clearance expertise has saved us countless hours and potential delays.",
    highlights: [
      "Seamless international shipping",
      "Expert customs handling",
      "Global network coverage",
      "Zero shipping delays",
    ],
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    position: "Founder",
    company: "Artisan Crafts",
    industry: "Handmade Goods",
    rating: 5,
    date: "October 2023",
    content:
      "As a small business owner, I need a delivery partner I can trust. ApexCourrier has been incredible - reliable service, and they treat my handmade products with the care they deserve.",
    avatar: "MR",
    serviceUsed: "Express Delivery",
    detailedReview:
      "Running a small artisan business means every package matters. ApexCourrier understands this and treats each of my handmade items with exceptional care. Their packaging recommendations have helped reduce damage rates to nearly zero, and their excellent service allows me to offer reliable shipping to my customers. The personal touch they provide makes me feel like a valued partner, not just another account number.",
    highlights: [
      "Careful handling of delicate items",
      "Excellent customer service",
      "Personalized service approach",
      "Zero damage incidents",
    ],
  },
  {
    id: 4,
    name: "James Thompson",
    position: "Logistics Manager",
    company: "MegaCorp Industries",
    industry: "Manufacturing",
    rating: 5,
    date: "September 2023",
    content:
      "We ship thousands of packages monthly, and ApexCourrier consistently delivers excellence. Their warehouse management and tracking systems are top-tier. Couldn't ask for a better logistics partner.",
    avatar: "JT",
    serviceUsed: "Cargo Services",
    detailedReview:
      "Managing logistics for a large manufacturing company requires a partner who can handle volume without compromising quality. ApexCourrier's cargo services have streamlined our operations significantly. Their warehouse management system integrates seamlessly with our ERP, and their tracking capabilities give us complete visibility over our supply chain. The scalability they offer has supported our 200% growth over the past two years.",
    highlights: [
      "Handles high-volume shipping",
      "Seamless system integration",
      "Complete supply chain visibility",
      "Scalable solutions",
    ],
  },
  {
    id: 5,
    name: "Emily Foster",
    position: "E-commerce Manager",
    company: "StyleHub Fashion",
    industry: "Fashion",
    rating: 5,
    date: "August 2023",
    content:
      "ApexCourrier understands the fashion industry's fast-paced demands. Their express delivery service has helped us maintain customer satisfaction and reduce return rates significantly.",
    avatar: "EF",
    serviceUsed: "Express Delivery",
    detailedReview:
      "In the fashion industry, timing is everything. ApexCourrier's express service ensures our customers receive their orders quickly, which is crucial for seasonal items and trending pieces. Their understanding of fashion logistics, including careful handling of garments and accessories, has helped us maintain our brand reputation. The reduction in return rates due to faster delivery times has positively impacted our bottom line.",
    highlights: [
      "Fast fashion-focused delivery",
      "Careful garment handling",
      "Reduced return rates",
      "Industry expertise",
    ],
  },
  {
    id: 6,
    name: "Robert Kim",
    position: "Supply Chain Director",
    company: "HealthTech Solutions",
    industry: "Healthcare",
    rating: 5,
    date: "July 2023",
    content:
      "For medical supplies and equipment, reliability is non-negotiable. ApexCourrier's temperature-controlled shipping and compliance expertise make them our go-to logistics partner.",
    avatar: "RK",
    serviceUsed: "Specialized Cargo",
    detailedReview:
      "Healthcare logistics requires the highest standards of reliability and compliance. ApexCourrier's specialized cargo services, including temperature-controlled transport and regulatory compliance expertise, have been invaluable for our medical device shipments. Their understanding of healthcare regulations and ability to maintain cold chain integrity has enabled us to expand our distribution network while maintaining product quality and safety standards.",
    highlights: [
      "Temperature-controlled shipping",
      "Healthcare compliance expertise",
      "Cold chain integrity",
      "Regulatory knowledge",
    ],
  },
];

const stats = [
  { icon: ThumbsUp, number: "98%", label: "Customer Satisfaction" },
  { icon: Star, number: "4.9/5", label: "Average Rating" },
  { icon: Heart, number: "95%", label: "Customer Retention" },
  { icon: Building2, number: "700+", label: "Business Partners" },
];

const serviceIcons = {
  "Express Delivery": Zap,
  "International Shipping": Globe,
  "Cargo Services": Truck,
  "Specialized Cargo": Truck,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TestimonialsPage = () => (
  <div className="min-h-screen bg-light">
    <Header />

    <main className="pt-[70px] lg:pt-[90px]">
      {/* Page intro */}
      <section className="bg-light py-14">
        <div className="container-wide flex flex-col gap-6">
          <a
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back to Home
          </a>

          <SectionHeading
            align="left"
            body="Real stories from real businesses who trust ApexCourrier with their logistics needs."
          >
            Customer <strong>Success Stories</strong>
          </SectionHeading>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14">
        <div className="container-wide grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3 border border-line p-6 text-center transition-colors hover:border-brand"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <stat.icon className="size-6 text-brand" strokeWidth={1.75} aria-hidden="true" />
              <p className="font-display text-[26px] font-bold tabular-nums text-ink sm:text-[30px]">
                {stat.number}
              </p>
              <p className="text-[13px] text-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 lg:py-16">
        <div className="container-wide flex flex-col gap-16 lg:gap-20">
          {testimonials.map((testimonial, index) => {
            const ServiceIcon = serviceIcons[testimonial.serviceUsed] || Zap;

            return (
              <motion.article
                key={testimonial.id}
                className={`flex flex-col items-start gap-8 lg:flex-row lg:gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {/* Customer card */}
                <div className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[300px]">
                  <div className="flex flex-col items-center gap-4 border border-line bg-white p-8 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-brand text-[20px] font-bold text-white">
                      {testimonial.avatar}
                    </div>

                    <div>
                      <h3 className="font-display text-[18px] font-bold text-ink">
                        {testimonial.name}
                      </h3>
                      <p className="text-[14px] font-semibold text-brand">
                        {testimonial.position}
                      </p>
                      <p className="text-[13px] text-body">{testimonial.company}</p>
                      <span className="mt-2 inline-block border border-line px-3 py-1 text-[12px] font-medium text-body">
                        {testimonial.industry}
                      </span>
                    </div>

                    <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-current text-brand"
                          strokeWidth={0}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col items-center gap-1 text-[13px] text-body">
                      <span className="flex items-center gap-2">
                        <ServiceIcon className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
                        {testimonial.serviceUsed}
                      </span>
                      <span className="flex items-center gap-2 text-muted">
                        <CalendarDays className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full border border-line bg-white p-6 sm:p-8">
                  <Quote
                    className="mb-6 size-10 text-brand/25"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <blockquote className="mb-8 text-[18px] italic leading-relaxed text-ink">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  <div className="mb-8">
                    <h4 className="mb-3 font-display text-[16px] font-bold text-ink">
                      Detailed Experience
                    </h4>
                    <p className="text-[14px] leading-6 text-body">
                      {testimonial.detailedReview}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 font-display text-[16px] font-bold text-ink">
                      Key Benefits Experienced
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {testimonial.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-3 border border-line bg-light p-3"
                        >
                          <span className="size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                          <span className="text-[13px] text-body">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-14 text-white">
        <div className="container-wide flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-[26px] font-medium sm:text-[30px] lg:text-[34px]">
            Ready to Join Our <span className="font-bold">Success Stories</span>?
          </h2>
          <p className="max-w-[720px] text-[14px] leading-6">
            Experience the same level of service and satisfaction that our
            customers rave about. Start your journey with ApexCourrier today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ActionLink href="/#contact" sheenTravel={260}>
              Get started now
            </ActionLink>
            <OutlineLink href="mailto:support@apexcourrier.com" onBrand>
              Contact sales team
            </OutlineLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default TestimonialsPage;
