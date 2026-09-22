"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

const resources = {
  en: {
    common: () => import("@/locales/en/common.json"),
  },
  bn: {
    common: () => import("@/locales/bn/common.json"),
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        const loader =
          resources[language as keyof typeof resources]?.[
            namespace as "common"
          ];

        if (!loader) {
          throw new Error(
            `Translation not found: ${language}/${namespace}`,
          );
        }

        return loader();
      }),
    )
    .init({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "common",
      ns: ["common"],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;