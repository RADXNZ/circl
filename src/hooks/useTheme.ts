import { useState, useEffect } from 'react';

const STORAGE_KEY = 'circl-theme';
const DARK_BG  = '#060a13';
const LIGHT_BG = '#f1f5f9';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  const isLight = theme === 'light';

  // Primary mechanism: data-theme attribute (most reliable across mobile browsers)
  html.setAttribute('data-theme', theme);

  // Set background-color on <html> directly — fixes iOS overscroll bounce area color
  html.style.backgroundColor = isLight ? LIGHT_BG : DARK_BG;

  // Update color-scheme — affects native scrollbars, inputs, selects on mobile
  html.style.colorScheme = isLight ? 'light' : 'dark';

  // Update browser chrome color (Android address bar, iOS Safari bar)
  const metaThemeColor = document.getElementById('meta-theme-color');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isLight ? LIGHT_BG : DARK_BG);
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Sync with OS preference if user hasn't manually chosen
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
