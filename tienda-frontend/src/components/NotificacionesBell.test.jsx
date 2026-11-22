import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { NotificacionesBell } from "./NotificacionesBell";
import * as api from "../services/api";

describe("NotificacionesBell", () => {
  it("renderiza la campanita, muestra el badge con no leídas y permite marcar como leídas", async () => {
    const mockNotifs = [
      {
        id: "notif-ped-1",
        pedido_id: 1,
        codigo_compra: "CMP-ABC123",
        estado: "CONFIRMADO",
        total: 1500,
        email: "cliente@prueba.com",
        titulo: "¡Tu compra CMP-ABC123 ha sido confirmada!",
        mensaje: "Tu pedido CMP-ABC123 se encuentra en estado: CONFIRMADO.",
        tipo: "confirmado",
      },
    ];

    vi.spyOn(api, "getNotificaciones").mockResolvedValue(mockNotifs);

    render(<NotificacionesBell token="token-fake" userRole="customer" />);

    // Esperar a que se consulte la API y aparezca la insignia
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    // Abrir dropdown
    const bellBtn = screen.getByRole("button", { name: /Notificaciones/i });
    fireEvent.click(bellBtn);

    await waitFor(() => {
      expect(screen.getByText("¡Tu compra CMP-ABC123 ha sido confirmada!")).toBeInTheDocument();
    });

    // Marcar como leídas
    const clearBtn = screen.getByRole("button", { name: /Marcar leídas/i });
    fireEvent.click(clearBtn);

    // El badge desaparece
    await waitFor(() => {
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });
  });
});
