"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import type { ExperienceItem as ExperienceItemType } from "@/data/experience";

interface ExperienceItemProps {
  item: ExperienceItemType;
  index: number;
}

export default function ExperienceItem({
  item,
  index,
}: ExperienceItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 50,
        x: isLeft ? -30 : 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.7,
        delay: 0.05,
        ease: "easeOut",
      }}
      className="
        relative
        pl-10
        md:pl-0
      "
    >
      {/* =========================================
          TIMELINE DOT
      ========================================= */}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{
          scale: 1,
          opacity: 1,
        }}
        viewport={{
          once: true,
          amount: 0.5,
        }}
        transition={{
          duration: 0.4,
          delay: 0.15,
        }}
        className="
          absolute
          left-3.5
          top-2
          flex
          size-4
          -translate-x-1/2
          items-center
          justify-center
          rounded-full
          border
          border-primary/40
          bg-background
          md:left-1/2
        "
      >
        <span
          className={`size-1.5 rounded-full ${
            item.current
              ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.9)]"
              : "bg-muted-foreground/50"
          }`}
        />
      </motion.div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div
        className={`md:w-[calc(50%-3rem)] ${
          isLeft ? "md:mr-auto" : "md:ml-auto"
        }`}
      >
        <div
          className="
            group
            rounded-2xl
            border
            border-border
            bg-card/50
            p-5
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-1
            hover:border-primary/30
            hover:shadow-xl
            sm:p-6
          "
        >
          {/* Year + Current */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-primary">
              {item.year}
            </span>

            {item.current && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-emerald-500
                "
              >
                <CheckCircle2 className="size-3.5" />

                Current
              </span>
            )}
          </div>

          {/* Title */}

          <h3
            className="
              mt-4
              font-heading
              text-xl
              font-bold
              tracking-tight
              sm:text-2xl
            "
          >
            {item.title}
          </h3>

          {/* Organization */}

          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {item.organization}
          </p>

          {/* Description */}

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {item.description}
          </p>

          {/* Technologies */}

          <div className="mt-5 flex flex-wrap gap-2">
            {item.technologies.map((technology) => (
              <span
                key={technology}
                className="
                  rounded-full
                  border
                  border-border
                  bg-background/60
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-muted-foreground
                  transition-colors
                  duration-200
                  group-hover:border-primary/20
                  group-hover:text-foreground
                "
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}