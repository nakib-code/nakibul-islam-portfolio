"use client";

import { useRef } from "react";

import Image from "next/image";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import { experienceContent } from "@/data/experience";

import ExperienceItem from "./ExperienceItem";

export default function ExperienceTimeline() {
  const timelineRef =
    useRef<HTMLDivElement>(null);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });

  // Timeline Line
  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"],
  );

  // Rocket Position
  const rocketTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"],
  );

  // Rocket Scale
  const rocketScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5, 0.9, 1],
    [0.9, 1, 1.05, 1, 1.05],
  );

  // Rocket Glow
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5, 1],
    [0.2, 0.8, 1, 0.8],
  );

  return (
    <div
      ref={timelineRef}
      className="relative mt-16"
    >
      {/* Base Timeline */}
      <div
        className="
          absolute
          bottom-0
          left-3.5
          top-0
          w-px
          bg-border
          md:left-1/2
          md:-translate-x-1/2
        "
      />

      {/* Animated Timeline */}
      <motion.div
        style={{
          height: lineHeight,
        }}
        className="
          pointer-events-none
          absolute
          left-3.5
          top-0
          z-10
          w-px
          origin-top
          bg-gradient-to-b
          from-primary
          via-primary/80
          to-primary/30
          shadow-[0_0_14px_hsl(var(--primary)/0.7)]
          md:left-1/2
          md:-translate-x-1/2
        "
      />

      {/* Rocket */}
      <motion.div
        style={{
          top: rocketTop,
          scale: rocketScale,
        }}
        className="
          pointer-events-none
          absolute
          left-3.5
          z-50
          -translate-x-1/2
          -translate-y-1/2
          md:left-1/2
        "
      >
        {/* Glow */}
        <motion.div
          style={{
            opacity: glowOpacity,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            size-16
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/20
            blur-2xl
          "
        />

        {/* Rocket */}
        <div className="relative flex size-11 items-center justify-center">
          <Image
            src="/images/rocket.png"
            alt="Timeline rocket"
            width={44}
            height={44}
            priority
            className="
              relative
              z-20
              size-11
              object-contain
              drop-shadow-[0_0_12px_hsl(var(--primary)/0.9)]
            "
          />
        </div>

        {/* Flame */}
        <motion.div
          animate={{
            scaleY: [0.7, 1.2, 0.8, 1],
            opacity: [0.5, 1, 0.6, 1],
          }}
          transition={{
            duration: 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[34px]
            z-10
            h-6
            w-2
            -translate-x-1/2
            origin-top
            rounded-full
            bg-gradient-to-b
            from-primary
            via-primary/60
            to-transparent
            blur-[1px]
          "
        />

        {/* Flame Core */}
        <motion.span
          animate={{
            scale: [0.7, 1, 0.75],
            opacity: [0.5, 1, 0.6],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[35px]
            z-10
            h-4
            w-1
            -translate-x-1/2
            rounded-full
            bg-primary
            blur-[1px]
          "
        />

        {/* Particle 1 */}
        <motion.span
          animate={{
            y: [0, 8, 16],
            opacity: [0.7, 0.4, 0],
            scale: [1, 0.8, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="
            absolute
            left-1/2
            top-[42px]
            size-1
            -translate-x-1/2
            rounded-full
            bg-primary
          "
        />

        {/* Particle 2 */}
        <motion.span
          animate={{
            y: [0, 8, 16],
            opacity: [0.6, 0.3, 0],
            scale: [1, 0.7, 0.3],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="
            absolute
            left-[38%]
            top-[42px]
            size-1
            rounded-full
            bg-primary/70
          "
        />

        {/* Particle 3 */}
        <motion.span
          animate={{
            y: [0, 6, 13],
            opacity: [0.6, 0.3, 0],
            scale: [1, 0.7, 0.3],
          }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            delay: 0.3,
            ease: "easeOut",
          }}
          className="
            absolute
            left-[62%]
            top-[42px]
            size-1
            rounded-full
            bg-primary/70
          "
        />
      </motion.div>

      {/* Experience Items */}
      <div className="relative space-y-10 md:space-y-16">
        {experienceContent.items.map(
          (item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              index={index}
            />
          ),
        )}
      </div>
    </div>
  );
}