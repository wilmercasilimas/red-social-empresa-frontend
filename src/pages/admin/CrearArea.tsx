import React, { useState } from "react";
import Global from "../../helpers/Global";

interface Props {
  onAreaCreada: () => void;
}

const CrearArea: React.FC<Props> = ({ onAreaCreada }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setStatus("");

    if (!formData.nombre.trim()) {
      setStatus("error");
      setMensaje("El nombre del área es obligatorio.");
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
        setStatus("success");
        setMensaje("Área creada correctamente.");
        setFormData({ nombre: "", descripcion: "" });
        onAreaCreada(); // ← Recargar lista
      } else {
        setStatus("error");
        setMensaje(data.message || "Error al crear el área.");
      }
    } catch (error) {
      console.error("Error al crear área:", error);
      setStatus("error");
      setMensaje("Ocurrió un error inesperado.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-4 shadow animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Crear nueva área</h3>

      {mensaje && (
        <div className={`mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </div>
      )}

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
        ></textarea>
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
