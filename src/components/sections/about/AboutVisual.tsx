"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Globe,
  MapPin,
  Terminal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import TechBadge from "@/components/shared/TechBadge";
import { aboutContent } from "@/data/about";

export default function AboutVisual() {
  const { t } = useTranslation("common");

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-xl"
      whileHover={{
        borderColor: "rgba(141, 82, 254, 0.28)",
        transition: {
          duration: 0.3,
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/20" />
            <span className="size-2 rounded-full bg-muted-foreground/10" />
          </div>
        </div>

        <Terminal className="size-4 text-muted-foreground/50" />
      </div>

      <div className="p-6 sm:p-7">
        {/* Profile */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {t("about.role")}
            </p>

            <h3 className="text-2xl font-bold tracking-tight">
              {t("about.name")}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("hero.title")}
            </p>
          </div>

          <motion.div
            whileHover={{
              rotate: 4,
              scale: 1.05,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.07] text-primary sm:flex"
          >
            <Terminal className="size-5" />
          </motion.div>
        </div>

        {/* Status */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <InfoItem
            icon={MapPin}
            text={t("about.location")}
          />

          <InfoItem
            icon={BadgeCheck}
            text={t("about.availability")}
            iconClassName="text-emerald-500"
          />

          <InfoItem
            icon={Globe}
            text={t("about.workType")}
          />
        </div>

        {/* Stack */}
        <div className="mt-8 space-y-6">
          <StackGroup
            label={t("about.frontend")}
            technologies={aboutContent.technologies.frontend}
          />

          <StackGroup
            label={t("about.backend")}
            technologies={aboutContent.technologies.backend}
          />

          <StackGroup
            label={t("about.database")}
            technologies={aboutContent.technologies.database}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-border/70 pt-5">
          <div className="flex items-start gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

            <p className="text-sm leading-7 text-muted-foreground">
              {t("about.footer")}
            </p>
          </div>
        </div>
      </div>

      {/* Very subtle edge detail */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-8 right-8 h-px origin-left bg-primary"
        initial={{
          scaleX: 0.08,
          opacity: 0.25,
        }}
        whileHover={{
          scaleX: 0.35,
          opacity: 0.65,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

function InfoItem({
  icon: Icon,
  text,
  iconClassName = "text-primary",
}: {
  icon: typeof MapPin;
  text: string;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 px-3.5 py-3">
      <Icon className={`mb-2 size-4 ${iconClassName}`} />

      <p className="text-xs leading-5 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function StackGroup({
  label,
  technologies,
}: {
  label: string;
  technologies: string[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>

        <span className="h-px flex-1 bg-border/60" />
      </div>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <TechBadge key={tech}>{tech}</TechBadge>
        ))}
      </div>
    </div>
  );
}