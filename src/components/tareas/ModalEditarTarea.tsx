import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import type { TareaCompleta } from "../../types/Tarea";
import { showToast } from "../../helpers/showToast";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import BotonIcono from "../ui/BotonIcono";
import { Save, X } from "lucide-react"; // ✅ Íconos

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
  const [fechaEntrega, setFechaEntrega] = useState<Date | null>(
    tarea.fecha_entrega ? new Date(tarea.fecha_entrega) : null
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
            estado,
            fecha_entrega: fechaEntrega?.toISOString(),
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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative z-[60]">
        <h2 className="text-xl font-bold mb-4">Editar tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="form-label">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input-field"
              rows={3}
              required
            ></textarea>
          </div>

          <div>
            <label className="form-label">Fecha de entrega</label>
            <DatePicker
              selected={fechaEntrega}
              onChange={(date) => setFechaEntrega(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Selecciona una fecha"
              className="input-field"
            />
          </div>

          <div>
            <label className="form-label">Estado</label>
            <Select
              options={[
                { value: "pendiente", label: "Pendiente" },
                { value: "en progreso", label: "En progreso" },
                { value: "completada", label: "Completada" },
              ]}
              value={{
                value: estado,
                label: estado.charAt(0).toUpperCase() + estado.slice(1),
              }}
              onChange={(option) =>
                setEstado(option?.value as TareaCompleta["estado"])
              }
              classNamePrefix="react-select"
              placeholder="Selecciona estado"
              menuPlacement="auto"
              menuPosition="fixed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <BotonIcono
              texto="Cancelar"
              Icono={X}
              onClick={onClose}
              variante="secundario"
            />
            <BotonIcono
              type="submit"
              texto="Guardar"
              Icono={Save}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarTarea;
