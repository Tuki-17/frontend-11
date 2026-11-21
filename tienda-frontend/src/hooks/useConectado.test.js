import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useConectado } from "./useConectado";

describe("useConectado", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("debe iniciar en true cuando el navegador está online", () => {
    const { result } = renderHook(() => useConectado());
    expect(result.current).toBe(true);
  });

  it("debe responder dinámicamente a los eventos offline y online", () => {
    const { result } = renderHook(() => useConectado());
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current).toBe(true);
  });
});
