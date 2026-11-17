import { useRegisterSW } from "virtual:pwa-register/react";

export default function ActualizacionDisponible() {
  const {
    needRefresh: [hayNueva, setHayNueva],
    updateServiceWorker,
  } = useRegisterSW();

  if (!hayNueva) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        maxWidth: "480px",
        margin: "0 auto",
        background: "#0F1B2D",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        zIndex: 9999,
      }}
    >
      <p style={{ margin: 0, fontSize: "14px" }}>
        Hay una versión nueva de la tienda.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          className="btn btn-primary"
          onClick={() => updateServiceWorker(true)}
        >
          Actualizar
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setHayNueva(false)}
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}
