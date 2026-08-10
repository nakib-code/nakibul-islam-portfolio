"use client";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/shared/SectionHeading";

import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container>
        <SectionHeading
          badge="Contact"
          title="Let's work together."
          description="Have an idea, project, or opportunity? I'd love to hear from you."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <ContactInfo />

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}