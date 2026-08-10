"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import Container from "./Container";
import MobileNav from "./MobileNav";

import ThemeToggle from "@/components/shared/ThemeToggle";

import { navigationItems } from "@/data/navigation";
import useActiveSection from "@/hooks/useActiveSection";

export default function Navbar() {
  const activeSection = useActiveSection();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="#home"
            className="font-heading text-2xl font-bold tracking-tight transition-colors hover:text-primary"
          >
            Ahmed<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => {
              const isActive =
                activeSection === item.href.replace("#", "");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="ml-2">
              <ThemeToggle />
            </div>

            <Link
  href="/resume/Nakibul-Islam-Resume.pdf"
  target="_blank"
  className="ml-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  Resume
</Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileNav />
          </div>
        </nav>
      </Container>
    </header>
  );
}