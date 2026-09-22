"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px), linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="mx-auto max-w-xl text-center"
      >
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{
            duration: 0.8,
          }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card"
        >
          <RefreshCw className="size-10 text-primary" />
        </motion.div>

        <h1 className="mt-8 font-heading text-4xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-4 leading-8 text-muted-foreground">
          An unexpected error occurred while loading this page.
          Please try again or return to the homepage.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-1"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <Home className="size-4" />
            Back Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-10 rounded-xl border border-border bg-card p-4 text-left">
            <summary className="cursor-pointer font-medium">
              Error Details
            </summary>

            <pre className="mt-3 overflow-auto text-xs text-muted-foreground">
              {error.message}
            </pre>
          </details>
        )}
      </motion.div>
    </main>
  );
}