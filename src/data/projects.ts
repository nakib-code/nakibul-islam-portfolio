import { Project } from "@/type/project";

export const projectsContent = {
  badge: "Featured Projects",

  title: "Production-ready applications I've built.",

  description:
    "A selection of projects demonstrating my experience in full-stack development, clean architecture, authentication, dashboards and modern UI.",

  projects: <Project[]>[
    {
      id: 1,

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
        github: "https://github.com/nakib-code/nakivo",
        live: "https://nakivo.vercel.app/",
      },
    },

    {
      id: 2,

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
        github: "https://github.com/nakib-code/fixitnow-frontend",
        live: "https://fixitnow-eta-blush.vercel.app/",
      },
    },

    // {
    //   id: 3,

    //   title: "DevPulse API",

    //   shortDescription:
    //     "Backend Issue Tracking API",

    //   description:
    //     "RESTful backend API with JWT authentication, PostgreSQL, TypeScript and raw SQL built following clean architecture principles.",

    //   images: [
    //     "/projects/devpulse/home.png",
    //     "/projects/devpulse/auth.png",
    //     "/projects/devpulse/api.png",
    //   ],

    //   status: "Production Ready",

    //   featured: true,

    //   technologies: [
    //     "Node.js",
    //     "Express",
    //     "PostgreSQL",
    //     "TypeScript",
    //   ],

    //   features: [
    //     "JWT Authentication",
    //     "REST API",
    //     "Raw SQL",
    //     "Validation",
    //   ],

    //   links: {
    //     github: "#",
    //     live: "#",
    //   },
    // },
  ],
};