
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import bnTranslation from './locales/bn.json';

// Initialize i18n instance
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      bn: {
        translation: bnTranslation
      }
    },
    lng: 'bn', // Default language set to Bangla
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
