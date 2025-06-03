import React, { useState, useEffect } from "react";
import { showToast } from "../ui/showToast";

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
}

interface Props {
  onIncidenciaCreada: () => void;
}

const FormularioIncidencia: React.FC<Props> = ({ onIncidenciaCreada }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState({
    tipo: "permiso",
    descripcion: "",
    usuario: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://red-social-empresa-backend.onrender.com/api/user/usuarios", {
        headers: { Authorization: token || "" },
      });
      const data = await response.json();
      if (data.status === "success") setUsuarios(data.usuarios);
    } catch {
      showToast("Error al cargar usuarios", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        // ✅ Evitar toISOString: usar string con hora fija
        fecha_inicio: `${form.fecha_inicio}T12:00:00`,
        fecha_fin: `${form.fecha_fin}T23:59:59`,
      };

      const response = await fetch("https://red-social-empresa-backend.onrender.com/api/incidencia/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "success") {
        showToast("Incidencia registrada", "success");
        setForm({ tipo: "permiso", descripcion: "", usuario: "", fecha_inicio: "", fecha_fin: "" });
        onIncidenciaCreada();
      } else {
        showToast(data.message || "Error al registrar incidencia", "error");
      }
    } catch {
      showToast("Error al registrar la incidencia", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded-md shadow-md space-y-4 mt-4">
      <div>
        <label className="block font-medium">Empleado:</label>
        <select name="usuario" value={form.usuario} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">-- Selecciona un usuario --</option>
          {usuarios.map((u) => (
            <option key={u._id} value={u._id}>
              {u.nombre} {u.apellidos}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Tipo de incidencia:</label>
        <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="permiso">Permiso</option>
          <option value="reposo">Reposo</option>
          <option value="falta">Falta</option>
          <option value="cumpleaños">Cumpleaños</option>
          <option value="aniversario">Aniversario</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Descripción:</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Fecha inicio:</label>
        <input
          type="date"
          name="fecha_inicio"
          value={form.fecha_inicio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Fecha fin:</label>
        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Registrar Incidencia
      </button>
    </form>
  );
};

export default FormularioIncidencia;
