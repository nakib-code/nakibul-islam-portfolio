"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProjectFeaturesProps {
  features: string[];
  projectKey: string;
}

export default function ProjectFeatures({
  features,
  projectKey,
}: ProjectFeaturesProps) {
  const { t } = useTranslation("common");

  return (
    <div className="mt-6 space-y-3">
      {features.map((_, index) => (
        <div
          key={`${projectKey}-${index}`}
          className="flex items-start gap-3"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

          <span className="text-sm leading-6 text-muted-foreground">
            {t(
              `projects.items.${projectKey}.features.${index}`,
            )}
          </span>
        </div>
      ))}
    </div>
  );
}