// src/data/why-choose-me.ts

import {
  Code2,
  Layers3,
  Server,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface WhyChooseMeFeature {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

export const whyChooseMe: {
  features: WhyChooseMeFeature[];
} = {
  features: [
    {
      icon: Code2,
      titleKey: "cleanCode.title",
      descriptionKey: "cleanCode.description",
    },
    {
      icon: Layers3,
      titleKey: "productMinded.title",
      descriptionKey: "productMinded.description",
    },
    {
      icon: Server,
      titleKey: "realWorld.title",
      descriptionKey: "realWorld.description",
    },
    {
      icon: GraduationCap,
      titleKey: "alwaysLearning.title",
      descriptionKey: "alwaysLearning.description",
    },
  ],
};