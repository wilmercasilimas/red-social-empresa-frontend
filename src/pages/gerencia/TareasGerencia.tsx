import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/common/Topbar";
import FormularioTarea from "../../components/tareas/FormularioTarea";
import ListadoTareas from "../../components/tareas/ListadoTareas";
import FiltrosTareas from "../../components/tareas/FiltrosTareas";
import ModalEditarTarea from "../../components/tareas/ModalEditarTarea";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import type { TareaCompleta } from "../../types/Tarea";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";

const TareasGerencia: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [tareas, setTareas] = useState<TareaCompleta[]>([]);
  const [filtros, setFiltros] = useState<{
    asignada_a?: string;
    creada_por?: string;
    area?: string;
  }>({});

  const [tareaEditando, setTareaEditando] = useState<TareaCompleta | null>(null);

  const cargarTareas = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (filtros.asignada_a) params.append("asignada_a", filtros.asignada_a);
      if (filtros.creada_por) params.append("creada_por", filtros.creada_por);
      if (filtros.area) params.append("area", filtros.area);

      const url = `tarea/todas?${params.toString()}`;

      const data = await fetchWithAuth<{ tareas: TareaCompleta[] }>(url, token);

      if (!data.tareas) {
        showToast("Error en el formato de datos", "error");
        return;
      }

      setTareas(data.tareas);
    } catch {
      showToast("Error al obtener tareas desde el servidor", "error");
    }
  }, [token, filtros]);

  const handleSuccess = () => {
    cargarTareas();
  };

  const handleFiltrar = (nuevosFiltros: typeof filtros) => {
    setFiltros(nuevosFiltros);
  };

  const handleEditar = (tarea: TareaCompleta) => {
    setTareaEditando(tarea);
  };

  const cerrarModalEditar = () => {
    setTareaEditando(null);
  };

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gray-100 p-8 fade-in space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/gerencia")}
            className="btn-secondary"
          >
            ← Volver al panel
          </button>
        </div>

        <div className="card-panel animate-slide-up">
          <h1 className="text-xl font-bold mb-2">
            <span role="img" aria-label="tareas">
              📝
            </span>{" "}
            Gestión de tareas
          </h1>
          <p className="text-gray-600 mb-4">
            Aquí podrás crear, editar, eliminar y filtrar tareas por área,
            creador y usuario asignado.
          </p>

          <FormularioTarea onSuccess={handleSuccess} />
        </div>

        <div className="card-panel animate-slide-up">
          <FiltrosTareas onFiltrar={handleFiltrar} />
        </div>

        <div className="card-panel animate-slide-up">
          <ListadoTareas tareas={tareas} mostrarControles={true} onEditar={handleEditar} />
        </div>
      </div>

      {tareaEditando && (
        <ModalEditarTarea
          tarea={tareaEditando}
          onClose={cerrarModalEditar}
          onTareaActualizada={handleSuccess}
        />
      )}
    </>
  );
};

export default TareasGerencia;
