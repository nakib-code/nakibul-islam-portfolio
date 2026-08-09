"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ThemeToggle from "@/components/shared/ThemeToggle";
import { navigationItems } from "@/data/navigation";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[360px]">
        <SheetHeader>
          <SheetTitle className="font-heading text-left text-xl">
            Ahmed<span className="text-primary">.</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <div className="my-4 h-px bg-border" />

          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-medium">Theme</span>

            <ThemeToggle />
          </div>

          <Link
            href="/resume"
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Download Resume
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}