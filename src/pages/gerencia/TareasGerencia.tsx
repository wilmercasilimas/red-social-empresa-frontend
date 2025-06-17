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
import BotonIcono from "../../components/ui/BotonIcono";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const TareasGerencia: React.FC = () => {
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
  const [tareaEditando, setTareaEditando] = useState<TareaCompleta | null>(null);

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
    setPagina(1);
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
      <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 fade-in space-y-6 relative z-0">
        <div className="flex justify-end">
          <BotonIcono
            texto="Volver al panel"
            Icono={ArrowLeft}
            onClick={() => navigate("/gerencia")}
            variante="secundario"
          />
        </div>

        <div className="relative z-10">
          <div className="card-panel animate-slide-up">
            <h1 className="text-xl font-bold mb-2">
              <span role="img" aria-label="tareas">🗘️</span> Gestión de tareas
            </h1>
            <p className="text-gray-600 mb-4">
              Aquí podrás crear, editar, eliminar y filtrar tareas por área,
              creador y usuario asignado.
            </p>
            <FormularioTarea onSuccess={handleSuccess} />
          </div>
        </div>

        <div className="card-panel animate-slide-up relative z-0">
          <FiltrosTareas onFiltrar={handleFiltrar} />
        </div>

        <div className="card-panel animate-slide-up relative z-0">
          <ListadoTareas
            tareas={tareas}
            mostrarControles={true}
            onEditar={handleEditar}
            paginaActual={pagina}
          />

          {totalPaginas > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <BotonIcono
                texto="Anterior"
                Icono={ChevronLeft}
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 1}
                variante="secundario"
              />
              <BotonIcono
                texto="Siguiente"
                Icono={ChevronRight}
                onClick={() => setPagina(pagina + 1)}
                disabled={pagina === totalPaginas}
                variante="secundario"
              />
            </div>
          )}
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