"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import { servicesContent } from "@/data/services";
import ServiceCard from "./ServiceCard";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Glow */}
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] translate-x-1/3 rounded-full bg-primary/5 blur-[130px]" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        <SectionHeading
          badge={servicesContent.badge}
          title={servicesContent.title}
          description={servicesContent.description}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2"
        >
          {servicesContent.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl sm:flex-row sm:p-7"
        >
          <div>
            <h3 className="text-lg font-semibold">
              Have a project in mind?
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Let&apos;s discuss your idea and build something useful together.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Discuss Project
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}