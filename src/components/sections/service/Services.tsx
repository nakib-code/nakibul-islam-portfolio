"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("common");

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background */}
      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge={t("services.badge")}
          title={t("services.title")}
          description={t("services.description")}
        />

        {/* Services */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2"
        >
          {servicesContent.services.map(
            (service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ),
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl sm:flex-row sm:p-7"
        >
          <div>
            <h3 className="text-lg font-semibold">
              {t("services.cta.title")}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("services.cta.description")}
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {t("services.cta.button")}

            <span aria-hidden="true">
              →
            </span>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}