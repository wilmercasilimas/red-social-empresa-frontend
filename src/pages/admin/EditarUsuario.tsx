import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { showToast } from "../../helpers/showToast";

interface Area {
  _id: string;
  nombre: string;
  descripcion?: string;
}

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  cargo: string;
  area: Area;
  rol: string;
}

interface Props {
  usuario: Usuario;
  onUsuarioActualizado: () => void;
  onCancelar: () => void;
}

const EditarUsuario: React.FC<Props> = ({ usuario, onUsuarioActualizado, onCancelar }) => {
  const [formData, setFormData] = useState({ ...usuario });
  const [areas, setAreas] = useState<Area[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const obtenerAreas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(Global.url + "area/listar", {
          headers: { Authorization: token || "" },
        });
        const data = await response.json();
        if (data.status === "success") setAreas(data.areas);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      }
    };

    obtenerAreas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setStatus("");

    try {
      const payload = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        cargo: formData.cargo,
        area: formData.area?._id || "",
        rol: formData.rol,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(Global.url + "user/usuario/" + formData._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "success") {
        setStatus("success");
        setMensaje("Usuario actualizado correctamente.");
        showToast("Usuario actualizado correctamente");
        onUsuarioActualizado();
      } else {
        setStatus("error");
        setMensaje(data.message || "Error al actualizar usuario.");
        showToast(data.message || "Error al actualizar usuario", "error");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setStatus("error");
      setMensaje("Ocurrió un error inesperado.");
      showToast("Error inesperado al actualizar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-4 shadow animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Editar usuario</h3>

      {mensaje && (
        <div className={`mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="input-field"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          className="input-field"
          value={formData.apellidos}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cargo"
          placeholder="Cargo"
          className="input-field"
          value={formData.cargo}
          onChange={handleChange}
          required
        />
        <select
          name="area"
          className="input-field"
          value={formData.area?._id || ""}
          onChange={(e) => {
            const selectedArea = areas.find((a) => a._id === e.target.value);
            setFormData({ ...formData, area: selectedArea || { _id: e.target.value, nombre: "" } });
          }}
          required
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a._id} value={a._id}>
              {a.nombre}
            </option>
          ))}
        </select>
        <select
          name="rol"
          className="input-field"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="empleado">Empleado</option>
          <option value="gerente">Gerente</option>
          <option value="admin">Administrador</option>
        </select>
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

export default EditarUsuario;
