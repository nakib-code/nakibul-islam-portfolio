import {
  Code2,
  Server,
  Database,
  Wrench,
} from "lucide-react";

export const skillsContent = {
  badge: "Core Skills",

  title: "Technologies I use to build modern web applications.",

  description:
    "My core technology stack for building scalable, maintainable, and production-ready applications.",

  categories: [
    {
      title: "Frontend",
      icon: Code2,
      description:
        "Building fast, modern and interactive user interfaces.",

      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Shadcn UI",
        "Redux Toolkit",
        "TanStack Query",
        "React Hook Form",
        "Zod",
      ],
    },

    {
      title: "Backend",
      icon: Server,
      description:
        "Developing secure and scalable server-side applications.",

      skills: [
        "Node.js",
        "Express.js",
        "REST API",
        "NextAuth",
        "JWT",
        "Prisma ORM",
        "Cloudinary",
      ],
    },

    {
      title: "Database",
      icon: Database,
      description:
        "Designing reliable and efficient database architectures.",

      skills: [
        "MongoDB",
        "Mongoose",
        "PostgreSQL",
        "Prisma",
      ],
    },

    {
      title: "Tools",
      icon: Wrench,
      description:
        "Daily tools for professional development workflow.",

      skills: [
        "Git",
        "GitHub",
        "VS Code",
        "Postman",
        "Vercel",
        "Figma",
        "npm",
      ],
    },
  ],
};