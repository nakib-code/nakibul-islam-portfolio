export interface StoreProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  imagePublicId?: string;
  whatsappMessage: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFormValues {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  techStack: string;
  liveUrl: string;
  imageUrl: string;
  imagePublicId: string;
  whatsappMessage: string;
}

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