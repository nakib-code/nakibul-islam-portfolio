"use client";

import { experienceContent } from "@/data/experience";

import ExperienceItem from "./ExperienceItem";

export default function ExperienceTimeline() {
  return (
    <div className="relative mt-16">
      {/* Timeline Line */}
      <div className="absolute bottom-0 left-0 top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-10 md:space-y-16">
        {experienceContent.items.map((item, index) => (
          <ExperienceItem
            key={`${item.year}-${item.title}`}
            item={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}