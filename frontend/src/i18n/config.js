import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    
    fallbackLng: 'en',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'teipsum-language',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Load translations from public/locales
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Supported languages
    supportedLngs: ['en', 'de', 'pl', 'ua'],
    
    // Namespace
    defaultNS: 'translation',
    ns: ['translation'],

    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });

export default i18n;
