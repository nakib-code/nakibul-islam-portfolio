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