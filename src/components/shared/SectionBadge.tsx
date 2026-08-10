interface SectionBadgeProps {
  children: React.ReactNode;
}

export default function SectionBadge({
  children,
}: SectionBadgeProps) {
  return (
    <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
      {children}
    </div>
  );
}