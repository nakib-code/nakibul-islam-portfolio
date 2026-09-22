"use client";

import { useTranslation } from "react-i18next";

interface ProjectStatusProps {
  status: "Production Ready" | "In Progress";
}

export default function ProjectStatus({
  status,
}: ProjectStatusProps) {
  const { t } = useTranslation("common");

  const production =
    status === "Production Ready";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        production
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
          : "border border-amber-500/20 bg-amber-500/10 text-amber-500"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          production
            ? "bg-emerald-500"
            : "bg-amber-500"
        }`}
      />

      {t(
        production
          ? "projects.status.production"
          : "projects.status.progress"
      )}
    </span>
  );
}