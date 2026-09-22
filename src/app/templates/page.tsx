"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock3, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center"
      >
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl">
          <Clock3 className="size-3.5 text-primary" />
          <span>Coming Soon</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Templates are
          <span className="block text-primary">coming soon.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          I&apos;m working on a collection of modern, responsive, and
          developer-friendly website templates. They&apos;ll be available here
          soon.
        </p>

        {/* Feature Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Feature
            icon={Code2}
            title="Modern"
            description="Clean & modern designs"
          />

          <Feature
            icon={Sparkles}
            title="Reusable"
            description="Easy to customize"
          />

          <Feature
            icon={Clock3}
            title="Coming Soon"
            description="Currently in development"
          />
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </motion.div>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Code2;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl">
      <Icon className="mx-auto mb-3 size-5 text-primary" />

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}