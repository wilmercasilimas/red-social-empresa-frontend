import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { showToast } from "../../helpers/showToast";

interface EditarPerfilProps {
  salirEdicion: () => void;
}

const EditarPerfil: React.FC<EditarPerfilProps> = ({ salirEdicion }) => {
  const { user, token, actualizarAvatar } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file0", avatarFile);

        const res = await fetch("https://red-social-empresa-backend.onrender.com/api/user/subir", {
          method: "POST",
          headers: {
            Authorization: token ?? "",
          },
          body: formData,
        });

        const data = await res.json();
        if (data.status === "success") {
          actualizarAvatar?.(data.user.imagen);
          showToast("Avatar actualizado correctamente");
        } else {
          showToast("Error al subir el avatar", "error");
        }
      }

      if (passwordActual && passwordNueva) {
        const res = await fetch("https://red-social-empresa-backend.onrender.com/api/user/cambiar-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
          body: JSON.stringify({
            password_actual: passwordActual,
            password_nueva: passwordNueva,
          }),
        });

        const data = await res.json();
        if (data.status === "success") {
          showToast("Contraseña actualizada correctamente");
        } else {
          showToast(data.message || "Error al cambiar la contraseña", "error");
        }
      }

      setTimeout(() => salirEdicion(), 4000);
    } catch {
      showToast("Hubo un error al actualizar el perfil", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel animate-slide-up space-y-6">
      {/* ✅ Sección avatar con preview + input custom */}
      <div>
        <label className="form-label">Cambiar avatar</label>
        <div className="flex items-center gap-4">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : getAvatarUrl(user?.imagen)}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow"
          />
          <label
            htmlFor="avatarInput"
            className="cursor-pointer bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Seleccionar imagen
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Contraseña actual</label>
        <input
          type={mostrarPassword ? "text" : "password"}
          className="input-field w-full"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Nueva contraseña</label>
        <input
          type={mostrarPassword ? "text" : "password"}
          className="input-field w-full"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ver-password"
          checked={mostrarPassword}
          onChange={() => setMostrarPassword(!mostrarPassword)}
        />
        <label htmlFor="ver-password" className="text-sm">Mostrar contraseñas</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="btn-primary">
          Guardar
        </button>
        <button type="button" className="btn-secondary" onClick={salirEdicion}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarPerfil;
