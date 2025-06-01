import React, { useState, useEffect } from "react";
import Global from "../../helpers/Global";
import { showToast } from "../../helpers/showToast";

interface Area {
  _id: string;
  nombre: string;
}

interface Props {
  onUsuarioAgregado: () => void;
}

const AgregarUsuario: React.FC<Props> = ({ onUsuarioAgregado }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    cargo: "",
    area: "",
    rol: "empleado",
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    const obtenerAreas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(Global.url + "area/listar", {
          headers: {
            Authorization: token || "",
          },
        });
        const data = await response.json();
        if (data.status === "success") {
          setAreas(data.areas);
        }
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        showToast("Error al cargar las áreas", "error");
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

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(Global.url + "user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("Usuario registrado exitosamente");
        setFormData({
          nombre: "",
          apellidos: "",
          email: "",
          password: "",
          cargo: "",
          area: "",
          rol: "empleado",
        });
        onUsuarioAgregado();
      } else {
        showToast(data.message || "Error al registrar usuario", "error");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      showToast("Ocurrió un error inesperado", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel p-4 shadow animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Agregar nuevo usuario</h3>

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
        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña temporal"
            className="input-field pr-10"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-sm text-blue-500"
            onClick={() => setMostrarPassword(!mostrarPassword)}
          >
            {mostrarPassword ? "Ocultar" : "Ver"}
          </span>
        </div>
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
          value={formData.area}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a._id} value={a._id}>{a.nombre}</option>
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
      <div className="mt-4 flex justify-end">
        <button type="submit" className="btn-primary">
          Registrar usuario
        </button>
      </div>
    </form>
  );
};

export default AgregarUsuario;
