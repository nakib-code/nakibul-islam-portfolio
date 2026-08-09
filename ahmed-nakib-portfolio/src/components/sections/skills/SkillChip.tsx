"use client";

import { motion } from "framer-motion";

interface SkillChipProps {
  skill: string;
}

export default function SkillChip({ skill }: SkillChipProps) {
  return (
    <motion.span
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        inline-flex
        items-center
        rounded-full
        border
        border-border
        bg-background/60
        px-3
        py-1.5
        text-sm
        font-medium
        text-muted-foreground
        backdrop-blur
        transition-all
        duration-300
        hover:border-primary/40
        hover:bg-primary/10
        hover:text-primary
      "
    >
      {skill}
    </motion.span>
  );
}