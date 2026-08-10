"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { heroContent } from "@/data/hero";
import HeroActions from "./HeroActions";
import HeroSocials from "./HeroSocials";

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
    y: 20,
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

export default function HeroContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl"
    >
      {/* Availability */}
      <motion.div
        variants={itemVariants}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
      >
        <span className="size-2 rounded-full bg-emerald-500" />
        {heroContent.badge}
      </motion.div>

      {/* Greeting */}
      <motion.p
        variants={itemVariants}
        className="mb-3 text-lg font-medium text-muted-foreground"
      >
        {heroContent.greeting}
      </motion.p>

      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
      >
        {heroContent.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
      >
        {heroContent.description}
      </motion.p>

      {/* Actions */}
      <motion.div variants={itemVariants} className="mt-8">
        <HeroActions />
      </motion.div>

      {/* Social Links */}
      <motion.div variants={itemVariants} className="mt-6">
        <HeroSocials />
      </motion.div>
    </motion.div>
  );
}