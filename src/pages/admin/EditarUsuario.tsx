import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { showToast } from "../../helpers/showToast";
import { formatFecha } from "../../helpers/formatFecha";

interface Area {
  _id: string;
  nombre: string;
  descripcion?: string;
}

interface Incidencia {
  _id: string;
  tipo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  cargo: string;
  area: Area;
  rol: string;
  activo?: boolean;
  fecha_ingreso?: string;
}

interface Props {
  usuario: Usuario;
  onUsuarioActualizado: () => void;
  onCancelar: () => void;
}

const EditarUsuario: React.FC<Props> = ({
  usuario,
  onUsuarioActualizado,
  onCancelar,
}) => {
  const [formData, setFormData] = useState({
    ...usuario,
    activo: usuario.activo ?? true,
    fecha_ingreso: usuario.fecha_ingreso ?? "",
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);

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

    const obtenerIncidencias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          Global.url + `incidencia/usuario/${usuario._id}`,
          {
            headers: { Authorization: token || "" },
          }
        );
        const data = await response.json();
        if (data.status === "success") setIncidencias(data.incidencias);
      } catch (error) {
        console.error("Error al obtener incidencias:", error);
      }
    };

    obtenerAreas();
    obtenerIncidencias();
  }, [usuario._id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        activo: formData.activo,
        fecha_ingreso: formData.fecha_ingreso,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        Global.url + "user/usuario/" + formData._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(payload),
        }
      );

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
    <>
      <form
        onSubmit={handleSubmit}
        className="card-panel p-4 shadow animate-fade-in"
      >
        <h3 className="text-lg font-semibold mb-4">Editar usuario</h3>

        {mensaje && (
          <div
            className={`mb-4 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
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
              setFormData({
                ...formData,
                area: selectedArea || { _id: e.target.value, nombre: "" },
              });
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
          <input
            type="date"
            name="fecha_ingreso"
            className="input-field"
            value={formData.fecha_ingreso?.substring(0, 10) || ""}
            onChange={handleChange}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            Activo
          </label>
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

      {incidencias.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border rounded shadow">
          <h4 className="text-sm font-semibold mb-2">
            📋 Incidencias recientes
          </h4>
          <ul className="text-sm list-disc list-inside text-gray-700">
            {incidencias.map((i) => (
              <li key={i._id}>
                <strong>{i.tipo}</strong>: {formatFecha(i.fecha_inicio)} - {formatFecha(i.fecha_fin)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default EditarUsuario;
