"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Globe, MapPin } from "lucide-react";

import TechBadge from "@/components/shared/TechBadge";
import { aboutContent } from "@/data/about";

export default function AboutVisual() {
  return (
    <motion.div
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
        },
      }}
      className="
        rounded-3xl
        border
        border-border
        bg-card/60
        p-8
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-primary/30
        hover:shadow-2xl
      "
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold">
            Ahmed Nakib
          </h3>

          <p className="mt-2 text-muted-foreground">
            Full Stack Developer
          </p>
        </div>

        {/* Info */}
        <div className="space-y-4 border-y border-border py-6">
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-primary" />

            <span>{aboutContent.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <BadgeCheck className="size-4 text-emerald-500" />

            <span>{aboutContent.availability}</span>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="size-4 text-primary" />

            <span>{aboutContent.workType}</span>
          </div>
        </div>

        {/* Frontend */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Frontend
          </p>

          <div className="flex flex-wrap gap-2">
            {aboutContent.technologies.frontend.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Backend
          </p>

          <div className="flex flex-wrap gap-2">
            {aboutContent.technologies.backend.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        </div>

        {/* Database */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Database
          </p>

          <div className="flex flex-wrap gap-2">
            {aboutContent.technologies.database.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-6">
          <p className="text-sm leading-7 text-muted-foreground">
            Building scalable, modern and production-ready web applications
            with clean architecture and exceptional user experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
}