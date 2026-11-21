import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Arrepentimiento from "./Arrepentimiento";

describe("Arrepentimiento Page", () => {
  it("simula fetch con vi.spyOn, verifica respuesta con codigo_tramite y confirma que la petición NO incluye la cabecera Authorization", async () => {
    // Simulamos un token en localStorage para demostrar que aun con sesión guardada,
    // el trámite de arrepentimiento (Res. 424/2020) no incluye cabecera Authorization.
    localStorage.setItem("access_token", "fake-token-de-prueba");

    const mockResponse = {
      mensaje: "Trámite de revocación de compra iniciado con éxito (Resolución 424/2020).",
      codigo_tramite: "REV-2026-X9Y8Z7",
      registro: {
        email: "cliente@prueba.com",
        codigo_compra: "CMP-ABC123",
        codigo_tramite: "REV-2026-X9Y8Z7",
        fecha: "2026-11-21 00:00:00",
      },
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Arrepentimiento />);

    const user = userEvent.setup();

    // Completar el formulario
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const codigoInput = screen.getByLabelText(/código de compra/i);
    const submitBtn = screen.getByRole("button", { name: /confirmar revocación/i });

    await user.type(emailInput, "cliente@prueba.com");
    await user.type(codigoInput, "CMP-ABC123");
    await user.click(submitBtn);

    // 1. Verificar que fetch fue llamado hacia el endpoint de arrepentimiento
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toContain("/arrepentimiento");
    expect(options.method).toBe("POST");

    // 2. Confirmar que la petición NO incluye la cabecera Authorization
    const headers = options.headers || {};
    const authHeader = headers["Authorization"] || headers["authorization"];
    expect(authHeader).toBeUndefined();

    // 3. Verificar respuesta mostrando codigo_tramite
    await waitFor(() => {
      expect(screen.getByText("REV-2026-X9Y8Z7")).toBeInTheDocument();
    });
  });
});
