export interface ProjectLink {
  github: string;
  live: string;
  caseStudy?: string;
}

export interface Project {
  id: number;

  title: string;

  shortDescription: string;

  description: string;

  images: string[];

  status: "Production Ready" | "In Progress";

  featured: boolean;

  technologies: string[];

  features: string[];

  links: ProjectLink;
}