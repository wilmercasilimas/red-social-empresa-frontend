import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import AreasAdmin from "./admin/AreasAdmin"; // ✅ Este es el import correcto

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [vista, setVista] = useState<"usuarios" | "areas">("usuarios");

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="card-panel animate-slide-up">
          <h2 className="title-main mb-4 animate-slide-up-slow">
            Panel de Administración
          </h2>
          <p className="text-gray-700">
            Bienvenido, <strong>{user?.nombre} {user?.apellidos}</strong>. Este es tu panel administrativo.
          </p>
          <p className="text-sm text-gray-500">
            Desde aquí podrás gestionar usuarios, áreas, tareas e incidencias.
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-4">
          <button
            onClick={() => setVista("usuarios")}
            className={`btn-primary ${vista === "usuarios" ? "opacity-100" : "opacity-70"}`}
          >
            Ver usuarios
          </button>
          <button
            onClick={() => setVista("areas")}
            className={`btn-primary ${vista === "areas" ? "opacity-100" : "opacity-70"}`}
          >
            Ver áreas
          </button>
        </div>

        {/* Render dinámico */}
        {vista === "usuarios" && <UsuariosAdmin />}
        {vista === "areas" && <AreasAdmin />}
      </div>
    </>
  );
};

export default AdminPanel;
