import React, { useEffect, useState } from "react";
import type { TareaCompleta } from "../../types/Tarea";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { showToast } from "../../helpers/showToast";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  tarea?: TareaCompleta;
  onSuccess: () => void;
}

type UsuarioMinimo = {
  _id: string;
  nombre: string;
  apellidos: string;
};

const FormularioTarea: React.FC<Props> = ({ tarea, onSuccess }) => {
  const { token } = useAuth();

  const [titulo, setTitulo] = useState(tarea?.titulo || "");
  const [descripcion, setDescripcion] = useState(tarea?.descripcion || "");
  const [asignadaA, setAsignadaA] = useState(
    tarea?.asignada_a && typeof tarea.asignada_a === "object"
      ? tarea.asignada_a._id
      : ""
  );
  const [fechaEntrega, setFechaEntrega] = useState(
    tarea?.fecha_entrega?.slice(0, 10) || ""
  );
  const [usuarios, setUsuarios] = useState<UsuarioMinimo[]>([]);
  const [loading, setLoading] = useState(false);

  const modoEdicion = !!tarea;

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await fetchWithAuth("user/lista-empleados", token) as UsuarioMinimo[];
        setUsuarios(data);
      } catch {
        showToast("Error al cargar usuarios", "error");
      }
    };
    cargarUsuarios();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descripcion || !asignadaA || !fechaEntrega) {
      return showToast("Completa todos los campos", "warn");
    }

    const payload = {
      titulo,
      descripcion,
      asignada_a: asignadaA,
      fecha_entrega: fechaEntrega,
    };

    try {
      setLoading(true);
      if (modoEdicion) {
        await fetchWithAuth(`tarea/editar/${tarea?._id}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Tarea actualizada exitosamente", "success");
      } else {
        await fetchWithAuth("tarea/crear", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Tarea creada exitosamente", "success");
      }
      onSuccess();
    } catch {
      showToast("Error al guardar la tarea", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded p-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {modoEdicion ? "✏️ Editar Tarea" : "📝 Nueva Tarea"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="input"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Asignar a</label>
        <select
          value={asignadaA}
          onChange={(e) => setAsignadaA(e.target.value)}
          className="input"
        >
          <option value="">-- Selecciona un usuario --</option>
          {(usuarios as UsuarioMinimo[]).map((u) => (
            <option key={u._id} value={u._id}>
              {u.nombre} {u.apellidos}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Fecha de entrega
        </label>
        <input
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className="input"
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {modoEdicion ? "Guardar cambios" : "Crear tarea"}
      </button>
    </form>
  );
};

export default FormularioTarea;
