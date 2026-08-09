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
      className="py-24 lg:py-32"
    >
      <Container>
        <SectionHeading
          badge="About Me"
          title="Building scalable digital products with modern web technologies."
          description="Passionate about creating fast, accessible and production-ready web applications."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <AboutVisual />
          </motion.div>

          <motion.div
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <AboutContent />
          </motion.div>
        </div>

        <AboutStats />
      </Container>
    </section>
  );
}