"use client";

import { useEffect, useState } from "react";

export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );

    if (!sections.length) return;

    const updateActiveSection = () => {
      const headerOffset = 100;

      let currentSection = "home";
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        // Section-এর top viewport-এর কত কাছে
        const distance = Math.abs(rect.top - headerOffset);

        // Section যদি viewport-এর মধ্যে থাকে
        if (
          rect.top <= window.innerHeight - 100 &&
          rect.bottom >= headerOffset
        ) {
          if (distance < closestDistance) {
            closestDistance = distance;
            currentSection = section.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Initial check
    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return activeSection;
}