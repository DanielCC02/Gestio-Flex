import React from 'react';
import { useAuth } from './AuthContext';

const SessionExpiredModal = () => {
  const { sessionExpired, reactivarSesion, finalizarSesion } = useAuth();

  if (!sessionExpired) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>La sesión expiró</h3>
        <p>¿Desea reactivarla?</p>
        <div className="modal-actions">
          <button onClick={reactivarSesion}>Reactivar</button>
          <button onClick={finalizarSesion}>Finalizar</button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
