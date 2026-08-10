import { CheckCircle2 } from "lucide-react";

import { aboutContent } from "@/data/about";

export default function AboutContent() {
  return (
    <div className="flex flex-col justify-center">
      {/* Story */}
      <p className="text-lg leading-8 text-muted-foreground">
        {aboutContent.story}
      </p>

      {/* Mission */}
      <p className="mt-6 text-base leading-7 text-muted-foreground">
        {aboutContent.mission}
      </p>

      {/* Focus Areas */}
      <div className="mt-10">
        <h3 className="mb-5 text-lg font-semibold">
          What I Focus On
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {aboutContent.focus.map((item) => (
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