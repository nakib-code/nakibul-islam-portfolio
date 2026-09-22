import {
  Code2,
  ShoppingCart,
  Layers3,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  technologies: string[];
}

export const servicesContent = {
  services: [
    {
      id: "custom-website",
      icon: Code2,
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
      ],
    },
    {
      id: "ecommerce",
      icon: ShoppingCart,
      technologies: [
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Prisma",
      ],
    },
    {
      id: "full-stack",
      icon: Layers3,
      technologies: [
        "Next.js",
        "Node.js",
        "Express.js",
        "PostgreSQL",
      ],
    },
    {
      id: "redesign-fixing",
      icon: Wrench,
      technologies: [
        "React",
        "Next.js",
        "JavaScript",
        "Tailwind CSS",
      ],
    },
  ],
} satisfies {
  services: Service[];
};