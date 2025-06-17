import React from "react";
import Select from "react-select";
import type { Area } from "../../types/Area";

interface FiltrosUsuariosProps {
  filtroNombre: string;
  setFiltroNombre: (valor: string) => void;

  filtroArea: string;
  setFiltroArea: (valor: string) => void;

  areas: Area[];
}

const FiltrosUsuarios: React.FC<FiltrosUsuariosProps> = ({
  filtroNombre,
  setFiltroNombre,
  filtroArea,
  setFiltroArea,
  areas,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtrar usuarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🔎 NOMBRE / APELLIDO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por nombre o apellido
          </label>
          <input
            type="text"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="Ej: Pérez"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* 🏢 ÁREA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por área
          </label>
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

export default FiltrosUsuarios;
