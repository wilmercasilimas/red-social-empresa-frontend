import React, { useState } from "react";
import Global from "../../helpers/Global";
import { showToast } from "../../helpers/showToast";

interface Props {
  onAreaCreada: () => void;
}

const CrearArea: React.FC<Props> = ({ onAreaCreada }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      showToast("El nombre del área es obligatorio.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(Global.url + "area/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("Área creada correctamente");
        setFormData({ nombre: "", descripcion: "" });
        onAreaCreada();
      } else {
        showToast(data.message || "Error al crear el área", "error");
      }
    } catch (error) {
      console.error("Error al crear área:", error);
      showToast("Ocurrió un error inesperado al crear el área", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-4 shadow animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Crear nueva área</h3>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del área"
          className="input-field"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción (opcional)"
          className="input-field resize-none"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default CrearArea;
