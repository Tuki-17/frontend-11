import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { BackgroundSpotlight } from './BackgroundSpotlight';

describe('BackgroundSpotlight', () => {
  it('renderiza children y aplica el halo en modo claro por defecto estilo X', () => {
    const { container } = render(
      <BackgroundSpotlight isDark={false}>
        <div>Contenido de Prueba</div>
      </BackgroundSpotlight>
    );

    expect(screen.getByText('Contenido de Prueba')).toBeInTheDocument();

    const halo = container.querySelector('.spotlight-halo');
    expect(halo).toBeInTheDocument();
    expect(halo).toHaveClass('pointer-events-none');
    expect(halo.style.background).toContain('rgba(234, 88, 12, 0.12)');
  });

  it('aplica el halo índigo en modo oscuro', () => {
    const { container } = render(
      <BackgroundSpotlight isDark={true}>
        <div>Modo Oscuro</div>
      </BackgroundSpotlight>
    );

    const halo = container.querySelector('.spotlight-halo');
    expect(halo.style.background).toContain('rgba(99, 102, 241, 0.15)');
  });

  it('actualiza la posición del gradiente al mover el mouse', () => {
    const { container } = render(
      <BackgroundSpotlight isDark={false}>
        <div>Spotlight Dinámico</div>
      </BackgroundSpotlight>
    );

    const halo = container.querySelector('.spotlight-halo');
    fireEvent.mouseMove(window, { clientX: 250, clientY: 400 });

    expect(halo.style.background).toContain('250px 400px');
  });
});
