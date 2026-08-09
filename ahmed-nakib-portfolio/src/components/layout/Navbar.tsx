import Link from "next/link";

import Container from "./Container";
import MobileNav from "./MobileNav";
import { navigationItems } from "@/data/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <Container>
        <nav
          aria-label="Main navigation"
          className="flex h-16 items-center justify-between"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight"
          >
            Ahmed<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <ThemeToggle />

            <Link
              href="/resume"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
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