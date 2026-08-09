import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";

import { heroContent } from "@/data/hero";

export default function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={heroContent.primaryAction.href}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
      >
        {heroContent.primaryAction.label}
        <ArrowUpRight className="size-4" />
      </Link>

      <Link
        href={heroContent.secondaryAction.href}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent"
      >
        <Download className="size-4" />
        {heroContent.secondaryAction.label}
      </Link>
    </div>
  );
}