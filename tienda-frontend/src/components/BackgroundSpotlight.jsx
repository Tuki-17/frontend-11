import React, { useState, useEffect } from 'react';

/**
 * Componente contenedor de fondo con efecto "Spotlight" interactivo estilo X (Twitter).
 * - Modo Claro: radial-gradient(600px at ${x}px ${y}px, rgba(234, 88, 12, 0.12), transparent 80%)
 * - Modo Oscuro: radial-gradient(600px at ${x}px ${y}px, rgba(99, 102, 241, 0.15), transparent 80%)
 * - Fondo base: bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-zinc-900 dark:to-slate-900 min-h-screen text-slate-900 dark:text-slate-100
 * - pointer-events-none en el halo para no bloquear interacciones
 */
export function BackgroundSpotlight({ children, isDark }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Captura global de cursor
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  const handleContainerMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const haloColor = isDark
    ? 'rgba(99, 102, 241, 0.15)'
    : 'rgba(234, 88, 12, 0.12)';

  return (
    <div
      className="bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-zinc-900 dark:to-slate-900 min-h-screen text-slate-900 dark:text-slate-100 relative overflow-hidden background-spotlight-container"
      onMouseMove={handleContainerMouseMove}
    >
      {/* Destello de luz interactivo estilo X (Twitter) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 spotlight-halo"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, ${haloColor}, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Contenido principal interactivo */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default BackgroundSpotlight;
