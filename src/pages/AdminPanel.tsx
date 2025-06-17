import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import AreasAdmin from "./admin/AreasAdmin";
import IncidenciasAdmin from "./admin/IncidenciasAdmin";
import BienvenidaPanel from "../components/common/BienvenidaPanel";
import EditarPerfil from "./empleado/EditarPerfil";
import { getAvatarUrl } from "../helpers/getAvatarUrl";
import { useNavigate } from "react-router-dom";
import BotonIcono from "../components/ui/BotonIcono";
import { Pencil } from "lucide-react";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [vista, setVista] = useState<"usuarios" | "areas" | "incidencias">("usuarios");
  const [modoEdicion, setModoEdicion] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const avatarUrl = getAvatarUrl(user.imagen);

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 px-1 sm:px-2 py-6">
        <div className="w-full space-y-6 fade-in">
          <div className="flex justify-between items-center">
            <BienvenidaPanel
              titulo="Panel de Administración"
              user={user}
              descripcion="Desde aquí podrás gestionar usuarios, áreas, tareas e incidencias."
            />
          </div>

          {!modoEdicion ? (
            <div className="card-panel flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
                onError={(e) => {
                  e.currentTarget.src = "/img/user.png";
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Perfil del administrador</h2>
                <p><strong>Nombre:</strong> {user.nombre} {user.apellidos}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <p><strong>Cargo:</strong> {user.cargo}</p>
                <p><strong>Área:</strong> {typeof user.area === "object" ? user.area?.nombre : "Sin área"}</p>
                <p><strong>Rol:</strong>{" "}
                  <span className="badge bg-blue-100 text-blue-700">{user.rol}</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <BotonIcono texto="Editar perfil" Icono={Pencil} onClick={() => setModoEdicion(true)} />
              </div>
            </div>
          ) : (
            <EditarPerfil salirEdicion={() => setModoEdicion(false)} />
          )}

          {/* 🔁 Botones de navegación sin restricción de ancho */}
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-4">
              <button
                onClick={() => setVista("usuarios")}
                className={`btn-primary ${vista === "usuarios" ? "opacity-100" : "opacity-70"}`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setVista("areas")}
                className={`btn-primary ${vista === "areas" ? "opacity-100" : "opacity-70"}`}
              >
                Áreas
              </button>
              <button
                onClick={() => setVista("incidencias")}
                className={`btn-primary ${vista === "incidencias" ? "opacity-100" : "opacity-70"}`}
              >
                Incide
              </button>
              <button
                onClick={() => navigate("/admin/publicaciones")}
                className="btn-primary opacity-70 hover:opacity-100 transition"
              >
                Publicaciones
              </button>
              <button
                onClick={() => navigate("/admin/tareas")}
                className="btn-primary opacity-70 hover:opacity-100 transition"
              >
                Tareas
              </button>
            </div>
          </div>

          <div className="w-full">
            {vista === "usuarios" && <UsuariosAdmin />}
            {vista === "areas" && <AreasAdmin />}
            {vista === "incidencias" && <IncidenciasAdmin />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
