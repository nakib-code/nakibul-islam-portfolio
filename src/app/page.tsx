import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/about/about";
import Contact from "@/components/sections/contact/Contact";
import Experience from "@/components/sections/experience/Experience";
import Hero from "@/components/sections/hero/Hero";
import Projects from "@/components/sections/project/Projects";
import Services from "@/components/sections/service/Services";
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
        <Services />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}