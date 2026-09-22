"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h1
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="font-heading text-8xl font-bold text-primary md:text-9xl"
        >
          404
        </motion.h1>

        <h2 className="mt-8 font-heading text-3xl font-bold md:text-5xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-1"
          >
            <Home className="size-4" />
            Back Home
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </main>
  );
}