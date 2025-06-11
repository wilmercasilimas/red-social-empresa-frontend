import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/common/Topbar";
import FormularioTarea from "../../components/tareas/FormularioTarea";
import ListadoTareas from "../../components/tareas/ListadoTareas";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import type { TareaCompleta } from "../../types/Tarea";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";

const TareasGerencia: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tareas, setTareas] = useState<TareaCompleta[]>([]);

  const cargarTareas = useCallback(async () => {
    try {
      const data = await fetchWithAuth<{ tareas: TareaCompleta[] }>(
        "tarea/listar",
        token
      );

      if (!data.tareas) {
        showToast("Error en el formato de datos", "error");
        return;
      }

      setTareas(data.tareas);
    } catch {
  showToast("Error al obtener tareas desde el servidor", "error");
}

  }, [token]);

  const handleSuccess = () => {
    cargarTareas();
  };

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

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

          <FormularioTarea onSuccess={handleSuccess} />
        </div>

        <div className="card-panel animate-slide-up">
          <ListadoTareas
            tareas={tareas}
            mostrarControles={true}
          />
        </div>
      </div>
    </>
  );
};

export default TareasGerencia;
