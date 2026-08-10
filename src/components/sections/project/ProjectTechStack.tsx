"use client";

interface Props {
  technologies: string[];
}

export default function ProjectTechStack({
  technologies,
}: Props) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={tech}
          className="
            rounded-full
            border
            border-border
            bg-background/60
            px-3
            py-1
            text-sm
            text-muted-foreground
            transition-all
            duration-300
            hover:border-primary/40
            hover:bg-primary/10
            hover:text-primary
          "
        >
          {tech}
        </span>
      ))}
    </div>
  );
}