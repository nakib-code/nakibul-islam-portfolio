"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutContent() {
  const { t } = useTranslation("common");

  const focusItems = [
    t("about.focus.0"),
    t("about.focus.1"),
    t("about.focus.2"),
  ];

  return (
    <div className="flex flex-col justify-center">
      {/* Story */}
      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        {t("about.story")}
      </p>

      {/* Mission */}
      <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
        {t("about.mission")}
      </p>

      {/* Focus */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-primary/60" />

          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            {t("about.focusTitle")}
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {focusItems.map((item) => (
            <div
              key={item}
              className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-card/30 p-4 transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.025]"
            >
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                <CheckCircle2 className="size-[18px] text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>

              <div className="flex gap-2">
                <span className="text-sm leading-6 text-foreground/90">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}