"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import { whyChooseMe } from "@/data/why-choose-me";

import FeatureCard from "./FeatureCard";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
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
      <Container>
        {/* Section intro */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <SectionHeading
              badge={t("whyChooseMe.badge")}
              title={t("whyChooseMe.title")}
              description={t("whyChooseMe.description")}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="flex items-end justify-start lg:justify-end"
          >
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-16 grid gap-7 px-1 md:grid-cols-2 lg:gap-8"
        >
          {whyChooseMe.features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              variants={itemVariants}
              className="h-full"
            >
              <FeatureCard
                index={index}
                icon={feature.icon}
                title={t(
                  `whyChooseMe.${feature.titleKey}`,
                )}
                description={t(
                  `whyChooseMe.${feature.descriptionKey}`,
                )}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="mt-14 flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-border" />

          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {t("whyChooseMe.bottomLabel")}
          </span>

          <span className="h-px flex-1 bg-border" />
        </motion.div>
      </Container>
    </section>
  );
}