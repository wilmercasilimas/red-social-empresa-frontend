import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { toast } from "react-toastify";

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
  imagen?: string;
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
      }
    };

    obtenerAreas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const subirAvatar = async () => {
    if (!avatarFile) return;

    try {
      const token = localStorage.getItem("token");
      const formDataUpload = new FormData();
      formDataUpload.append("file0", avatarFile);

      const res = await fetch(Global.url + "user/subir", {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success("Avatar actualizado correctamente");
        return data.user.imagen;
      } else {
        toast.error("Error al subir el avatar");
        return null;
      }
    } catch {
      toast.error("Error inesperado al subir avatar");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setStatus("");

    try {
      let nuevaImagen = formData.imagen;

      if (avatarFile) {
        const subida = await subirAvatar();
        if (subida) {
          nuevaImagen = subida;
        } else {
          return;
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(Global.url + "user/usuario/" + formData._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          ...formData,
          area: formData.area?._id || "",
          imagen: nuevaImagen,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setStatus("success");
        setMensaje("Usuario actualizado correctamente.");
        onUsuarioActualizado();
      } else {
        setStatus("error");
        setMensaje(data.message || "Error al actualizar usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setStatus("error");
      setMensaje("Ocurrió un error inesperado.");
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

      <div className="flex items-center gap-4 mb-4">
        <img
          src={getAvatarUrl(formData.imagen)}
          alt="Avatar"
          className="w-16 h-16 rounded-full border object-cover"
          onError={(e) => {
            e.currentTarget.src = "/img/user.png";
          }}
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

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
          onChange={(e) =>
            setFormData({
              ...formData,
              area: { ...formData.area, _id: e.target.value },
            })
          }
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
