"use client";

import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";

interface Props {
  github: string;
  live: string;
}

export default function ProjectLinks({
  github,
  live,
}: Props) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-muted"
      >
        <GitBranch className="size-4" />
        GitHub
      </Link>

      <Link
        href={live}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:scale-[1.02]"
      >
        Live Demo

        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}