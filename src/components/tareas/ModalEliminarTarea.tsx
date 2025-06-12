import React from "react";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { showToast } from "../../helpers/showToast";
import { useAuth } from "../../hooks/useAuth";

interface ModalEliminarTareaProps {
  tareaId: string;
  onClose: () => void;
  onTareaEliminada: () => void;
}

const ModalEliminarTarea: React.FC<ModalEliminarTareaProps> = ({ tareaId, onClose, onTareaEliminada }) => {
  const { token } = useAuth();

  const handleEliminar = async () => {
    try {
      const respuesta = await fetchWithAuth(
        `tarea/eliminar/${tareaId}`,
        token,
        { method: "DELETE" }
      );

      const data = respuesta as {
        status: string;
        message: string;
      };

      if (data.status === "success") {
        showToast("Tarea eliminada correctamente", "success");
        onTareaEliminada();
        onClose();
      } else {
        showToast(data.message || "Error al eliminar tarea", "error");
      }
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      showToast("Error de red o del servidor", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
        <p className="text-sm text-gray-700 mb-6">
          Esta acción eliminará la tarea de forma permanente.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="btn">
            Cancelar
          </button>
          <button onClick={handleEliminar} className="btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarTarea;
