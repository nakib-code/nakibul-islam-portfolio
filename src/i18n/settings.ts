export const languages = ["en", "bn"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "en";

export const languageNames: Record<Language, string> = {
  en: "English",
  bn: "বাংলা",
};