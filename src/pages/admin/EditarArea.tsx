import React, { useState } from "react";
import Global from "../../helpers/Global";
import { showToast } from "../../helpers/showToast";
import type { Area } from "../../types/Area";

interface Props {
  area: Area;
  onAreaActualizada: () => void;
  onCancelar: () => void;
}

const EditarArea: React.FC<Props> = ({ area, onAreaActualizada, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: area.nombre,
    descripcion: area.descripcion || "",
  });

  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setStatus("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${Global.url}area/editar/${area._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("Área actualizada correctamente");
        setStatus("success");
        setMensaje("Área actualizada correctamente.");
        onAreaActualizada();
      } else {
        showToast(data.message || "Error al actualizar el área", "error");
        setStatus("error");
        setMensaje(data.message || "Error al actualizar el área.");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Ocurrió un error al actualizar", "error");
      setStatus("error");
      setMensaje("Ocurrió un error al actualizar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-4 shadow animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Editar Área</h3>

      {mensaje && (
        <div className={`mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="nombre"
          className="input-field"
          placeholder="Nombre del área"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <textarea
          name="descripcion"
          className="input-field"
          placeholder="Descripción (opcional)"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button type="button" className="btn-danger" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default EditarArea;
