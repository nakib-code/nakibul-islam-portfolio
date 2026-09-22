"use client";

import Link from "next/link";
import { ArrowUpRight, GitBranch, Mail } from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { useTranslation } from "react-i18next";

const socials = [
  {
    id: "github",
    href: "https://github.com/nakibdev",
    icon: GitBranch,
    external: true,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/nakibdev/",
    icon: LiaLinkedin,
    external: true,
  },
  {
    id: "email",
    href: "mailto:office.nakib@gmail.com",
    icon: Mail,
    external: false,
  },
];

export default function ContactSocials() {
  const { t } = useTranslation("common");

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {socials.map((social) => {
        const Icon = social.icon;

        return (
          <Link
            key={social.id}
            href={social.href}
            target={social.external ? "_blank" : undefined}
            rel={social.external ? "noreferrer" : undefined}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4.5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {t(`contact.socials.${social.id}.label`)}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t(`contact.socials.${social.id}.description`)}
                </p>
              </div>
            </div>

            <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        );
      })}
    </div>
  );
}