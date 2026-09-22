"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import Container from "./Container";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";

import { navigationItems } from "@/data/navigation";
import useActiveSection from "@/hooks/useActiveSection";

export default function Navbar() {
  const activeSection = useActiveSection();
  const { t } = useTranslation("common");

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-tight transition-colors hover:text-primary"
          >
            Nakibul<span className="text-primary">.dev</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => {
              const isSection = item.type === "section";

              const sectionId = isSection
                ? item.href.replace("#", "")
                : "";

              const isActive =
                isSection && activeSection === sectionId;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`nav.${item.key}`)}

                  {/* Active Indicator */}
                  {isSection && (
                    <span
                      className={`absolute -bottom-1 left-3 right-3 h-0.5 origin-center rounded-full bg-primary transition-all duration-300 ${
                        isActive
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                      }`}
                    />
                  )}
                </Link>
              );
            })}

            {/* Language */}
            <div className="ml-2">
              <LanguageToggle />
            </div>

            {/* Theme */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Website Store CTA */}
            <Link
              href="/templates"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {t("nav.websiteStore")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <MobileNav />
          </div>
        </nav>
      </Container>
    </header>
  );
}