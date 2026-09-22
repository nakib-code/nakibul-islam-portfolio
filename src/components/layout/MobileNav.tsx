"use client";

import Link from "next/link";
import { Menu, ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { navigationItems } from "@/data/navigation";

export default function MobileNav() {
  const { t } = useTranslation("common");

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] sm:w-[360px]"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-left text-xl">
            Nakibul<span className="text-primary">.dev</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-2">
          {/* Navigation */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}

          {/* Website Store CTA */}
          <Link
            href="/templates"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {t("nav.websiteStore")}
            <ArrowRight className="size-4" />
          </Link>

          <div className="my-4 h-px bg-border" />

          {/* Language */}
          <div className="flex items-center justify-between rounded-lg px-4 py-3">
            <span className="text-sm font-medium">Language</span>

            <LanguageToggle />
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between rounded-lg px-4 py-3">
            <span className="text-sm font-medium">Theme</span>

            <ThemeToggle />
          </div>

          {/* Resume */}
          <Link
            href="/resume/Nakibul-Islam-Resume.pdf"
            target="_blank"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <FileText className="size-4" />
            {t("nav.resume")}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}