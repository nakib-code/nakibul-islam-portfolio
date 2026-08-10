"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import { skillsContent } from "@/data/skills";

import SkillCategory from "./SkillCategory";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-10 h-[450px] w-[450px] rounded-full bg-primary/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Container>
        <SectionHeading
          badge={skillsContent.badge}
          title={skillsContent.title}
          description={skillsContent.description}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {skillsContent.categories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
            >
              <SkillCategory
                title={category.title}
                description={category.description}
                icon={category.icon}
                skills={category.skills}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}