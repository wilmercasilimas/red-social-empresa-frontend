import React from "react";
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
  return (
    <div className="bg-white p-4 rounded shadow mb-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Filtrar publicaciones</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tarea</label>
          <select
            value={filtroTarea}
            onChange={(e) => setFiltroTarea(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            {tareas.map((t) => (
              <option key={t._id} value={t._id}>
                {t.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Autor</label>
          <select
            value={filtroAutor}
            onChange={(e) => setFiltroAutor(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {autores.map((a) => (
              <option key={a._id} value={a._id}>
                {a.nombre} {a.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Área</label>
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosPublicaciones;
