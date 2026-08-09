export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Center Glow */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />

      {/* Left Accent Glow */}
      <div className="absolute left-0 top-1/3 h-72 w-72 rounded-full bg-cyan-500/8 blur-[100px]" />

      {/* Right Accent Glow */}
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-violet-500/8 blur-[100px]" />

      {/* Radial Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_90%)]" />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}