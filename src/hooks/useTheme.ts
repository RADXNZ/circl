import { useState, useEffect } from 'react';

const STORAGE_KEY = 'circl-theme';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  // Only toggle on <html> — CSS variables live on html.light / :root
  html.classList.toggle('light', theme === 'light');
  html.classList.toggle('dark', theme === 'dark');
  // Keep body in sync for any legacy selectors, but html is the source of truth
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Sync with OS preference changes (only if user hasn't overridden)
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
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
