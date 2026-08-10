"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroVisual() {
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

      {/* Floating Photo */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.03,
          rotate: 1,
        }}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/60 p-2 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image
              src="/images/profile.png"
              alt="Nakibul Islam - Full Stack Developer"
              fill
              priority
              sizes="(max-width:768px) 90vw, 420px"
              className="object-cover"
            />

            {/* Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Info */}
            <div className="absolute bottom-5 left-5">
              <h3 className="text-xl font-bold text-white">
                Nakibul Islam
              </h3>

              <p className="mt-1 text-sm text-white/80">
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next.js Badge */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-5 top-12 hidden rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md sm:block"
      >
        Next.js
      </motion.div>

      {/* TypeScript Badge */}
      <motion.div
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-5 bottom-24 hidden rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md sm:block"
      >
        TypeScript
      </motion.div>

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
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        Available for Work
      </motion.div>
    </motion.div>
  );
}