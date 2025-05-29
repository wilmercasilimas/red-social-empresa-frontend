import React, { useState } from "react";
import Global from "../../helpers/Global";
import { useAuth } from "../../hooks/useAuth";


interface Props {
  salirEdicion: () => void;
}

const EditarPerfil: React.FC<Props> = ({ salirEdicion }) => {
  const { token, actualizarAvatar } = useAuth();

  const [formPassword, setFormPassword] = useState({
    password_actual: "",
    password_nueva: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPassword({
      ...formPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const cambiarPassword = async () => {
    try {
      const response = await fetch(`${Global.url}user/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(formPassword),
      });

      const data = await response.json();

      if (data.status === "success") {
        setMensaje("✅ Contraseña actualizada correctamente.");
      } else {
        setMensaje(`❌ ${data.message || "No se pudo cambiar la contraseña."}`);
      }
    } catch {
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  const subirAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("file0", avatar);

    try {
      const response = await fetch(`${Global.url}user/subir`, {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setMensaje("✅ Avatar actualizado correctamente.");

        // ✅ Actualizar avatar globalmente usando el nombre devuelto
        if (actualizarAvatar) {
          actualizarAvatar(data.user.imagen);
        }
      } else {
        setMensaje(`❌ ${data.message || "No se pudo actualizar el avatar."}`);
      }
    } catch {
      setMensaje("❌ Error al subir el avatar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formPassword.password_actual && formPassword.password_nueva) {
      await cambiarPassword();
    }

    if (avatar) {
      await subirAvatar();
    }

    setTimeout(() => salirEdicion(), 4000);
  };

  return (
    <div className="card-panel animate-slide-up p-4 max-w-md mx-auto mt-8 shadow-lg rounded-2xl bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Editar Perfil</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Contraseña actual:</label>
          <input
            type={mostrarPassword ? "text" : "password"}
            name="password_actual"
            value={formPassword.password_actual}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Tu contraseña actual"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Nueva contraseña:</label>
          <input
            type={mostrarPassword ? "text" : "password"}
            name="password_nueva"
            value={formPassword.password_nueva}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Nueva contraseña"
            required
          />
        </div>

        <div className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={mostrarPassword}
              onChange={() => setMostrarPassword(!mostrarPassword)}
            />
            Mostrar contraseñas
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Cambiar Avatar:</label>
          <input
            type="file"
            name="file0"
            accept="image/*"
            onChange={handleAvatarChange}
            className="input-field w-full"
          />
        </div>

        {mensaje && (
          <div className="text-center mb-4 text-sm text-blue-600 animate-pulse">
            {mensaje}
          </div>
        )}

        <button type="submit" className="btn-primary w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditarPerfil;
