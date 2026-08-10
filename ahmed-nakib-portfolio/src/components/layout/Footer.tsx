"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { contactContent } from "@/data/contact";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="#"
              className="font-heading text-2xl font-bold tracking-tight"
            >
              Ahmed<span className="text-primary">.</span>
            </a>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Full Stack Developer focused on building fast, scalable,
              accessible, and user-friendly web applications with modern
              technologies.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={contactContent.socials[0].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <FaGithub className="size-4" />
              </a>

              <a
                href={contactContent.socials[1].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <FaLinkedinIn className="size-4" />
              </a>

              <a
                href={`mailto:${contactContent.email}`}
                aria-label="Email"
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold">
              Navigation
            </h3>

            <nav className="mt-4 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold">
              Let's Connect
            </h3>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Have a project or opportunity in mind?
            </p>

            <a
              href={`mailto:${contactContent.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {contactContent.email}
              <Mail className="size-4" />
            </a>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Nakibul Islam. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built with</span>
            <span className="font-medium text-foreground">
              Next.js
            </span>
            <span>·</span>
            <span className="font-medium text-foreground">
              TypeScript
            </span>
          </div>

          {/* Back To Top */}
          <a
            href="#"
            aria-label="Back to top"
            className="group flex size-9 items-center justify-center rounded-full border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}