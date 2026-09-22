"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import ContactAvailability from "./ContactAvailability";
import ContactSocials from "./ContactSocials";
import ContactTerminal from "./ContactTerminal";

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
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function Contact() {
  const { t } = useTranslation("common");

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >

      <Container>
        {/* Section Header */}
        <SectionHeading
          badge={t("contact.badge")}
          title={t("contact.title")}
          description={t("contact.description")}
        />

        {/* Main Contact Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8"
        >
          {/* Availability */}
          <motion.div variants={itemVariants}>
            <ContactAvailability />
          </motion.div>

          {/* Terminal */}
          <motion.div variants={itemVariants}>
            <ContactTerminal />
          </motion.div>
        </motion.div>

        {/* Socials */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mt-10"
        >
          <ContactSocials />
        </motion.div>
      </Container>
    </section>
  );
}