"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/nakib-code",
    icon: FaGithub,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nakibdev/",
    icon: FaLinkedinIn,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:office.nakib@gmail.com",
    icon: Mail,
  },
];

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="relative overflow-hidden border-border">
      {/* Subtle primary glow */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Main Footer */}
        <div className="grid min-h-[560px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* ================= IMAGE ================= */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative flex h-[430px] items-end justify-center lg:h-[560px] lg:justify-start"
          >
            {/* Soft primary glow */}
            <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

            {/* Image */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 h-full w-full"
            >
              <Image
                src="/footer.png"
                alt="Nakibul Islam"
                fill
                priority
                className="object-contain object-bottom"
              />
            </motion.div>
          </motion.div>

          {/* ================= CONTENT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="pb-12 lg:pb-0"
          >
            {/* Small label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />

              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {t("contact.badge")}
              </span>
            </div>

            {/* Main heading */}
            <h2 className="font-heading text-[clamp(4rem,9vw,8rem)] font-bold uppercase leading-[0.82] tracking-[-0.06em]">
              {t("footer.titleLineOne")}
              <br />
              <span className="text-primary">
                {t("footer.titleLineTwo")}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              {t("footer.description")}
            </p>

            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground/70">
              {t("footer.descriptionTwo")}
            </p>

            {/* CTA */}
            <Link
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 border-b border-primary/40 pb-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              {t("footer.button")}

              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-border/70 py-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Brand */}
            <div>
              <p className="font-heading text-lg font-bold">
                Nakibul<span className="text-primary">.dev</span>
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {t("footer.role")}
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.id}
                    href={social.href}
                    target={social.id !== "email" ? "_blank" : undefined}
                    rel={
                      social.id !== "email"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={social.label}
                    className="text-muted-foreground transition-colors duration-300 hover:text-primary"
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                );
              })}
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>© 2026 Ahmed Nakib</span>

              <span className="text-border">•</span>

              <span>{t("footer.builtWith")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
