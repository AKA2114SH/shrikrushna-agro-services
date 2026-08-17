'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Language } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof dictionary['mr'];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'mr',
  setLang: () => {},
  t: dictionary['mr'],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('mr');

  useEffect(() => {
    const saved = localStorage.getItem('sk_agro_lang') as Language;
    if (saved && (saved === 'mr' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('sk_agro_lang', newLang);
  };

  const t = dictionary[lang] || dictionary['mr'];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
