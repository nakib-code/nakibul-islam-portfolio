"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroVisual() {
  const { t } = useTranslation("common");

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl"
      />

      <div>
        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/60 p-2 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <video
              src="/videos/intro.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />

            {/* Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Available Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.5,
        }}
        className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md"
      >
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />

        {t("hero.availableForWork")}
      </motion.div>
    </motion.div>
  );
}