import React, { useEffect, useState, useCallback } from "react";
import { cargarTareasAsignadas } from "../../services/tareas";
import type { TareaCompleta } from "../../types/Tarea";
import TareaCard from "../../components/tareas/TareaCard";
import { showToast } from "../../helpers/showToast";

interface Props {
  volver: () => void;
}

const MisTareas: React.FC<Props> = ({ volver }) => {
  const [tareas, setTareas] = useState<TareaCompleta[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(5);
  const [loading, setLoading] = useState(true);

  const obtenerTareas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cargarTareasAsignadas(pagina, limite);

      if (!data || !Array.isArray(data.tareas)) {
        showToast("Error al cargar tus tareas", "error");
        return;
      }

      if (data.tareas.length === 0) {
        showToast("No tienes tareas asignadas actualmente.", "info");
      }

      setTareas(data.tareas);
      setTotal(data.total || 0);
    } catch {
      showToast("Error al cargar tus tareas", "error");
    } finally {
      setLoading(false);
    }
  }, [pagina, limite]);

  useEffect(() => {
    obtenerTareas();
  }, [obtenerTareas]);

  const totalPaginas = Math.ceil(total / limite);

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
        <>
          {tareas.map((tarea) => (
            <TareaCard key={tarea._id} tarea={tarea} />
          ))}

          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
              disabled={pagina === 1}
              className="btn-secondary"
            >
              ← Anterior
            </button>
            <span className="px-3 py-2 text-gray-700 bg-white border rounded">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((prev) => prev + 1)}
              disabled={pagina === totalPaginas}
              className="btn-secondary"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MisTareas;
