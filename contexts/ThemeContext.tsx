import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import useColorScheme from '@/hooks/use-color-scheme';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children?: ReactNode }) {
  const system = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<Theme>(system as Theme);

  useEffect(() => {
    // Keep system preference as default until user overrides
    if (!localStorageAvailable()) return;
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function localStorageAvailable() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof window !== 'undefined' && typeof (window as any).localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
