import React, { useEffect, useState } from "react";
import type { Usuario } from "../../types/Usuario";
import AgregarUsuario from "./AgregarUsuario";
import EditarUsuario from "./EditarUsuario";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";

const UsuariosAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/user/usuarios",
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") setUsuarios(data.usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUsuario = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://red-social-empresa-backend.onrender.com/api/user/usuario/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setUsuarios((prev) => prev.filter((u) => u._id !== id));
        console.log("✅ Usuario eliminado correctamente");
      } else {
        console.error("❌ Error al eliminar usuario:", data.message);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud DELETE:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="card-panel animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="title-main animate-slide-right">
            Gestión de usuarios
          </h2>
          <p className="text-gray-600">
            Aquí puedes ver, editar y eliminar usuarios registrados.
          </p>
        </div>
        <button
          className="btn-primary animate-bounce-slow"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setUsuarioEditando(null);
          }}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar usuario"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-6">
          <AgregarUsuario onUsuarioAgregado={obtenerUsuarios} />
        </div>
      )}

      {usuarioEditando && (
        <div className="mb-6">
          <EditarUsuario
            usuario={{
              ...usuarioEditando,
              area: usuarioEditando.area ?? { _id: "", nombre: "Sin área" },
            }}
            onUsuarioActualizado={() => {
              setUsuarioEditando(null);
              obtenerUsuarios();
            }}
            onCancelar={() => setUsuarioEditando(null)}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 shadow rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Usuario</th>
                <th className="py-2 px-4">Correo</th>
                <th className="py-2 px-4">Cargo</th>
                <th className="py-2 px-4">Área</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4">Activo</th>
                <th className="py-2 px-4">Ingreso</th>
                <th className="py-2 px-4">Creado</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                console.log("🟡 Usuario recibido:", usuario); // 👈 Diagnóstico
                return (
                  <tr
                    key={usuario._id}
                    className="hover:bg-gray-100 transition"
                  >
                    <td className="py-2 px-4 flex items-center gap-3">
                      <img
                        src={getAvatarUrl(usuario.imagen ?? "")}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.currentTarget.src = "/img/user.png";
                        }}
                      />
                      <span>
                        {usuario.nombre} {usuario.apellidos}
                      </span>
                    </td>
                    <td className="py-2 px-4">{usuario.email}</td>
                    <td className="py-2 px-4">{usuario.cargo}</td>
                    <td className="py-2 px-4">
                      {usuario.area?.nombre || "Sin área"}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`badge ${
                          usuario.rol === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`badge ${
                          usuario.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {usuario.fecha_ingreso
                        ? new Date(usuario.fecha_ingreso).toLocaleDateString()
                        : "No disponible"}
                    </td>
                    <td className="py-2 px-4">
                      {usuario.creado_en
                        ? new Date(usuario.creado_en).toLocaleDateString()
                        : "No disponible"}
                    </td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        className="btn-primary text-sm"
                        onClick={() => {
                          setUsuarioEditando(usuario);
                          setMostrarFormulario(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger text-sm"
                        onClick={() => handleEliminarUsuario(usuario._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuariosAdmin;
