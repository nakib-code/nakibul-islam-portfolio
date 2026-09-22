"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import StatCard from "@/components/shared/StatCard";
import { aboutContent } from "@/data/about";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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
      className="relative mt-20 overflow-hidden rounded-3xl border border-border/80 bg-card/30"
    >
      {/* Top label */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 sm:px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {t("about.stats.clean")}
        </span>

        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {t("about.stats.architecture")}
        </span>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {aboutContent.stats.map((stat, index) => (
          <div
            key={stat.labelKey}
            className={[
              "relative",
              index !== 0 ? "border-t border-border/70 sm:border-l sm:border-t-0" : "",
              index === 2 ? "xl:border-l" : "",
              index === 3 ? "xl:border-l" : "",
            ].join(" ")}
          >
            <StatCard
              value={
                stat.value ??
                t(`about.stats.${stat.valueKey}`)
              }
              label={t(`about.stats.${stat.labelKey}`)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}