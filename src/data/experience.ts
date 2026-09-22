export type ExperienceItem = {
  year: string;
  title: string;
  organization: string;
  description: string;
  technologies: string[];
  current?: boolean;
};

export const experienceContent = {
  badge: "My Journey",
  title: "From learning to building production-ready applications.",
  description:
    "A continuous journey of learning, building, and improving as a Full Stack Developer.",

  items: [
    {
      year: "2024",
      title: "Started Web Development",
      organization: "Learning & Foundation",
      description:
        "Started my journey into web development by learning HTML, CSS, JavaScript, and the fundamentals of modern web development.",
      technologies: ["HTML", "CSS", "JavaScript"],
    },

    {
      year: "2025",
      title: "Full Stack Development",
      organization: "MERN & Backend Development",
      description:
        "Expanded into React, Node.js, Express.js, MongoDB, REST APIs, authentication, and full-stack application development.",
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "REST API",
      ],
    },

    {
      year: "2025",
      title: "Advanced Full Stack Projects",
      organization: "Real-world Applications",
      description:
        "Started building larger applications with authentication, dashboards, role-based access, database architecture, payments, and third-party integrations.",
      technologies: [
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "JWT",
        "Payment Gateway",
      ],
    },

    {
      year: "2026",
      title: "Next.js Full Stack Development",
      organization: "Modern Web Architecture",
      description:
        "Focused on building scalable production-ready applications with Next.js, TypeScript, PostgreSQL, MongoDB, TanStack Query, and modern UI systems.",
      technologies: [
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "TanStack Query",
      ],
    },

    {
      year: "2026",
      title: "Building Production-Ready Products",
      organization: "Current Focus",
      description:
        "Currently focused on creating polished, scalable products and strengthening my engineering skills to work professionally as a Full Stack Developer.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
      ],
      current: true,
    },
  ] satisfies ExperienceItem[],
};