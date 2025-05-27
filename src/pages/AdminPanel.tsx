import React from "react";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";
import UsuariosAdmin from "./admin/UsuariosAdmin";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="card-panel animate-slide-up">
          <h2 className="title-main mb-4 animate-slide-up-slow">
            Panel de Administración
          </h2>

          <p className="text-gray-700">
            Bienvenido,{" "}
            <strong>
              {user?.nombre} {user?.apellidos}
            </strong>
            . Este es tu panel administrativo.
          </p>
          <p className="text-sm text-gray-500">
            Desde aquí podrás gestionar usuarios, áreas, tareas e incidencias.
          </p>
        </div>

        {/* Sección de usuarios */}
        <UsuariosAdmin />
      </div>
    </>
  );
};

export default AdminPanel;
