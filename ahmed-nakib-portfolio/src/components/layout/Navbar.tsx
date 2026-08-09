import Link from "next/link";

import Container from "./Container";
import MobileNav from "./MobileNav";
import { navigationItems } from "@/data/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group font-heading text-xl font-bold tracking-tight"
          >
            Ahmed
            <span className="text-primary transition-colors group-hover:text-primary/80">
              .
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Resume */}
            <Link
              href="/resume"
              className="ml-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              Resume
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileNav />
          </div>
        </nav>
      </Container>
    </header>
  );
}