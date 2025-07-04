// UsuariosAdmin.tsx (modificado con columna fija "Usuario")
import React, { useEffect, useState } from "react";
import type { Usuario } from "../../types/Usuario";
import AgregarUsuario from "./AgregarUsuario";
import EditarUsuario from "./EditarUsuario";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { Info, Edit, Trash2, Plus, X } from "lucide-react";
import { formatFecha } from "../../helpers/formatFecha";
import BotonIcono from "../../components/ui/BotonIcono";
import FiltrosUsuarios from "../usuario/FiltrosUsuarios";
import type { Area } from "../../types/Area";

const UsuariosAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = `${u.nombre} ${u.apellidos}`.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideArea = !filtroArea || u.area?._id === filtroArea;
    return coincideNombre && coincideArea;
  });

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

  const obtenerAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/area/listar",
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") setAreas(data.areas);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
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
      }
    } catch (error) {
      console.error("❌ Error en la solicitud DELETE:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerAreas();
  }, []);

  return (
    <div className="card-panel animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="title-main animate-slide-right">Gestión de usuarios</h2>
          <p className="text-gray-600">
            Aquí puedes ver, editar y eliminar usuarios registrados.
          </p>
        </div>
        <BotonIcono
          texto={mostrarFormulario ? "Cancelar" : "Agregar usuario"}
          Icono={mostrarFormulario ? X : Plus}
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setUsuarioEditando(null);
          }}
        />
      </div>

      <div className="mb-6">
        <FiltrosUsuarios
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          filtroArea={filtroArea}
          setFiltroArea={setFiltroArea}
          areas={areas}
        />
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
                <th className="py-2 px-4 sticky left-0 z-10 bg-blue-600">Usuario</th>
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
              {usuariosFiltrados.map((usuario) => {
                const estaAusente =
                  usuario.incidencias_activas &&
                  usuario.incidencias_activas.length > 0;
                return (
                  <tr key={usuario._id} className="hover:bg-gray-100 transition">
                    <td className="py-2 px-0 sticky left-0 z-0 bg-white">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(usuario.imagen ?? "")}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => {
                            e.currentTarget.src = "/img/user.png";
                          }}
                        />
                        <span className="text-sm font-medium">
                          {usuario.nombre} {usuario.apellidos}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-4">{usuario.email}</td>
                    <td className="py-2 px-4">{usuario.cargo}</td>
                    <td className="py-2 px-4">{usuario.area?.nombre || "Sin área"}</td>
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
                      {estaAusente ? (
                        <div className="flex items-center gap-1">
                          <span className="badge bg-yellow-100 text-yellow-800">
                            Ausente
                          </span>
                          <span className="relative group cursor-pointer" aria-hidden="true">
                            <Info className="w-4 h-4 text-gray-500" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-gray-800 border border-gray-300 rounded p-2 shadow text-xs z-10 whitespace-nowrap">
                              {usuario.incidencias_activas?.map((i, idx) => (
                                <div key={idx}>
                                  <span className="font-semibold">{i.tipo}</span>
                                  : {formatFecha(i.fecha_inicio)} - {formatFecha(i.fecha_fin)}
                                </div>
                              ))}
                            </div>
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`badge ${
                            usuario.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-4">
                      {usuario.fecha_ingreso
                        ? formatFecha(usuario.fecha_ingreso)
                        : "No disponible"}
                    </td>
                    <td className="py-2 px-4">
                      {usuario.creado_en
                        ? formatFecha(usuario.creado_en)
                        : "No disponible"}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <BotonIcono
                          texto="Editar"
                          Icono={Edit}
                          onClick={() => {
                            setUsuarioEditando(usuario);
                            setMostrarFormulario(false);
                          }}
                          className="text-sm"
                        />
                        <BotonIcono
                          texto="Eliminar"
                          Icono={Trash2}
                          onClick={() => handleEliminarUsuario(usuario._id)}
                          variante="peligro"
                          className="text-sm"
                        />
                      </div>
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
