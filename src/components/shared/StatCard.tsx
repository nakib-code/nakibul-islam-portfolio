"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({
  value,
  label,
}: StatCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.4,
      }}
      transition={{
        duration: 0.5,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="
        group
        rounded-3xl
        border
        border-border
        bg-card/60
        p-6
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-primary/40
        hover:shadow-2xl
      "
    >
      <h3 className="text-4xl font-bold text-primary transition-transform duration-300 group-hover:scale-105">
        {value}
      </h3>

      <p className="mt-3 text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}