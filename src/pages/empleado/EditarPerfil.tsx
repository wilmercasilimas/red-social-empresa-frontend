import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { toast } from "react-toastify";

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
      // Subir avatar si hay archivo
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file0", avatarFile);

        const res = await fetch("https://red-social-empresa-backend.onrender.com/api/user/subir", {
          method: "POST",
          headers: {
            Authorization: token ?? "", // ✅ Corregido
          },
          body: formData,
        });

        const data = await res.json();
        if (data.status === "success") {
          actualizarAvatar?.(data.user.imagen);
          toast.success("Avatar actualizado correctamente");
        } else {
          toast.error("Error al subir el avatar");
        }
      }

      // Cambiar contraseña si ambas están presentes
      if (passwordActual && passwordNueva) {
        const res = await fetch("https://red-social-empresa-backend.onrender.com/api/user/cambiar-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "", // ✅ Corregido
          },
          body: JSON.stringify({
            password_actual: passwordActual,
            password_nueva: passwordNueva,
          }),
        });

        const data = await res.json();
        if (data.status === "success") {
          toast.success("Contraseña actualizada correctamente");
        } else {
          toast.error(data.message || "Error al cambiar la contraseña");
        }
      }

      // Esperar y salir
      setTimeout(() => salirEdicion(), 4000);
    } catch {
      toast.error("Hubo un error al actualizar el perfil"); // ✅ 'err' eliminado
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel animate-slide-up space-y-6">
      {/* Avatar actual */}
      <div className="flex items-center gap-4">
        <img
          src={getAvatarUrl(user?.imagen)}
          alt="Avatar actual"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Contraseña actual */}
      <div>
        <label className="block font-medium">Contraseña actual</label>
        <input
          type={mostrarPassword ? "text" : "password"}
          className="input-field w-full"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
        />
      </div>

      {/* Nueva contraseña */}
      <div>
        <label className="block font-medium">Nueva contraseña</label>
        <input
          type={mostrarPassword ? "text" : "password"}
          className="input-field w-full"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
        />
      </div>

      {/* Mostrar / Ocultar contraseña */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ver-password"
          checked={mostrarPassword}
          onChange={() => setMostrarPassword(!mostrarPassword)}
        />
        <label htmlFor="ver-password" className="text-sm">Mostrar contraseñas</label>
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <button type="submit" className="btn-primary">
          Guardar cambios
        </button>
        <button type="button" className="btn-secondary" onClick={salirEdicion}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarPerfil;
