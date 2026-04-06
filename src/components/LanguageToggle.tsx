import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button 
      onClick={toggleLang} 
      className="btn-secondary flex items-center justify-center slide-in"
      style={{ height: 40, width: 44, borderRadius: '20px', padding: 0, fontWeight: 600, fontSize: '0.875rem' }}
      aria-label="Toggle language"
      title="Toggle Language"
    >
      {lang.toUpperCase()}
    </button>
  );
};
