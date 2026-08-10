interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

import SectionBadge from "./SectionBadge";

export default function SectionHeading({
  badge,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={`mb-12 flex flex-col ${alignment}`}>
      {badge && <SectionBadge>{badge}</SectionBadge>}

      <h2 className="font-heading text-4xl font-bold tracking-tight lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}