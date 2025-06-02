// src/pages/Dashboard.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import { getAvatarUrl } from "../helpers/getAvatarUrl";
import EditarPerfil from "./empleado/EditarPerfil";

const Dashboard = () => {
  const { user } = useAuth();
  console.log("🟢 Imagen recibida del backend (Dashboard):", user?.imagen);

  const [modoEdicion, setModoEdicion] = useState(false);

  if (!user) return null;

  const avatarUrl = getAvatarUrl(user.imagen); // ✅ normaliza la URL correctamente

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in">
        {!modoEdicion ? (
          <div className="card-panel animate-slide-up flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
              onError={(e) => {
                console.error("ERROR: Avatar falló al cargar:", e.currentTarget.src);
                e.currentTarget.src = "/img/user.png";
              }}
            />

            {/* Información */}
            <div className="flex-1">
              <h1 className="title-main mb-4 animate-slide-up">Bienvenido al Dashboard</h1>
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
                <span className="badge bg-blue-100 text-blue-700">{user.rol}</span>
              </p>
            </div>

            {/* Botón de editar */}
            <div className="mt-4 md:mt-0">
              <button onClick={() => setModoEdicion(true)} className="btn-primary">
                Editar perfil
              </button>
            </div>
          </div>
        ) : (
          <EditarPerfil salirEdicion={() => setModoEdicion(false)} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
