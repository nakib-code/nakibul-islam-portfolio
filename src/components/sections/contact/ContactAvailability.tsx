"use client";

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Globe2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  {
    id: "fullTime",
    icon: BriefcaseBusiness,
  },
  {
    id: "freelance",
    icon: MessageCircle,
  },
  {
    id: "remote",
    icon: Globe2,
  },
];

export default function ContactAvailability() {
  const { t } = useTranslation("common");

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-xl sm:p-8">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:bg-primary/15" />

      <div className="relative">
        {/* Status */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>

          {t("contact.availability.status")}
        </div>

        <h3 className="mt-6 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {t("contact.availability.titleLineOne")}
          <br />
          <span className="text-primary">
            {t("contact.availability.titleLineTwo")}
          </span>
        </h3>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {t("contact.availability.description")}
        </p>

        {/* Availability */}
        <div className="mt-8 space-y-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {t(`contact.availability.items.${item.id}.title`)}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(`contact.availability.items.${item.id}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Location */}
        <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-4 text-primary" />

          {t("contact.availability.location")}
        </div>
      </div>
    </div>
  );
}