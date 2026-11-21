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
    <div className="arrepentimiento-page-wrapper">
      <div className="arrepentimiento-card">
        <h2 className="modal-title">↩️ Botón de Arrepentimiento</h2>
        <p className="modal-description">Resolución 424/2020 - Derecho de revocación de compra dentro de los 10 días corridos.</p>

        {error && (
          <div className="form-alert-error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!ticket ? (
          <form onSubmit={handleSubmit} className="arrepentimiento-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigo_compra" className="form-label">Código de Compra</label>
              <input
                id="codigo_compra"
                type="text"
                value={codigoCompra}
                onChange={(e) => setCodigoCompra(e.target.value)}
                required
                className="form-input"
                placeholder="CMP-XXXXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="detalle" className="form-label">Motivo (Opcional)</label>
              <textarea
                id="detalle"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                rows="3"
                className="form-input"
                placeholder="Detalle brevemente el motivo..."
                style={{ resize: "vertical" }}
              />
            </div>

            <button type="submit" disabled={cargando} className="btn btn-arrepentimiento btn-full-mobile">
              {cargando ? "Procesando..." : "Confirmar Revocación"}
            </button>
          </form>
        ) : (
          <div data-testid="ticket-revocacion" className="ticket-container">
            <h3>Trámite de Revocación Iniciado</h3>
            <p style={{ marginTop: "8px" }}>
              Código de Trámite: <strong>{ticket.codigo_tramite}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
