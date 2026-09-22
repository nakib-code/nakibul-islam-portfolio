"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";
import AboutVisual from "./AboutVisual";

const leftVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const rightVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: 0.1,
      ease: "easeOut",
    },
  },
};

export default function About() {
  const { t } = useTranslation("common");

  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 sm:py-32"
    >

      <Container>
        <SectionHeading
          badge={t("about.badge")}
          title={t("about.title")}
          description={t("about.description")}
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          {/* Visual */}
          <motion.div
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <AboutVisual />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <AboutContent />
          </motion.div>
        </div>

        <AboutStats />
      </Container>
    </section>
  );
}