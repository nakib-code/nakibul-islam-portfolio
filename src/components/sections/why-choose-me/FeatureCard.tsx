"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-card/60
        p-7
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-primary/40
        hover:shadow-[0_20px_60px_rgba(59,130,246,.15)]
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Icon */}
      <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary/20">
        <Icon className="size-7" />
      </div>

      {/* Title */}
      <h3 className="relative text-xl font-semibold">
        {title}
      </h3>

      {/* Description */}
      <p className="relative mt-4 leading-7 text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}