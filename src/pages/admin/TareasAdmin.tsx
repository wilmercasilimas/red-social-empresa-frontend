import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/common/Topbar";
import FormularioTarea from "../../components/tareas/FormularioTarea";
import FiltrosTareas from "../../components/tareas/FiltrosTareas";
import ListadoTareas from "../../components/tareas/ListadoTareas";
import ModalEditarTarea from "../../components/tareas/ModalEditarTarea";
import ModalEliminarTarea from "../../components/tareas/ModalEliminarTarea";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";
import type { TareaCompleta } from "../../types/Tarea";

const TareasAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tareas, setTareas] = useState<TareaCompleta[]>([]);
  const [filtros, setFiltros] = useState<{
    asignada_a?: string;
    creada_por?: string;
    area?: string;
  }>({});
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [tareaAEditar, setTareaAEditar] = useState<TareaCompleta | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<TareaCompleta | null>(null);

  const cargarTareas = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.asignada_a) params.append("asignada_a", filtros.asignada_a);
      if (filtros.creada_por) params.append("creada_por", filtros.creada_por);
      if (filtros.area) params.append("area", filtros.area);
      params.append("pagina", pagina.toString());
      params.append("limite", limite.toString());

      const url = `tarea/todas?${params.toString()}`;
      const data = await fetchWithAuth<{
        tareas: TareaCompleta[];
        pagina: number;
        paginas: number;
        limite: number;
      }>(url, token);

      if (!data.tareas) {
        showToast("Error en el formato de datos", "error");
        return;
      }

      setTareas(data.tareas);
      setPagina(data.pagina);
      setLimite(data.limite);
      setTotalPaginas(data.paginas);
    } catch {
      showToast("Error al obtener tareas desde el servidor", "error");
    }
  }, [token, filtros, pagina, limite]);

  const handleSuccess = () => {
    cargarTareas();
  };

  const handleFiltrar = (nuevosFiltros: typeof filtros) => {
    setFiltros(nuevosFiltros);
    setPagina(1); // reset paginación al filtrar
  };

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="flex justify-end">
          <button onClick={() => navigate("/admin")} className="btn-secondary">
            ← Volver al panel
          </button>
        </div>

        <div className="card-panel animate-slide-up relative z-10">
          <h1 className="text-xl font-bold mb-2">
            <span role="img" aria-label="tareas">🗘️</span> Gestión de tareas
          </h1>
          <p className="text-gray-600 mb-4">
            Aquí podrás crear, editar, eliminar y filtrar tareas por área, creador y usuario asignado.
          </p>

          <FormularioTarea onSuccess={handleSuccess} />
        </div>

        <div className="card-panel animate-slide-up">
          <FiltrosTareas onFiltrar={handleFiltrar} />
        </div>

        <div className="card-panel animate-slide-up">
          <ListadoTareas
            tareas={tareas}
            mostrarControles={true}
            onEditar={(tarea) => setTareaAEditar(tarea)}
            onEliminar={(id) => {
              const tareaSeleccionada = tareas.find((t) => t._id === id);
              if (tareaSeleccionada) {
                setTareaAEliminar(tareaSeleccionada);
              }
            }}
            paginaActual={pagina}
          />

          {totalPaginas > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className="btn-outline"
              >
                ← Anterior
              </button>

              <button
                disabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
                className="btn-outline"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {tareaAEditar && (
        <ModalEditarTarea
          tarea={tareaAEditar}
          onClose={() => setTareaAEditar(null)}
          onTareaActualizada={handleSuccess}
        />
      )}

      {tareaAEliminar && (
        <ModalEliminarTarea
          tareaId={tareaAEliminar._id}
          onClose={() => setTareaAEliminar(null)}
          onTareaEliminada={handleSuccess}
        />
      )}
    </>
  );
};

export default TareasAdmin;