// src/components/tareas/FiltrosTareas.tsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import type { Usuario } from "../../types/Usuario";
import type { Area } from "../../types/Area";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";

export type FiltroTarea = {
  asignada_a?: string;
  creada_por?: string;
  area?: string;
};

type FiltrosTareasProps = {
  onFiltrar: (filtros: FiltroTarea) => void;
};

const FiltrosTareas: React.FC<FiltrosTareasProps> = ({ onFiltrar }) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filtros, setFiltros] = useState<FiltroTarea>({});

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await fetchWithAuth<{ usuarios: Usuario[] }>("user/usuarios", token);
        setUsuarios(data.usuarios);
      } catch {
        showToast("Error al cargar usuarios", "error");
      }
    };

    const cargarAreas = async () => {
      try {
        const data = await fetchWithAuth<{ areas: Area[] }>("area/listar", token);
        setAreas(data.areas);
      } catch {
        showToast("Error al cargar áreas", "error");
      }
    };

    cargarUsuarios();
    cargarAreas();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nuevoValor = value || undefined;
    const nuevosFiltros = { ...filtros, [name]: nuevoValor };
    setFiltros(nuevosFiltros);
    onFiltrar(nuevosFiltros);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Filtrar tareas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Asignado a</label>
          <select
            name="asignada_a"
            value={filtros.asignada_a || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} {u.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Creador</label>
          <select
            name="creada_por"
            value={filtros.creada_por || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} {u.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Área</label>
          <select
            name="area"
            value={filtros.area || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Todas</option>
            {areas.map((a) => (
              <option key={a._id} value={a._id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosTareas;
