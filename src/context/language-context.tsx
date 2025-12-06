'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, any>> = {
  en: {
    keyMapping: {
        dashboard: 'Dashboard',
        encyclopedia: 'Encyclopedia',
        preventiveCare: 'Preventive Care',
        fieldLogbook: 'Field Logbook',
    },
  },
  hi: {
    keyMapping: {
        dashboard: 'डैशबोर्ड',
        encyclopedia: 'विश्वकोश',
        preventiveCare: 'निवारक देखभाल',
        fieldLogbook: 'फील्ड लॉगबुक',
    },
  },
  te: {
    keyMapping: {
        dashboard: 'డాష్‌బోర్డ్',
        encyclopedia: 'ఎన్సైక్లోపీడియా',
        preventiveCare: 'నివారణ సంరక్షణ',
        fieldLogbook: 'ఫీల్డ్ లాగ్‌బుక్',
    },
  },
  ta: {
    keyMapping: {
        dashboard: 'แดชบอร์ด',
        encyclopedia: 'களஞ்சியம்',
        preventiveCare: 'தடுப்பு பராமரிப்பு',
        fieldLogbook: 'புல பதிவு புத்தகம்',
    },
  },
};


function getNestedTranslation(translations: Record<string, any>, key: string, lang: Language): string {
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return key;
        }
    }
    return typeof result === 'string' ? result : key;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const getTranslation = useCallback((key: string) => {
    if(!key) return '';
    return getNestedTranslation(translations, key, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
