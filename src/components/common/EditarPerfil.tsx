// src/components/common/EditarPerfil.tsx
import React, { useState } from "react";
import { showToast } from "../../helpers/showToast";
import Global from "../../helpers/Global";

interface Props {
  salirEdicion: () => void;
}

const EditarPerfil: React.FC<Props> = ({ salirEdicion }) => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Cambiar contraseña
      if (passwordActual && passwordNueva) {
        const res = await fetch(`${Global.url}user/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            password_actual: passwordActual,
            password_nueva: passwordNueva,
          }),
        });

        const data = await res.json();
        showToast(data.message, data.status === "success" ? "success" : "error");
      }

      // Cambiar avatar
      if (avatar) {
        const formData = new FormData();
        formData.append("file0", avatar);

        const res = await fetch(`${Global.url}user/avatar`, {
          method: "POST",
          headers: { Authorization: token || "" },
          body: formData,
        });

        const data = await res.json();
        showToast(data.message, data.status === "success" ? "success" : "error");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      showToast("Error al actualizar perfil", "error");
    }

    setLoading(false);
    setAvatar(null);
    setPasswordActual("");
    setPasswordNueva("");

    // Salir del modo edición tras 2s
    setTimeout(() => salirEdicion(), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-4 mt-6 animate-slide-up">
      <h3 className="text-xl font-bold">Editar Perfil</h3>

      {/* ✅ Input avatar custom */}
      <div>
        <label className="form-label">Cambiar avatar</label>
        <div className="flex items-center gap-4">
          <img
            src={avatar ? URL.createObjectURL(avatar) : "/img/user.png"}
            alt="Preview"
            className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow"
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
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Contraseña actual</label>
        <input
          type="password"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Nueva contraseña</label>
        <input
          type="password"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="btn-primary" disabled={loading}>
          Guardar
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={salirEdicion}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarPerfil;
