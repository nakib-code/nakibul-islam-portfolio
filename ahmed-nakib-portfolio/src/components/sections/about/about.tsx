"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";
import AboutVisual from "./AboutVisual";

const leftVariant = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const rightVariant = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: 0.15,
      ease: "easeOut",
    },
  },
};

export default function About() {
  return (
    <section
      id="about"
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

        {/* Primary Glow */}
        <div className="absolute left-0 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Secondary Glow */}
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] translate-x-1/3 rounded-full bg-primary/5 blur-[130px]" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge="About Me"
          title="Building scalable digital products with modern web technologies."
          description="I'm Ahmed Nakib, a Full Stack Developer focused on building fast, scalable, and user-friendly web applications."
        />

        {/* Main Content */}
        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Visual */}
          <motion.div
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
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
              amount: 0.3,
            }}
          >
            <AboutContent />
          </motion.div>
        </div>

        {/* Stats */}
        <AboutStats />
      </Container>
    </section>
  );
}