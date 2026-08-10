"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import SkillChip from "./SkillChip";

interface SkillCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  skills: string[];
}

export default function SkillCategory({
  title,
  description,
  icon: Icon,
  skills,
}: SkillCategoryProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
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
        <div className="absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="size-7" />
        </div>

        <h3 className="text-2xl font-semibold">
          {title}
        </h3>

        <p className="mt-3 leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <SkillChip
              key={skill}
              skill={skill}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}