"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const hearts = [
  { left: "8%", delay: 0, duration: 5, size: 12 },
  { left: "18%", delay: 1.2, duration: 6, size: 10 },
  { left: "30%", delay: 0.6, duration: 5.5, size: 14 },
  { left: "45%", delay: 1.8, duration: 6, size: 9 },
  { left: "58%", delay: 0.8, duration: 5, size: 12 },
  { left: "72%", delay: 2, duration: 6.5, size: 10 },
  { left: "84%", delay: 1, duration: 5.5, size: 13 },
  { left: "94%", delay: 2.5, duration: 6, size: 9 },
];

const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/nakib-code",
    icon: FaGithub,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nakibdev/",
    icon: FaLinkedinIn,
    external: true,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:office.nakib@gmail.com",
    icon: Mail,
    external: false,
  },
];

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="relative overflow-hidden border-t border-border ">

      {/* Floating Hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hearts.map((heart, index) => (
          <motion.div
            key={index}
            className="absolute bottom-[-30px] text-primary/20"
            style={{
              left: heart.left,
            }}
            initial={{
              y: 0,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              y: -420,
              opacity: [0, 0.7, 0.4, 0],
              scale: [0.6, 1, 0.8, 0.5],
              x: [0, index % 2 === 0 ? 18 : -18, 0],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <Heart
              style={{
                width: heart.size,
                height: heart.size,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Heart */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto mb-7 flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_0_40px_rgba(99,102,241,0.15)]"
          >
            <Heart className="size-6" fill="currentColor" />
          </motion.div>

          {/* Badge */}
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t("contact.badge")}
          </span>

          {/* Heading */}
          <h2 className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("footer.titleLineOne")}
            <span className="block text-primary">
              {t("footer.titleLineTwo")}
            </span>
          </h2>

          {/* Message */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("footer.description")}
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            {t("footer.descriptionTwo")}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-9"
          >
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            >
              {t("footer.button")}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="mx-auto mt-20 flex max-w-3xl items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <Heart
            className="size-4 text-primary/60"
            fill="currentColor"
          />

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="font-heading text-lg font-bold">
              Nakibul<span className="text-primary">.dev</span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("footer.role")}
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <Link
                  key={social.id}
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={
                    social.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>© 2026 Ahmed Nakib</span>

            <span>•</span>

            <span className="flex items-center gap-1">
              {t("footer.builtWith")}
              <Heart
                className="size-3 text-primary"
                fill="currentColor"
              />
            </span>
          </div>
        </motion.div>

        {/* Back To Top */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        />
      </div>
    </footer>
  );
}