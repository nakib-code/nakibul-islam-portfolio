"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Database,
  GitBranch,
  Terminal,
} from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: {
          y: 0,
        },
        hover: {
          y: -1,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl"
    >
      {/* Soft side glow */}
      <motion.div
        variants={{
          rest: {
            opacity: 0,
            x: 20,
          },
          hover: {
            opacity: 1,
            x: 0,
          },
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute -right-20 top-1/2 h-48 w-32 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Top-right glow */}
      <motion.div
        variants={{
          rest: {
            opacity: 0,
          },
          hover: {
            opacity: 0.8,
          },
        }}
        transition={{
          duration: 0.35,
        }}
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/[0.08] blur-3xl"
      />

      {/* Top */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.div
          variants={{
            rest: {
              scale: 1,
              borderColor: "var(--border)",
            },
            hover: {
              scale: 1.04,
              borderColor: "rgba(141,82,254,.4)",
            },
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 20,
          }}
          className="flex size-11 items-center justify-center rounded-2xl border bg-background/70 text-primary"
        >
          <Icon className="size-5" />
        </motion.div>

        <motion.div
          variants={{
            rest: {
              opacity: 0.25,
              x: 0,
            },
            hover: {
              opacity: 0.8,
              x: 2,
            },
          }}
          transition={{
            duration: 0.25,
          }}
          className="text-muted-foreground"
        >
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-7">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Visual */}
      <div className="relative z-10 mt-7 overflow-hidden rounded-2xl border border-border/70 bg-background/50">
        {index === 0 && <CleanCodeVisual />}
        {index === 1 && <ProductVisual />}
        {index === 2 && <RealWorldVisual />}
        {index === 3 && <LearningVisual />}
      </div>

      {/* Bottom accent */}
      <motion.div
        variants={{
          rest: {
            opacity: 0.2,
            scaleX: 0.12,
          },
          hover: {
            opacity: 0.8,
            scaleX: 0.55,
          },
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="absolute bottom-0 left-1/2 h-px w-full origin-center -translate-x-1/2 bg-primary"
      />

      {/* Right edge light */}
      <motion.div
        variants={{
          rest: {
            opacity: 0,
            scaleY: 0.2,
          },
          hover: {
            opacity: 0.75,
            scaleY: 1,
          },
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="absolute right-0 top-8 h-[calc(100%-4rem)] w-px origin-center bg-primary"
      />
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 — Clean Code */
/* -------------------------------------------------------------------------- */

function CleanCodeVisual() {
  return (
    <div className="relative h-36 p-5">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-primary/70" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/20" />

        <span className="ml-auto font-mono text-[9px] text-muted-foreground">
          component.tsx
        </span>
      </div>

      <div className="mt-5 space-y-2 font-mono text-[10px]">
        <div className="flex gap-4">
          <span className="w-3 text-muted-foreground/40">01</span>

          <span className="text-muted-foreground">
            <span className="text-primary">const</span>{" "}
            component ={" "}
            <span className="text-foreground">reusable</span>
          </span>
        </div>

        <div className="flex gap-4">
          <span className="w-3 text-muted-foreground/40">02</span>

          <span className="text-muted-foreground">
            <span className="text-primary">return</span>{" "}
            cleanStructure
          </span>
        </div>

        <div className="flex gap-4">
          <span className="w-3 text-muted-foreground/40">03</span>

          <span className="text-muted-foreground/70">
            {"// simple > clever"}
          </span>
        </div>
      </div>

      <motion.div
        variants={{
          rest: {
            x: "-120%",
            opacity: 0,
          },
          hover: {
            x: "500%",
            opacity: 1,
          },
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — Product Minded */
/* -------------------------------------------------------------------------- */

function ProductVisual() {
  const items = [
    {
      label: "USER",
      icon: Braces,
    },
    {
      label: "API",
      icon: GitBranch,
    },
    {
      label: "DATA",
      icon: Database,
    },
  ];

  return (
    <div className="flex h-36 items-center justify-center px-4">
      {items.map((item, index) => {
        const ItemIcon = item.icon;

        return (
          <div key={item.label} className="flex items-center">
            <motion.div
              variants={{
                rest: {
                  y: 0,
                  borderColor: "var(--border)",
                },
                hover: {
                  y: -2,
                  borderColor: "rgba(141,82,254,.4)",
                },
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="flex h-16 w-[72px] flex-col items-center justify-center gap-2 rounded-xl border bg-card/70"
            >
              <ItemIcon className="size-4 text-primary" />

              <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
                {item.label}
              </span>
            </motion.div>

            {index !== items.length - 1 && (
              <motion.div
                variants={{
                  rest: {
                    opacity: 0.15,
                    scaleX: 0.5,
                  },
                  hover: {
                    opacity: 0.7,
                    scaleX: 1,
                  },
                }}
                transition={{
                  delay: index * 0.12,
                }}
                className="mx-2 h-px w-6 origin-left bg-primary"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 — Real World */
/* -------------------------------------------------------------------------- */

function RealWorldVisual() {
  const checks = [
    "authenticated",
    "validated",
    "payment verified",
    "order created",
  ];

  return (
    <div className="h-36 p-5">
      <div className="flex items-center gap-2 font-mono text-[9px]">
        <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
          POST
        </span>

        <span className="text-muted-foreground">
          /api/orders
        </span>

        <Terminal className="ml-auto size-3.5 text-muted-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
        {checks.map((item, index) => (
          <motion.div
            key={item}
            variants={{
              rest: {
                opacity: 0.5,
                x: 0,
              },
              hover: {
                opacity: 1,
                x: 2,
              },
            }}
            transition={{
              delay: index * 0.07,
            }}
            className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground"
          >
            <span className="text-primary">✓</span>
            {item}
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={{
          rest: {
            opacity: 0.45,
          },
          hover: {
            opacity: 1,
          },
        }}
        className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[9px]"
      >
        <span className="text-muted-foreground">response</span>

        <span className="text-primary">200 OK</span>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — Always Learning */
/* -------------------------------------------------------------------------- */

function LearningVisual() {
  const technologies = [
    "React",
    "Next.js",
    "TypeScript",
  ];

  return (
    <div className="relative h-36 overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
          PROGRESS
        </span>

        <span className="font-mono text-[9px] text-primary">
          2024 → 2026
        </span>
      </div>

      <div className="relative mt-8 h-px bg-border">
        <motion.div
          variants={{
            rest: {
              left: "0%",
            },
            hover: {
              left: "92%",
            },
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_rgba(141,82,254,.7)]"
        />
      </div>

      <div className="mt-5 flex justify-between">
        {technologies.map((technology) => (
          <span
            key={technology}
            className="font-mono text-[9px] text-muted-foreground"
          >
            {technology}
          </span>
        ))}
      </div>
    </div>
  );
}