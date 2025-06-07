// ✅ src/pages/gerencia/GerenciaPanel.tsx restaurado con "Editar perfil" y vista de publicaciones
import React, { useState } from "react";
import Topbar from "../../components/common/Topbar";
import IncidenciasAdmin from "../admin/IncidenciasAdmin";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import EditarPerfil from "../empleado/EditarPerfil";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import PublicacionesGerencia from "./PublicacionesGerencia";

const GerenciaPanel: React.FC = () => {
  const { user } = useAuth();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [verPublicaciones, setVerPublicaciones] = useState(false);

  if (!user) return null;

  if (user.rol !== "gerente" && user.rol !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        {!modoEdicion && !verPublicaciones ? (
          <div className="card-panel animate-slide-up flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={getAvatarUrl(user.imagen)}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
            />
            <div className="flex-1">
              <h2 className="title-main mb-2 animate-slide-up-slow">
                Panel de Gerencia
              </h2>
              <p>
                <strong>Nombre:</strong> {user.nombre} {user.apellidos}
              </p>
              <p>
                <strong>Correo:</strong> {user.email}
              </p>
              <p>
                <strong>Área:</strong>{" "}
                {typeof user.area === "object"
                  ? user.area?.nombre
                  : user.area || "Sin área"}
              </p>
              <p>
                <strong>Rol:</strong>{" "}
                <span className="badge bg-blue-100 text-blue-700">
                  {user.rol}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setModoEdicion(true)}
                className="btn-primary"
              >
                Editar perfil
              </button>
              <button
                onClick={() => setVerPublicaciones(true)}
                className="btn-secondary"
              >
                📚 Ver publicaciones
              </button>
            </div>
          </div>
        ) : modoEdicion ? (
          <EditarPerfil salirEdicion={() => setModoEdicion(false)} />
        ) : (
          <PublicacionesGerencia volver={() => setVerPublicaciones(false)} />
        )}

        {!modoEdicion && !verPublicaciones && <IncidenciasAdmin />}
      </div>
    </>
  );
};

export default GerenciaPanel;
