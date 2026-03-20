import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { ThemeName, Mode } from './types';

const STORAGE_KEY_THEME = 'shadcn-theme';
const STORAGE_KEY_MODE = 'shadcn-mode';

function getInitialTheme(): ThemeName {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem(STORAGE_KEY_THEME) as ThemeName) || 'swiss-minimal';
  }
  return 'swiss-minimal';
}

function getInitialMode(): Mode {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem(STORAGE_KEY_MODE) as Mode) || 'light';
  }
  return 'light';
}

interface ThemeContextValue {
  theme: ThemeName;
  mode: Mode;
  setTheme: (name: ThemeName) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: Mode;
}

export function ThemeProvider({
  children,
  defaultTheme,
  defaultMode,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme ?? getInitialTheme);
  const [mode, setModeState] = useState<Mode>(defaultMode ?? getInitialMode);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-mode', mode);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }, [theme, mode]);

  const setTheme = useCallback((name: ThemeName) => setThemeState(name), []);
  const setMode = useCallback((m: Mode) => setModeState(m), []);
  const toggleMode = useCallback(
    () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>');
  return ctx;
}
