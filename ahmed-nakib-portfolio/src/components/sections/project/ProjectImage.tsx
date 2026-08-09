"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectImageProps {
  images: string[];
  title: string;
  onViewCaseStudy: () => void;
}

const imageVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.08,
  },
};

const overlayVariants = {
  rest: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  hover: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function ProjectImage({
  images,
  title,
  onViewCaseStudy,
}: ProjectImageProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative overflow-hidden rounded-[28px] border border-border bg-card/60 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-2xl"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-20 -z-10 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Browser Header */}
      <div className="relative z-20 flex items-center gap-2 border-b border-border bg-background/70 px-5 py-3 backdrop-blur">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />

        <div className="ml-4 flex-1 truncate rounded-full border border-border bg-background/80 px-4 py-1 text-center text-xs text-muted-foreground">
          {title}
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div
          variants={imageVariants}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="h-full w-full"
        >
          <Image
            src={images[0]}
            alt={`${title} project preview`}
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
            className="object-cover"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

        {/* View Case Study */}
        <motion.div
          variants={overlayVariants}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="absolute bottom-5 left-5"
        >
          <button
            type="button"
            onClick={onViewCaseStudy}
            aria-label={`View ${title} case study`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-background/85 px-4 py-2 text-sm font-semibold text-foreground shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <span>View Case Study</span>

            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Shine */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </motion.div>
  );
}