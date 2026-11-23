import { useState, useEffect } from 'react';

/**
 * Hook para manejar el Modo Oscuro (Dark Mode).
 * Persiste la preferencia en localStorage y aplica/remueve la clase `dark` en <html>.
 * Por defecto arranca siempre en Modo Claro ('light') en la primera carga.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('dark_mode');
      if (stored !== null) return stored === 'true';
      // Primera carga: Modo Claro predeterminado ('light')
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('dark_mode', String(isDark));
    } catch {
      // silent
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return { isDark, toggleDark, theme: isDark ? 'dark' : 'light' };
}
