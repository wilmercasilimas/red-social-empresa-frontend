import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import { getAvatarUrl } from "../helpers/getAvatarUrl";
import EditarPerfil from "./empleado/EditarPerfil";
import PublicacionesEmpleado from "./empleado/PublicacionesEmpleado";
import MisTareas from "./usuario/MisTareas";
import FeedPublicaciones from "../components/publicaciones/FeedPublicaciones";

const EmpleadoPanel: React.FC = () => {
  const { user } = useAuth();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [verPublicaciones, setVerPublicaciones] = useState(false);
  const [verTareas, setVerTareas] = useState(false);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null); // 🆕

  if (!user) return null;

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        {modoEdicion ? (
          <EditarPerfil salirEdicion={() => setModoEdicion(false)} />
        ) : verPublicaciones ? (
          <PublicacionesEmpleado volver={() => setVerPublicaciones(false)} />
        ) : verTareas ? (
          <MisTareas volver={() => setVerTareas(false)} />
        ) : (
          <>
            <div className="card-panel animate-slide-up flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={getAvatarUrl(user.imagen)}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
              />

              <div className="flex-1">
                <h1 className="title-main mb-4 animate-slide-up-slow">
                  Panel del Empleado
                </h1>
                <p>
                  <strong>Nombre:</strong> {user.nombre} {user.apellidos}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Cargo:</strong> {user.cargo}
                </p>
                <p>
                  <strong>Área:</strong>{" "}
                  {user.area && typeof user.area === "object"
                    ? user.area.nombre
                    : typeof user.area === "string"
                    ? user.area
                    : "Sin área"}
                </p>
                <p>
                  <strong>Rol:</strong>{" "}
                  <span className="badge bg-green-100 text-green-700">
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
                <button
                  onClick={() => setVerTareas(true)}
                  className="btn-secondary"
                >
                  📋 Ver tareas
                </button>
              </div>
            </div>

            {/* ✅ Feed estilo Instagram */}
            <FeedPublicaciones />
          </>
        )}
      </div>

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={
              imagenAmpliada.startsWith("http")
                ? imagenAmpliada
                : `/uploads/publicaciones/${imagenAmpliada}`
            }
            className="w-full h-full object-contain p-4"
            alt="Imagen ampliada"
          />
        </div>
      )}
    </>
  );
};

export default EmpleadoPanel;
