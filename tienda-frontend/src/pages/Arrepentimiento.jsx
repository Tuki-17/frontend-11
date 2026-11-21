import React, { useState } from "react";
import { solicitarArrepentimiento } from "../services/api";

export default function Arrepentimiento() {
  const [email, setEmail] = useState("");
  const [codigoCompra, setCodigoCompra] = useState("");
  const [detalle, setDetalle] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const data = await solicitarArrepentimiento(email, codigoCompra, detalle);
      setTicket(data.registro || data);
    } catch (err) {
      setError(err.message || "Error al procesar la revocación");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="arrepentimiento-container" style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Botón de Arrepentimiento</h2>
      <p>Resolución 424/2020 - Derecho de revocación de compra.</p>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!ticket ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="codigo_compra">Código de Compra</label>
            <input
              id="codigo_compra"
              type="text"
              value={codigoCompra}
              onChange={(e) => setCodigoCompra(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="detalle">Motivo (Opcional)</label>
            <textarea
              id="detalle"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              rows="3"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit" disabled={cargando} className="btn btn-primary">
            {cargando ? "Procesando..." : "Confirmar Revocación"}
          </button>
        </form>
      ) : (
        <div data-testid="ticket-revocacion" style={{ marginTop: "20px" }}>
          <h3>Trámite de Revocación Iniciado</h3>
          <p>
            Código de Trámite: <strong>{ticket.codigo_tramite}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
