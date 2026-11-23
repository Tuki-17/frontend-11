import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('arranca por defecto en modo claro (isDark: false) en la primera carga', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('permite alternar manualmente a modo oscuro y persiste en localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggleDark();
    });

    expect(result.current.isDark).toBe(true);
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('dark_mode')).toBe('true');
  });
});
