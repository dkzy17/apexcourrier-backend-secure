"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
  {
    name: "Sarah Williams",
    position: "CEO, TechFlow Solutions",
    company: "TechFlow Solutions",
    headline: "TechFlow Solutions Cuts Delivery Times by 40%",
    content:
      "ApexCourrier has transformed our logistics operations. Their real-time tracking and professional team have made our supply chain incredibly efficient. We've seen a 40% improvement in delivery times since partnering with them.",
    image: "/express.jpg",
  },
  {
    name: "David Chen",
    position: "Operations Director, Global Commerce",
    company: "Global Commerce Ltd",
    headline: "Global Commerce Scales International Shipping",
    content:
      "Outstanding service! ApexCourrier handles our international shipments with precision and care. Their customer support is available 24/7, and they always go above and beyond to ensure our packages arrive safely.",
    image: "/international.jpg",
  },
  {
    name: "Carlos Mendoza",
    position: "Director de Operaciones, Comercio Global",
    company: "Comercio Global S.A.",
    headline: "Comercio Global Expands Across Latin America",
    content:
      "ApexCourrier ha revolucionado nuestras operaciones logísticas. Su servicio de entrega rápida y seguimiento en tiempo real nos ha permitido expandir nuestro negocio por toda América Latina. El equipo profesional siempre está disponible para resolver cualquier consulta. ¡Excelente servicio!",
    image: "/cargo.jpg",
  },
  {
    name: "김민준 (Kim Min-jun)",
    position: "물류 담당자, 삼성전자",
    company: "Samsung Electronics",
    headline: "Samsung Electronics Lifts Customer Satisfaction",
    content:
      "ApexCourrier는 우리의 국제 배송 요구사항을 완벽하게 충족시켜줍니다. 빠르고 안전한 배송 서비스로 고객 만족도가 크게 향상되었습니다. 전문적인 팀과 실시간 추적 시스템이 매우 인상적입니다.",
    image: "/warehouse.jpg",
  },
  {
    name: "李小明 (Li Xiaoming)",
    position: "供应链总监, 阿里巴巴",
    company: "Alibaba Group",
    headline: "Alibaba Group Keeps Its Competitive Edge",
    content:
      "ApexCourrier 为我们提供了卓越的物流解决方案。他们的专业服务和可靠的配送网络帮助我们在全球市场中保持竞争优势。客户服务团队响应迅速，解决问题效率很高。",
    image: "/pexels-tomfisk-3075996.jpg",
  },
  {
    name: "Maria Santos",
    position: "Operations Manager, Jollibee Foods",
    company: "Jollibee Foods Corporation",
    headline: "Jollibee Foods Delivers Nationwide, On Time",
    content:
      "Napakagaling ng serbisyo ng ApexCourrier! Mabilis at ligtas ang delivery ng mga produkto namin sa buong Pilipinas. Ang kanilang customer support ay palaging handang tumulong 24/7. Highly recommended para sa mga negosyong nangangailangan ng maaasahang logistics partner.",
    image: "/service1.jpg",
  },
];

const ArrowButton = ({ direction, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="grid size-[60px] shrink-0 place-items-center text-ink transition-colors hover:text-brand"
  >
    <span
      className={`size-[22px] border-current ${
        direction === "prev"
          ? "-rotate-[135deg] border-b-[2px] border-r-[2px]"
          : "rotate-45 border-b-[2px] border-r-[2px]"
      }`}
    />
  </button>
);

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const story = stories[index];

  const go = (step) =>
    setIndex((i) => (i + step + stories.length) % stories.length);

  return (
    <section className="bg-light py-10 lg:py-16">
      <div className="container-wide flex flex-col items-center gap-10">
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[26px] font-medium text-black sm:text-[30px] lg:text-[34px]">
            Featured Customer <span className="font-bold">Success Stories</span>
          </h2>
          <p className="max-w-[1216px] text-[14px] leading-6 text-body">
            Discover how businesses like yours are transforming operations with
            ApexCourrier. From improving delivery times to reaching new markets,
            our customers achieve measurable results. Explore their stories to
            see how our services drive outcomes in a competitive market.
          </p>
        </motion.div>

        <div className="flex w-full items-center gap-2 lg:gap-4">
          <div className="hidden lg:block">
            <ArrowButton
              direction="prev"
              onClick={() => go(-1)}
              label="Previous story"
            />
          </div>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.article
                key={index}
                className="flex flex-col items-center gap-8 lg:flex-row lg:gap-[60px]"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <div className="relative aspect-[574/314] w-full shrink-0 overflow-hidden lg:w-[574px]">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 574px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-[30px] lg:max-w-[466px]">
                  <div className="flex flex-col gap-[30px]">
                    <p className="text-[13px] font-semibold uppercase tracking-[1px] text-muted">
                      Success Story
                    </p>
                    <h3 className="font-display text-[24px] font-bold leading-snug text-ink sm:text-[28px]">
                      {story.headline}
                    </h3>
                    <blockquote className="text-[14px] leading-6 text-body">
                      “{story.content}”
                    </blockquote>
                    <footer className="text-[13px] text-muted">
                      <span className="font-semibold text-ink">
                        {story.name}
                      </span>{" "}
                      — {story.position}
                    </footer>
                  </div>

                  <Link
                    href="/testimonials"
                    className="inline-flex w-fit items-center gap-[14px] bg-brand px-[15px] py-[14px] text-[14px] font-bold uppercase leading-[17px] tracking-[1.3px] text-white transition-colors hover:bg-brand-dark"
                  >
                    Learn More
                    <span className="inline-flex size-[11px] items-center justify-center">
                      <span className="size-[8px] -rotate-45 border-b-[1.6px] border-r-[1.6px] border-white" />
                    </span>
                  </Link>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="hidden lg:block">
            <ArrowButton
              direction="next"
              onClick={() => go(1)}
              label="Next story"
            />
          </div>
        </div>

        <div className="flex max-w-full items-center gap-2 sm:gap-5">
          <div className="lg:hidden">
            <ArrowButton
              direction="prev"
              onClick={() => go(-1)}
              label="Previous story"
            />
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 sm:gap-5">
            {stories.map((item, i) => (
              <button
                key={item.company}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show story from ${item.company}`}
                aria-current={i === index}
                className={`h-1 w-6 transition-colors sm:w-[60px] ${
                  i === index ? "bg-brand" : "bg-line hover:bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="lg:hidden">
            <ArrowButton
              direction="next"
              onClick={() => go(1)}
              label="Next story"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
