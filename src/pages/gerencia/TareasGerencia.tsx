import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/common/Topbar";
import FormularioTarea from "../../components/tareas/FormularioTarea";

const TareasGerencia: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Aquí podrías recargar la lista de tareas en el futuro
    
  };

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="flex justify-end">
          <button onClick={() => navigate("/gerencia")} className="btn-secondary">
            ← Volver al panel
          </button>
        </div>

        <div className="card-panel animate-slide-up">
          <h1 className="text-xl font-bold mb-2">
            <span role="img" aria-label="tareas">📝</span> Gestión de tareas
          </h1>
          <p className="text-gray-600 mb-4">
            Aquí podrás crear, editar, eliminar y filtrar tareas por área, creador y usuario asignado.
          </p>

          {/* Formulario para nueva tarea */}
          <FormularioTarea onSuccess={handleSuccess} />
        </div>

        {/* Listado de tareas (pendiente) */}
        <div className="card-panel animate-slide-up">
          <p className="text-sm italic text-gray-400">
            (Listado de tareas en construcción...)
          </p>
        </div>
      </div>
    </>
  );
};

export default TareasGerencia;
