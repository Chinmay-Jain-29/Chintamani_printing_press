'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '@/lib/schema';
import { getTranslation } from '@/lib/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  getLocalized: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ncpp_lang') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ncpp_lang', lang);
      document.cookie = `ncpp_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  const getLocalized = (obj: any, field: string): string => {
    if (!obj) return '';
    const localizedVal = obj[`${field}_${language}`];
    if (localizedVal) return localizedVal;
    const fallbackVal = obj[`${field}_en`] || obj[field];
    return fallbackVal || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
