import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="btn-secondary flex items-center justify-center theme-switch slide-in"
      style={{ width: 40, height: 40, borderRadius: '50%', padding: 0 }}
      aria-label="Toggle theme"
      title="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
