"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import StatCard from "@/components/shared/StatCard";
import { aboutContent } from "@/data/about";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function AboutStats() {
  const { t } = useTranslation("common");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.3,
      }}
      className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {aboutContent.stats.map((stat) => (
        <StatCard
          key={stat.labelKey}
          value={stat.value ?? t(`about.stats.${stat.valueKey}`)}
          label={t(`about.stats.${stat.labelKey}`)}
        />
      ))}
    </motion.div>
  );
}