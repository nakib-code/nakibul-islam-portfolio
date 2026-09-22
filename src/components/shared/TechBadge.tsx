interface TechBadgeProps {
  children: React.ReactNode;
}

export default function TechBadge({ children }: TechBadgeProps) {
  return (
    <span
      className="
        rounded-full
        border
        border-border
        bg-background/60
        px-3
        py-1.5
        text-sm
        font-medium
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/40
        hover:bg-primary/10
      "
    >
      {children}
    </span>
  );
}
