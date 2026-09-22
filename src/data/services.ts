import {
  Code2,
  ShoppingCart,
  Layers3,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  technologies: string[];
}

export const servicesContent = {
  badge: "Services",
  title: "Solutions built around your business needs.",
  description:
    "I help businesses and individuals build modern, scalable, and user-friendly web applications with the right technologies.",
  services: [
    {
      id: "custom-website",
      title: "Custom Website Development",
      description:
        "Modern, responsive websites built from scratch with clean code, thoughtful design, and a focus on performance.",
      icon: Code2,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "ecommerce",
      title: "E-commerce Development",
      description:
        "Complete e-commerce solutions with product management, shopping cart, authentication, orders, and secure checkout.",
      icon: ShoppingCart,
      technologies: ["Next.js", "TypeScript", "MongoDB", "Prisma"],
    },
    {
      id: "full-stack",
      title: "Full-Stack Web Applications",
      description:
        "Scalable web applications with powerful backends, REST APIs, authentication, databases, and admin dashboards.",
      icon: Layers3,
      technologies: ["Next.js", "Node.js", "Express.js", "PostgreSQL"],
    },
    {
      id: "redesign-fixing",
      title: "Website Redesign & Bug Fixing",
      description:
        "Improve an existing website with a modern interface, responsive layouts, performance improvements, and bug fixes.",
      icon: Wrench,
      technologies: ["React", "Next.js", "JavaScript", "Tailwind CSS"],
    },
  ],
} satisfies {
  badge: string;
  title: string;
  description: string;
  services: Service[];
};