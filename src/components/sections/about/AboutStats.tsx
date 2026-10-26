"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import StatCard from "@/components/shared/StatCard";
import { aboutContent } from "@/data/about";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
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

export default function AboutStats() {
  const { t } = useTranslation("common");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className="relative mt-20 overflow-hidden rounded-xl border border-border/70 bg-card/30"
    >
      {/* Top label */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 sm:px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {t("about.stats.clean")}
        </span>

        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("about.stats.architecture")}
        </span>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {aboutContent.stats.map((stat, index) => (
          <motion.div
            key={stat.labelKey}
            variants={item}
            whileHover={{
              y: -4,
              transition: {
                duration: 0.2,
              },
            }}
            className={[
              "group relative",
              "transition-colors duration-300",
              "hover:bg-primary/[0.03]",
              index !== 0
                ? "border-t border-border/70 sm:border-l sm:border-t-0"
                : "",
              index === 2 ? "xl:border-l" : "",
              index === 3 ? "xl:border-l" : "",
            ].join(" ")}
          >
            <StatCard
              value={
                stat.value ?? t(`about.stats.${stat.valueKey}`)
              }
              label={t(`about.stats.${stat.labelKey}`)}
            />

            {/* Minimal hover accent */}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
