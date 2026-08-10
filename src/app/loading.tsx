"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/20 border-t-primary"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
            className="font-heading text-2xl font-bold text-primary"
          >
            AN
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.p
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="mt-6 text-sm font-medium tracking-[0.25em] text-muted-foreground uppercase"
        >
          Loading Portfolio...
        </motion.p>
      </div>
    </main>
  );
}