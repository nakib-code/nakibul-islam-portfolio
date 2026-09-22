"use client";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { experienceContent } from "@/data/experience";
import ExperienceTimeline from "./ExperienceTimeline";

export default function Experience() {
  return (
    <section
      id="experience"
      className="
        relative
        scroll-mt-20
        overflow-hidden
        py-24
        sm:py-32
      "
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Primary Glow */}

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-primary/5
            blur-[140px]
          "
        />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container>
        <SectionHeading
          badge={experienceContent.badge}
          title={experienceContent.title}
          description={experienceContent.description}
        />

        <ExperienceTimeline />
      </Container>
    </section>
  );
}