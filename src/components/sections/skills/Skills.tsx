"use client";

import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import SkillsTerminal from "./SkillsTerminal";

export default function Skills() {
  const { t } = useTranslation("common");

  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Primary Glow */}
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Secondary Glow */}
        <div className="absolute bottom-0 left-0 h-[450px] w-[450px] -translate-x-1/3 rounded-full bg-primary/5 blur-[130px]" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge={t("skills.badge")}
          title={t("skills.title")}
          description={t("skills.description")}
        />

        {/* Skills Terminal */}
        <div className="mt-12 sm:mt-16">
          <SkillsTerminal />
        </div>
      </Container>
    </section>
  );
}