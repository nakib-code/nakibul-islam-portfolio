export type Project = {
  id: number;

  key: "nakivo" | "fixitnow";

  title: string;

  shortDescription: string;

  description: string;

  images: string[];

  status: "Production Ready" | "In Progress";

  featured: boolean;

  technologies: string[];

  features: string[];

  links: {
    github: string;
    live: string;
  };
};