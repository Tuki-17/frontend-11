import React, { useState, useRef, useEffect } from 'react';

/**
 * Botón de Configuración (engranaje) con dropdown que incluye el switch de Dark Mode.
 * Props:
 *   isDark: boolean — estado actual del modo oscuro
 *   onToggleDark: () => void — función para alternar
 */
export function ConfigMenu({ isDark, onToggleDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="config-menu-container" ref={containerRef}>
      <button
        type="button"
        className="config-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir menú de configuración"
        title="Configuración"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="config-dropdown" role="menu">
          <div className="config-dropdown-title">⚙️ Configuración</div>

          {/* Switch Dark Mode */}
          <div className="config-row">
            <label htmlFor="dark-mode-switch" className="config-row-label">
              <span>{isDark ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}</span>
              <span className="config-row-hint">Cambiar tema de la interfaz</span>
            </label>
            <button
              id="dark-mode-switch"
              type="button"
              role="switch"
              aria-checked={isDark}
              className={`dark-mode-toggle ${isDark ? 'dark-mode-toggle--on' : ''}`}
              onClick={() => { onToggleDark(); }}
              title={isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
            >
              <span className="dark-mode-toggle-thumb" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigMenu;
