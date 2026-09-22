"use client";

import { useTranslation } from "react-i18next";

type Language = "en" | "bn";

export default function LanguageToggle() {
  const { i18n } = useTranslation("common");

  const currentLanguage: Language =
    i18n.resolvedLanguage === "bn" ? "bn" : "en";

  const changeLanguage = async (language: Language) => {
    await i18n.changeLanguage(language);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background/70 p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
          currentLanguage === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("bn")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
          currentLanguage === "bn"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}