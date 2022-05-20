import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `./locales/en.json` // `./locales/{{lng}}.json`
    },
    react: {
      useSuspense: true
    },
    fallbackLng: 'en',
    preload: ['en'],
    keySeparator: false,
    interpolation: { escapeValue: false }
  })

export default i18next

// supported
export const LANGUAGES = [
  {
    name: 'English',
    key: 'en'
  },
  {
    name: '中文(简体)',
    key: 'zh-CN'
  }
  // {
  //   name: '中文(繁體)',
  //   key: 'zh-TW'
  // }
]
