import { useState, useEffect } from 'react';

const STORAGE_KEY = 'circl-theme';
const DARK_BG = '#060a13';
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

  // 1. Toggle class on <html> — this is what CSS variables respond to
  html.classList.toggle('light', isLight);
  html.classList.toggle('dark', !isLight);

  // 2. Set background-color directly on <html> so iOS overscroll area matches
  html.style.backgroundColor = isLight ? LIGHT_BG : DARK_BG;

  // 3. Update color-scheme on <html> — controls native form controls, scrollbars, etc.
  html.style.colorScheme = isLight ? 'light' : 'dark';

  // 4. Update <meta name="theme-color"> — controls Android/iOS browser chrome color
  const metaThemeColor = document.getElementById('meta-theme-color');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isLight ? LIGHT_BG : DARK_BG);
  }

  // 5. Update apple-mobile-web-app-status-bar-style for iOS PWA
  const metaApple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (metaApple) {
    metaApple.setAttribute('content', isLight ? 'default' : 'black-translucent');
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Sync with OS preference changes (only if user hasn't manually chosen)
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
