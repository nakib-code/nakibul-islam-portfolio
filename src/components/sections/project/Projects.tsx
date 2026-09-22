"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import { projectsContent } from "@/data/projects";

import ProjectCard from "./ProjectCard";

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

export default function Projects() {
  const { t } = useTranslation("common");

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-28 lg:py-36"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px), linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container>
        <SectionHeading
          badge={t("projects.badge")}
          title={t("projects.title")}
          description={t("projects.description")}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-20 space-y-32"
        >
          {projectsContent.projects.map(
            (project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                reverse={index % 2 !== 0}
              />
            )
          )}
        </motion.div>
      </Container>
    </section>
  );
}