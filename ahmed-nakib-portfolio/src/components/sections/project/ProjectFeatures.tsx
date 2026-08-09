"use client";

import { CheckCircle2 } from "lucide-react";

interface ProjectFeaturesProps {
  features: string[];
}

export default function ProjectFeatures({
  features,
}: ProjectFeaturesProps) {
  return (
    <div className="mt-6 space-y-3">
      {features.map((feature) => (
        <div
          key={feature}
          className="flex items-start gap-3"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

          <span className="text-sm leading-6 text-muted-foreground">
            {feature}
          </span>
        </div>
      ))}
    </div>
  );
}