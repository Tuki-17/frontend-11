import React, { createContext, useContext } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const ThemeContext = createContext({
  isDark: false,
  toggleDark: () => {},
  theme: 'light',
});

export function ThemeProvider({ children }) {
  const { isDark, toggleDark, theme } = useDarkMode();

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
