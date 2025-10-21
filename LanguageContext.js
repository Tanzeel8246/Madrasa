// contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [direction, setDirection] = useState('ltr');

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'ur' ? 'en' : 'ur';
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
    setDirection(newLang === 'ur' ? 'rtl' : 'ltr');
    
    // Store in localStorage
    localStorage.setItem('language', newLang);
    
    // Update document direction
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    setDirection(lang === 'ur' ? 'rtl' : 'ltr');
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const isUrdu = currentLanguage === 'ur';
  const isEnglish = currentLanguage === 'en';

  useEffect(() => {
    // Set initial direction
    setDirection(currentLanguage === 'ur' ? 'rtl' : 'ltr');
    document.documentElement.dir = currentLanguage === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    direction,
    isUrdu,
    isEnglish,
    toggleLanguage,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
