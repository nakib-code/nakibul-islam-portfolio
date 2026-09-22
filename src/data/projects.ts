import type { Project } from "@/type/project";

export const projectsContent = {
  projects: [
    {
      id: 1,
      key: "nakivo",

      title: "Nakivo",

      shortDescription:
        "Modern Full Stack Ecommerce Platform",

      description:
        "A scalable ecommerce application built with Next.js App Router featuring authentication, admin dashboard, product management and responsive design.",

      images: [
        "/projects/nakivo/home.png",
        "/projects/nakivo/dashboard.png",
        "/projects/nakivo/products.png",
      ],

      status: "In Progress",

      featured: true,

      technologies: [
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Redux Toolkit",
        "Tailwind CSS",
      ],

      features: [
        "Authentication",
        "Admin Dashboard",
        "Product Management",
        "Responsive UI",
      ],

      links: {
        github:
          "https://github.com/nakib-code/nakivo",
        live: "https://nakivo.vercel.app/",
      },
    },

    {
      id: 2,
      key: "fixitnow",

      title: "FixItNow",

      shortDescription:
        "Home Service Marketplace",

      description:
        "A full-stack marketplace connecting customers with technicians including booking, payment, dashboard and role-based authentication.",

      images: [
        "/projects/fixitnow/home.png",
        "/projects/fixitnow/dashboard.png",
        "/projects/fixitnow/booking.png",
      ],

      status: "Production Ready",

      featured: true,

      technologies: [
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Prisma",
      ],

      features: [
        "Booking System",
        "SSLCommerz Payment",
        "Role Based Dashboard",
        "Reviews",
      ],

      links: {
        github:
          "https://github.com/nakib-code/fixitnow-frontend",
        live:
          "https://fixitnow-eta-blush.vercel.app/",
      },
    },
  ] satisfies Project[],
};