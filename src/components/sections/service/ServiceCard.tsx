"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import TechBadge from "@/components/shared/TechBadge";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  const { t } = useTranslation("common");

  const Icon = service.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: {
          duration: 0.25,
        },
      }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-2xl sm:p-8"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        {/* Icon */}
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background/70 text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10">
            <Icon className="size-6" />
          </div>

          <div className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:text-primary">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-7">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t(`services.items.${service.id}.title`)}
          </h3>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {t(
              `services.items.${service.id}.description`,
            )}
          </p>
        </div>

        {/* Technologies */}
        <div className="mt-7 border-t border-border pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t("services.technologies")}
          </p>

          <div className="flex flex-wrap gap-2">
            {service.technologies.map((technology) => (
              <TechBadge key={technology}>
                {technology}
              </TechBadge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}