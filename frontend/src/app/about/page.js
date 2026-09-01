"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Truck,
  Globe,
  Award,
  Clock,
  ShieldCheck,
  Rocket,
  Handshake,
  Heart,
  Lightbulb,
  Eye,
  Mail,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    {
      icon: Truck,
      number: "50K+",
      label: "Deliveries Completed",
      color: "text-brand",
      bgColor: "from-blue-500/10 to-blue-600/10",
    },
    {
      icon: Globe,
      number: "150+",
      label: "Countries Served",
      color: "text-brand",
      bgColor: "from-green-500/10 to-green-600/10",
    },
    {
      icon: Users,
      number: "10K+",
      label: "Happy Customers",
      color: "text-brand",
      bgColor: "from-purple-500/10 to-purple-600/10",
    },
    {
      icon: Award,
      number: "99.9%",
      label: "Success Rate",
      color: "text-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/10",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make puts our customers at the center, ensuring their satisfaction and success.",
      color: "from-red-500 to-pink-600",
      detailedDescription:
        "Our customer-first approach means we listen to your needs, understand your challenges, and deliver solutions that exceed expectations. We believe that your success is our success, and we're committed to building long-term partnerships based on trust and reliability.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve our technology and processes to deliver cutting-edge logistics solutions.",
      color: "from-yellow-500 to-orange-600",
      detailedDescription:
        "Innovation drives everything we do. From implementing the latest tracking technology to developing sustainable delivery methods, we're always looking for ways to improve our services and reduce our environmental impact while maintaining the highest standards of efficiency.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "Clear communication and honest practices build the trust that forms lasting partnerships.",
      color: "from-blue-500 to-indigo-600",
      detailedDescription:
        "Transparency is the foundation of trust. We provide honest timelines and real-time updates on your shipments. Our open communication policy ensures you're always informed about your deliveries and any potential issues that may arise.",
    },
  ];

  const team = [
    {
      name: "Michael Johnson",
      position: "CEO & Founder",
      bio: "With over 15 years in logistics, Michael founded ApexCourrier to revolutionize the shipping industry with customer-centric solutions.",
      avatar: "MJ",
      social: {
        email: "michael@apexcourrier.com",
      },
    },
    {
      name: "Sarah Chen",
      position: "Chief Operations Officer",
      bio: "Sarah oversees our global operations, ensuring seamless delivery experiences across all our service areas.",
      avatar: "SC",
      social: {
        email: "sarah@apexcourrier.com",
      },
    },
    {
      name: "David Rodriguez",
      position: "Head of Technology",
      bio: "David leads our tech innovation, developing cutting-edge tracking systems and logistics optimization tools.",
      avatar: "DR",
      social: {
        email: "david@apexcourrier.com",
      },
    },
    {
      name: "Emily Foster",
      position: "Customer Success Director",
      bio: "Emily ensures every customer receives exceptional service and support throughout their journey with us.",
      avatar: "EF",
      social: {
        email: "emily@apexcourrier.com",
      },
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description:
        "ApexCourrier was established with a vision to transform logistics.",
    },
    {
      year: "2019",
      title: "First 1000 Deliveries",
      description:
        "Reached our first major milestone with exceptional customer satisfaction.",
    },
    {
      year: "2020",
      title: "International Expansion",
      description: "Expanded services to 50+ countries worldwide.",
    },
    {
      year: "2021",
      title: "Technology Innovation",
      description:
        "Launched real-time tracking and AI-powered route optimization.",
    },
    {
      year: "2022",
      title: "Sustainability Initiative",
      description:
        "Introduced eco-friendly delivery options and carbon-neutral shipping.",
    },
    {
      year: "2023",
      title: "50K+ Deliveries",
      description:
        "Celebrated 50,000+ successful deliveries with 99.9% success rate.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <motion.section
        className="bg-brand text-white py-20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft strokeWidth={1.75} className="size-3.5" />
            <span>Back to Home</span>
          </Link>

          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            About ApexCourrier
          </motion.h1>

          <motion.p
            className="text-xl text-white/90 max-w-3xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            We're more than just a logistics company. We're your trusted partner
            in connecting businesses and people across the globe, delivering
            excellence with every pkg.
          </motion.p>
        </div>
      </motion.section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-8">Our Story</h2>
            <p className="text-lg text-body leading-relaxed mb-8">
              Founded in 2018, ApexCourrier emerged from a simple yet
              powerful vision: to make logistics simple, reliable, and
              accessible for businesses of all sizes. What started as a local
              delivery service has grown into a global logistics network,
              serving over 150 countries and completing more than 50,000
              deliveries.
            </p>
            <p className="text-lg text-body leading-relaxed">
              Our journey has been driven by innovation, customer satisfaction,
              and an unwavering commitment to excellence. Today, we're proud to
              be a trusted partner for thousands of businesses worldwide,
              helping them grow and succeed through reliable logistics
              solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded border border-line bg-light text-center group transition-all duration-300`}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6 ${stat.color}`}
                >
                  <stat.icon className="text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-ink mb-2">
                  {stat.number}
                </h3>
                <p className="text-body font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              These values guide every decision we make and every service we
              provide.
            </p>
          </motion.div>

          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                variants={itemVariants}
              >
                <div className="lg:w-1/3">
                  <motion.div
                    className={`relative p-12 rounded bg-brand text-white text-center`}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <value.icon className="text-6xl mx-auto mb-6" />
                    <h3 className="text-2xl font-bold">{value.title}</h3>
                  </motion.div>
                </div>

                <div className="lg:w-2/3 space-y-6">
                  <h3 className="text-3xl font-bold text-ink">
                    {value.title}
                  </h3>
                  <p className="text-lg text-body leading-relaxed">
                    {value.description}
                  </p>
                  <p className="text-body leading-relaxed">
                    {value.detailedDescription}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-6">
              Our Journey
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Key milestones that shaped our company and defined our success.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-brand"></div>

            <motion.div
              className="space-y-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  variants={itemVariants}
                >
                  <div
                    className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                      }`}
                  >
                    <motion.div
                      className="bg-white p-6 rounded border border-line"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {milestone.year}
                      </h3>
                      <h4 className="text-xl font-semibold text-ink mb-3">
                        {milestone.title}
                      </h4>
                      <p className="text-body">{milestone.description}</p>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              The passionate professionals behind ApexCourrier'
              success.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded border border-line text-center group transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-body text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${member.social.email}`}
                    aria-label={`Email ${member.name}`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <Mail strokeWidth={1.75} className="size-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="bg-brand text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ApexCourrier
            Logistics for their logistics needs.
          </p>
          <motion.button
            className="bg-white text-brand px-8 py-4 rounded font-semibold text-lg hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
