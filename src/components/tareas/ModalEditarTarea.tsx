import React, { useState } from "react";
import type { TareaCompleta } from "../../types/Tarea";
import { showToast } from "../../helpers/showToast";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";

interface ModalEditarTareaProps {
  tarea: TareaCompleta;
  onClose: () => void;
  onTareaActualizada: () => void;
}

interface RespuestaApi {
  status: string;
  message: string;
  tarea?: TareaCompleta;
}

const ModalEditarTarea: React.FC<ModalEditarTareaProps> = ({
  tarea,
  onClose,
  onTareaActualizada,
}) => {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [estado, setEstado] = useState<TareaCompleta["estado"]>(tarea.estado);
  const [fecha_entrega, setFechaEntrega] = useState(
    tarea.fecha_entrega?.slice(0, 10) || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const respuesta = await fetchWithAuth(
        `tarea/editar/${tarea._id}`,
        token,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo,
            descripcion,
            fecha_entrega,
            estado,
          }),
        }
      );

      const data = respuesta as RespuestaApi;

      if (data.status === "success") {
        showToast("Tarea actualizada correctamente", "success");
        onTareaActualizada();
        onClose();
      } else {
        showToast(data.message || "Error al actualizar la tarea", "error");
      }
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      showToast("Error de red o del servidor", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full input"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full textarea"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Fecha de entrega</label>
            <input
              type="date"
              value={fecha_entrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full input"
            />
          </div>

          <div>
            <label className="block font-medium">Estado</label>
            <select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as TareaCompleta["estado"])
              }
              className="w-full select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarTarea;
