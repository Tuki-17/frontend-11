import React, { useState, useEffect } from 'react';

/**
 * Componente contenedor de fondo con efecto "Spotlight" interactivo que sigue el cursor del mouse.
 * - Modo Claro: halo suave ámbar/naranja (rgba(251, 146, 60, 0.08))
 * - Modo Oscuro: halo suave azul/índigo (rgba(99, 102, 241, 0.12))
 * - Fondo base: bg-gradient-to-br from-amber-50/40 via-slate-50 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-950 min-h-screen
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
    ? 'rgba(99, 102, 241, 0.12)'
    : 'rgba(251, 146, 60, 0.08)';

  return (
    <div
      className="bg-gradient-to-br from-amber-50/40 via-slate-50 to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-950 min-h-screen relative overflow-hidden background-spotlight-container"
      onMouseMove={handleContainerMouseMove}
    >
      {/* Destello de luz sutil en forma de gradiente radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 spotlight-halo"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, ${haloColor}, transparent 80%)`,
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
