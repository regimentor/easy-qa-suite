import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Settings as LuxonSettings } from "luxon";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const STORAGE_KEY = "app-locale";

function syncLuxonLocale(lng: string) {
  LuxonSettings.defaultLocale = lng === "ru" ? "ru" : "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng:
    typeof localStorage !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) || "en"
      : "en",
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
});

syncLuxonLocale(i18n.language);
i18n.on("languageChanged", syncLuxonLocale);

export { STORAGE_KEY };
export default i18n;
