import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/about";
import Hero from "@/components/sections/hero/Hero";
import Projects from "@/components/sections/project/Projects";
import Skills from "@/components/sections/skills/Skills";
import WhyChooseMe from "@/components/sections/why-choose-me/WhyChooseMe";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <WhyChooseMe />
        <Skills />
        <Projects />

      </main>
    </>
  );
}