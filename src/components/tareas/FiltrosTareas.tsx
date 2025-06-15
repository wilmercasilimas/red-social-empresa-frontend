import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import type { Usuario } from "../../types/Usuario";
import type { Area } from "../../types/Area";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";
import Select from "react-select";

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

  const handleChange = (campo: keyof FiltroTarea, valor: string | undefined) => {
    const nuevosFiltros = { ...filtros, [campo]: valor || undefined };
    setFiltros(nuevosFiltros);
    onFiltrar(nuevosFiltros);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Filtrar tareas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Asignado a</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              ...usuarios.map((u) => ({
                value: u._id,
                label: `${u.nombre} ${u.apellidos}`,
              })),
            ]}
            value={
              filtros.asignada_a
                ? {
                    value: filtros.asignada_a,
                    label:
                      usuarios.find((u) => u._id === filtros.asignada_a)?.nombre +
                      " " +
                      usuarios.find((u) => u._id === filtros.asignada_a)?.apellidos,
                  }
                : { value: "", label: "Todos" }
            }
            onChange={(op) => handleChange("asignada_a", op?.value || undefined)}
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            menuPosition="absolute"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Creador</label>
          <Select
            options={[
              { value: "", label: "Todos" },
              ...usuarios.map((u) => ({
                value: u._id,
                label: `${u.nombre} ${u.apellidos}`,
              })),
            ]}
            value={
              filtros.creada_por
                ? {
                    value: filtros.creada_por,
                    label:
                      usuarios.find((u) => u._id === filtros.creada_por)?.nombre +
                      " " +
                      usuarios.find((u) => u._id === filtros.creada_por)?.apellidos,
                  }
                : { value: "", label: "Todos" }
            }
            onChange={(op) => handleChange("creada_por", op?.value || undefined)}
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            menuPosition="absolute"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Área</label>
          <Select
            options={[
              { value: "", label: "Todas" },
              ...areas.map((a) => ({ value: a._id, label: a.nombre })),
            ]}
            value={
              filtros.area
                ? {
                    value: filtros.area,
                    label: areas.find((a) => a._id === filtros.area)?.nombre || "",
                  }
                : { value: "", label: "Todas" }
            }
            onChange={(op) => handleChange("area", op?.value || undefined)}
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            menuPosition="absolute"
          />
        </div>
      </div>
    </div>
  );
};

export default FiltrosTareas;
