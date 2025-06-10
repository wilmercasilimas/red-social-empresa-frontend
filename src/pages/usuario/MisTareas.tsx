import React, { useEffect, useState } from "react";
import { cargarTareasAsignadas } from "../../services/tareas";
import type { TareaCompleta } from "../../types/Tarea";
import TareaCard from "../../components/tareas/TareaCard";
import { showToast } from "../../helpers/showToast";

interface Props {
  volver: () => void;
}

const MisTareas: React.FC<Props> = ({ volver }) => {
  const [tareas, setTareas] = useState<TareaCompleta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTareas = async () => {
      setLoading(true);
      const data = await cargarTareasAsignadas();
      if (data.length === 0) {
        showToast("No tienes tareas asignadas actualmente.", "info");
      }
      setTareas(data);
      setLoading(false);
    };

    obtenerTareas();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={volver}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
        >
          ← Volver al panel
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">📋 Mis Tareas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando tareas...</p>
      ) : tareas.length === 0 ? (
        <p className="text-gray-500">No hay tareas asignadas.</p>
      ) : (
        tareas.map((tarea) => <TareaCard key={tarea._id} tarea={tarea} />)
      )}
    </div>
  );
};

export default MisTareas;
