"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import ContactSocials from "./ContactSocials";
import ContactTerminal from "./ContactTerminal";
import ContactAvailability from "./ContactAvailability";

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
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      {/* =================================
          BACKGROUND
      ================================= */}

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

        {/* Main Glow */}
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[130px]" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        {/* =================================
            SECTION HEADER
        ================================= */}

        <SectionHeading
          badge="Contact"
          title="Have an idea? Let's build it."
          description="Have a project in mind, need a developer, or just want to talk tech? I'm always open to interesting conversations."
        />

        {/* =================================
            MAIN CONTACT AREA
        ================================= */}

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

        {/* =================================
            SOCIALS
        ================================= */}

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