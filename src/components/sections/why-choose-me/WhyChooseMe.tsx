"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import { whyChooseMe } from "@/data/why-choose-me";

import FeatureCard from "./FeatureCard";

const containerVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function WhyChooseMe() {
  const { t } = useTranslation("common");

  return (
    <section
      id="why-choose-me"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container>
        <SectionHeading
          badge={t("whyChooseMe.badge")}
          title={t("whyChooseMe.title")}
          description={t("whyChooseMe.description")}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {whyChooseMe.features.map((feature) => (
            <motion.div
              key={feature.titleKey}
              variants={itemVariants}
            >
              <FeatureCard
                icon={feature.icon}
                title={t(`whyChooseMe.${feature.titleKey}`)}
                description={t(
                  `whyChooseMe.${feature.descriptionKey}`,
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}