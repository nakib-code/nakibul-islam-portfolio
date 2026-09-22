import Container from "@/components/layout/Container";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
    >
      <HeroBackground />

      <Container>
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <HeroContent />

          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}