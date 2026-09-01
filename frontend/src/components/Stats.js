"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  {
    end: 10,
    suffix: "+",
    copy: "Years moving freight for businesses that need their shipments to arrive intact, documented and on schedule.",
  },
  {
    end: 250,
    suffix: "K+",
    copy: "Satisfied clients across express, cargo and international lanes, from single parcels to full container loads.",
  },
  {
    end: 150,
    suffix: "+",
    copy: "Countries served through our partner network, with customs clearance and insurance handled as part of the service.",
  },
];

function CountUp({ end, suffix, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const startTime = performance.now();
    const ms = duration * 1000;

    function tick(now) {
      const t = Math.min((now - startTime) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const Stats = () => (
  <section>
    <div className="bg-white py-14">
      <div className="container-wide flex flex-col items-center gap-[6px] text-center">
        <motion.h2
          className="font-display text-[26px] font-medium text-black sm:text-[30px] lg:text-[34px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Keep Goods Moving with{" "}
          <span className="font-bold">ApexCourrier</span> Delivery and{" "}
          <span className="font-bold">Logistics Solutions</span>
        </motion.h2>
        <motion.p
          className="max-w-[1264px] text-[14px] leading-6 text-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Enhance productivity and achieve success with real-time visibility at
          every stage of your shipment. Our tracking, secure handling and
          dedicated support let you plan around your freight instead of chasing
          it — so you can exceed customer expectations and keep operations
          moving without interruption.
        </motion.p>
      </div>
    </div>

    <div className="bg-brand py-12 text-white">
      <div className="container-wide grid gap-12 text-center sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.end}
            className="flex flex-col items-center gap-8 px-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="font-display text-[64px] font-extralight leading-none tabular-nums lg:text-[100px]">
              <CountUp end={stat.end} suffix={stat.suffix} />
            </p>
            <p className="text-[14px] leading-normal">{stat.copy}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
