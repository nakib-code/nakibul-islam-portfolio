"use client";

import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import { heroContent } from "@/data/hero";

export default function HeroActions() {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={heroContent.primaryAction.href}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
      >
        {t("hero.viewProjects")}
        <ArrowUpRight className="size-4" />
      </Link>

      <Link
        href={heroContent.secondaryAction.href}
        download
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent"
      >
        <Download className="size-4" />
        {t("hero.downloadResume")}
      </Link>
    </div>
  );
}