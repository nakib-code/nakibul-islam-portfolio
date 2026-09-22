"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutContent() {
  const { t } = useTranslation("common");

  const focusItems = [
    t("about.focus.0"),
    t("about.focus.1"),
    t("about.focus.2"),
    t("about.focus.3"),
  ];

  return (
    <div className="flex flex-col justify-center">
      {/* Story */}
      <p className="text-lg leading-8 text-muted-foreground">
        {t("about.story")}
      </p>

      {/* Mission */}
      <p className="mt-6 text-base leading-7 text-muted-foreground">
        {t("about.mission")}
      </p>

      {/* Focus Areas */}
      <div className="mt-10">
        <h3 className="mb-5 text-lg font-semibold">
          {t("about.focusTitle")}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {focusItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4"
            >
              <CheckCircle2 className="size-5 shrink-0 text-primary" />

              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}