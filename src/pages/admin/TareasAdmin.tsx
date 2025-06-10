import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/common/Topbar";

const TareasAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="flex justify-end">
          <button onClick={() => navigate("/admin")} className="btn-secondary">
            ← Volver al panel
          </button>
        </div>

        <div className="card-panel animate-slide-up">
          <h1 className="text-xl font-bold mb-2">
            <span role="img" aria-label="tareas">📝</span> Gestión de tareas
          </h1>
          <p className="text-gray-600 mb-2">
            Aquí podrás crear, editar, eliminar y filtrar tareas por área, creador y usuario asignado.
          </p>
          <p className="text-sm italic text-gray-400">
            (Componente en construcción...)
          </p>
        </div>
      </div>
    </>
  );
};

export default TareasAdmin;
