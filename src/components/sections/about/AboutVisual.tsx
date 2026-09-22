"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Globe, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import TechBadge from "@/components/shared/TechBadge";
import { aboutContent } from "@/data/about";

export default function AboutVisual() {
  const { t } = useTranslation("common");

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
            Nakibul Islam
          </h3>

          <p className="mt-2 text-muted-foreground">
            {t("hero.title")}
          </p>
        </div>

        {/* Info */}
        <div className="space-y-4 border-y border-border py-6">
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-primary" />

            <span>{t("about.location")}</span>
          </div>

          <div className="flex items-center gap-3">
            <BadgeCheck className="size-4 text-emerald-500" />

            <span>{t("about.availability")}</span>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="size-4 text-primary" />

            <span>{t("about.workType")}</span>
          </div>
        </div>

        {/* Frontend */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("about.frontend")}
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
            {t("about.backend")}
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
            {t("about.database")}
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
            {t("about.footer")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}