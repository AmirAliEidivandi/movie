import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation.json";
import faTranslations from "./locales/fa/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      fa: {
        translation: faTranslations,
      },
    },
    fallbackLng: "en",
    debug: true,
    supportedLngs: ["en", "fa"],
    interpolation: {
      escapeValue: false,
    },
  });

// Set initial direction
document.dir = i18n.language === "fa" ? "rtl" : "ltr";

export default i18n;
