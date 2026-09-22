export type ExperienceItem = {
  id: string;
  year: string;
  technologies: string[];
  current?: boolean;
};

export const experienceContent = {
  items: [
    {
      id: "web-development",
      year: "2024",
      technologies: ["HTML", "CSS", "JavaScript"],
    },

    {
      id: "full-stack-development",
      year: "2025",
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "REST API",
      ],
    },

    {
      id: "advanced-full-stack",
      year: "2025",
      technologies: [
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "JWT",
        "Payment Gateway",
      ],
    },

    {
      id: "nextjs-development",
      year: "2026",
      technologies: [
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "TanStack Query",
      ],
    },

    {
      id: "production-products",
      year: "2026",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
      ],
      current: true,
    },
  ],
};