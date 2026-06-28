import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { en, type Translations } from '../translations/en';
import { fr } from '../translations/fr';

type Language = 'en' | 'fr';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const translations: Record<Language, Translations> = { en, fr };
const LANGUAGE_KEY = 'lv_mobile_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (Platform.OS === 'web') {
      return (globalThis.localStorage?.getItem(LANGUAGE_KEY) as Language) || 'en';
    }
    return 'en';
  });

  const setLang = (next: Language) => {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(LANGUAGE_KEY, next);
    setLangState(next);
  };

  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
