import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    hero: {
      title: 'OKAWE MEDIA',
      subtitle: 'Creative Marketing Agency',
    },
    services: {
      logo: 'Logo Design',
      branding: 'Branding',
      video: 'Video Production',
      motion: 'Motion Graphics',
      proposal: 'Business Proposals',
      flyer: 'Flyers',
      card: 'Business Cards',
      animation: '3D Product Animation',
      explainer: 'Explainer Videos',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    hero: {
      title: 'OKAWE MEDIA',
      subtitle: 'Agence de Marketing Créatif',
    },
    services: {
      logo: 'Conception de Logo',
      branding: 'Branding',
      video: 'Production Vidéo',
      motion: 'Motion Graphics',
      proposal: 'Propositions Commerciales',
      flyer: 'Flyers',
      card: 'Cartes de Visite',
      animation: 'Animation de Produit 3D',
      explainer: 'Vidéos Explicatives',
    },
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
