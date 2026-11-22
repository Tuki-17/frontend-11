import React, { useState, useEffect, useRef } from 'react';
import { getNotificaciones } from '../services/api';
import toast from 'react-hot-toast';

export const NotificacionesBell = ({ token, userRole }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leidas, setLeidas] = useState(() => {
    try {
      const guardadas = localStorage.getItem('notificaciones_leidas');
      return guardadas ? JSON.parse(guardadas) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);

  const fetchNotificaciones = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getNotificaciones(token);
      setNotificaciones(data || []);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [token]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const noLeidas = notificaciones.filter((n) => !leidas.includes(n.id));
  const unreadCount = noLeidas.length;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchNotificaciones();
    }
  };

  const marcarTodasLeidas = () => {
    const todasIds = notificaciones.map((n) => n.id);
    const nuevasLeidas = Array.from(new Set([...leidas, ...todasIds]));
    setLeidas(nuevasLeidas);
    try {
      localStorage.setItem('notificaciones_leidas', JSON.stringify(nuevasLeidas));
    } catch (e) {
      console.error(e);
    }
    toast.success("Notificaciones marcadas como leídas");
  };

  const marcarComoLeida = (id) => {
    if (!leidas.includes(id)) {
      const nuevasLeidas = [...leidas, id];
      setLeidas(nuevasLeidas);
      try {
        localStorage.setItem('notificaciones_leidas', JSON.stringify(nuevasLeidas));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="notif-bell-container" ref={dropdownRef}>
      <button
        type="button"
        className="notif-btn"
        onClick={handleToggle}
        aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} no leídas)` : ''}`}
        title="Novedades y Notificaciones de Pedidos"
      >
        <span className="notif-bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <div className="notif-header-title">
              <strong>Notificaciones</strong>
              {userRole === 'admin' ? (
                <span className="notif-role-tag">Admin</span>
              ) : (
                <span className="notif-role-tag">Cliente</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-btn-clear"
                onClick={marcarTodasLeidas}
                title="Marcar todas como leídas"
              >
                ✓ Marcar leídas
              </button>
            )}
          </div>

          <div className="notif-dropdown-body">
            {loading ? (
              <div className="notif-empty">Cargando notificaciones...</div>
            ) : notificaciones.length === 0 ? (
              <div className="notif-empty">No hay novedades por el momento.</div>
            ) : (
              notificaciones.map((notif) => {
                const esNoLeida = !leidas.includes(notif.id);
                return (
                  <div
                    key={notif.id}
                    className={`notif-item ${esNoLeida ? 'notif-unread' : ''}`}
                    onClick={() => marcarComoLeida(notif.id)}
                  >
                    <div className="notif-item-top">
                      <span className={`notif-status-pill notif-status-${notif.tipo}`}>
                        {notif.tipo === 'cancelado' ? '⚠️ Cancelado' : '✅ Confirmado'}
                      </span>
                      {esNoLeida && <span className="notif-unread-dot" title="No leída" />}
                    </div>
                    <div className="notif-item-title">{notif.titulo}</div>
                    <div className="notif-item-desc">{notif.mensaje}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificacionesBell;
