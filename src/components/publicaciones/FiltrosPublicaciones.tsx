import React from "react";
import Select from "react-select";
import type { Usuario } from "../../types/Usuario";
import type { Tarea } from "../../types/Tarea";
import type { Area } from "../../types/Area";

interface FiltrosPublicacionesProps {
  autores: Usuario[];
  tareas: Tarea[];
  areas: Area[];

  filtroAutor: string;
  setFiltroAutor: (valor: string) => void;

  filtroTarea: string;
  setFiltroTarea: (valor: string) => void;

  filtroArea: string;
  setFiltroArea: (valor: string) => void;
}

const FiltrosPublicaciones: React.FC<FiltrosPublicacionesProps> = ({
  autores,
  tareas,
  areas,
  filtroAutor,
  setFiltroAutor,
  filtroTarea,
  setFiltroTarea,
  filtroArea,
  setFiltroArea,
}) => {
  const autorSeleccionado = autores.find((a) => a._id === filtroAutor);

  return (
    <div className="bg-white p-4 rounded shadow mb-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Filtrar publicaciones</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TAREA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tarea</label>
          <Select
            options={[
              { value: "", label: "Todas" },
              ...tareas.map((t) => ({ value: t._id, label: t.titulo })),
            ]}
            value={{
              value: filtroTarea,
              label:
                tareas.find((t) => t._id === filtroTarea)?.titulo || "Todas",
            }}
            onChange={(op) => setFiltroTarea(op?.value || "")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* AUTOR */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Autor</label>
          <Select
            options={[
              { value: "", label: "Todas" },
              ...autores.map((a) => ({
                value: a._id,
                label: `${a.nombre} ${a.apellidos}`,
              })),
            ]}
            value={{
              value: filtroAutor,
              label: autorSeleccionado
                ? `${autorSeleccionado.nombre} ${autorSeleccionado.apellidos}`
                : "Todas",
            }}
            onChange={(op) => setFiltroAutor(op?.value || "")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* ÁREA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Área</label>
          <Select
            options={[
              { value: "", label: "Todas" },
              ...areas.map((area) => ({
                value: area._id,
                label: area.nombre,
              })),
            ]}
            value={{
              value: filtroArea,
              label:
                areas.find((a) => a._id === filtroArea)?.nombre || "Todas",
            }}
            onChange={(op) => setFiltroArea(op?.value || "")}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>
    </div>
  );
};

export default FiltrosPublicaciones;
