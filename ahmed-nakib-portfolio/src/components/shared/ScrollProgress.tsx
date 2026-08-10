"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="
          fixed
          left-0
          top-0
          z-[999]
          h-1
          w-full
          origin-left
          bg-primary
        "
      />

      <motion.div
        style={{ scaleX }}
        className="
          fixed
          left-0
          top-0
          z-[998]
          h-2
          w-full
          origin-left
          bg-primary/30
          blur-md
        "
      />
    </>
  );
}