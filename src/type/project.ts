export interface StoreProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  imagePublicId?: string;
  screenshots?: string[];
  features?: string[];
  downloadFileName?: string;
  downloadFileUrl?: string;
  whatsappMessage: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFormValues {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  salePrice?: string;
  techStack: string;
  liveUrl: string;
  imageUrl: string;
  imagePublicId: string;
  downloadFileName?: string;
  features?: string;
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
