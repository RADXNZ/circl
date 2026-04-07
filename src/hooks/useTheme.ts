import { useState, useEffect } from 'react';

const STORAGE_KEY = 'circl-theme';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  // 1) Check localStorage first (user's explicit preference)
  const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
  if (saved === 'light' || saved === 'dark') return saved;
  // 2) Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  const body = document.body;
  // Remove both classes from both elements and re-add correct one
  html.classList.remove('light', 'dark');
  body.classList.remove('light', 'dark');
  html.classList.add(theme);
  body.classList.add(theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // Apply theme class + persist whenever theme changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for OS-level preference change
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
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
