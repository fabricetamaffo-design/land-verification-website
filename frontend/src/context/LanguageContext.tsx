import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '../translations/en';
import { fr } from '../translations/fr';
import type { Translations } from '../translations/en';

type Language = 'en' | 'fr';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Language, Translations> = { en, fr };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lv_lang') as Language) || 'en';
  });

  const setLang = (l: Language) => {
    localStorage.setItem('lv_lang', l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
