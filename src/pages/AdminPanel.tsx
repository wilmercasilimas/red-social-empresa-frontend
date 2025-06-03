import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import UsuariosAdmin from "./admin/UsuariosAdmin";
import AreasAdmin from "./admin/AreasAdmin";
import IncidenciasAdmin from "./admin/IncidenciasAdmin";
import BienvenidaPanel from "../components/common/BienvenidaPanel";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [vista, setVista] = useState<"usuarios" | "areas" | "incidencias">("usuarios");

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <BienvenidaPanel titulo="Panel de Administración" user={user} descripcion="Desde aquí podrás gestionar usuarios, áreas, tareas e incidencias." />

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
          <button
            onClick={() => setVista("incidencias")}
            className={`btn-primary ${vista === "incidencias" ? "opacity-100" : "opacity-70"}`}
          >
            Ver incidencias
          </button>
        </div>

        {vista === "usuarios" && <UsuariosAdmin />}
        {vista === "areas" && <AreasAdmin />}
        {vista === "incidencias" && <IncidenciasAdmin />}
      </div>
    </>
  );
};

export default AdminPanel;
