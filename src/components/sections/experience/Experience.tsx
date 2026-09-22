"use client";

import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ExperienceTimeline from "./ExperienceTimeline";

export default function Experience() {
  const { t } = useTranslation("common");

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


      <Container>
        <SectionHeading
          badge={t("experience.badge")}
          title={t("experience.title")}
          description={t("experience.description")}
        />

        <ExperienceTimeline />
      </Container>
    </section>
  );
}