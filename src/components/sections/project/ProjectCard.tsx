"use client";

import { useState } from "react";
import { motion , type Variants} from "framer-motion";

import ProjectFeatures from "./ProjectFeatures";
import ProjectImage from "./ProjectImage";
import ProjectLinks from "./ProjectLinks";
import ProjectModal from "./ProjectModal";
import ProjectStatus from "./ProjectStatus";
import ProjectTechStack from "./ProjectTechStack";

import { Project } from "@/type/project";

interface ProjectCardProps {
  project: Project;
  reverse?: boolean;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function ProjectCard({
  project,
  reverse = false,
}: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.article
        variants={cardVariants}
        whileHover={{
          y: -6,
        }}
        transition={{
          duration: 0.25,
        }}
        className={`
          grid
          items-center
          gap-12
          lg:grid-cols-2
          ${reverse ? "lg:[&>*:first-child]:order-2" : ""}
        `}
      >
        {/* Project Image */}
        <ProjectImage
          images={project.images}
          title={project.title}
          onViewCaseStudy={() => setIsModalOpen(true)}
        />

        {/* Project Content */}
        <div>
          <ProjectStatus status={project.status} />

          <h3 className="mt-6 font-heading text-4xl font-bold tracking-tight">
            {project.title}
          </h3>

          <p className="mt-3 text-lg font-medium text-primary">
            {project.shortDescription}
          </p>

          <p className="mt-6 leading-8 text-muted-foreground">
            {project.description}
          </p>

          <ProjectTechStack technologies={project.technologies} />

          <ProjectFeatures features={project.features} />

          <ProjectLinks
            github={project.links.github}
            live={project.links.live}
          />
        </div>
      </motion.article>

      {/* Project Case Study Modal */}
      <ProjectModal
        project={project}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}