import { useEffect, useState } from "react";
import type { Usuario } from "../../types/Usuario";
import type { Area } from "../../types/Area";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { showToast } from "../../helpers/showToast";
import BotonIcono from "../../components/ui/BotonIcono";
import { ArrowLeft } from "lucide-react";
import FiltrosUsuarios from "../../pages/usuario/FiltrosUsuarios"; // ✅ nuevo componente

type Props = {
  volver: () => void;
};

const UsuariosVisibles: React.FC<Props> = ({ volver }) => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = `${u.nombre} ${u.apellidos}`
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideArea = !filtroArea || u.area?._id === filtroArea;
    return coincideNombre && coincideArea;
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resUsuarios = await fetchWithAuth<{ usuarios: Usuario[] }>(
          "user/usuarios",
          token
        );
        const resAreas = await fetchWithAuth<{ areas: Area[] }>(
          "area/listar",
          token
        );
        setUsuarios(resUsuarios.usuarios);
        setAreas(resAreas.areas);
      } catch {
        showToast("Error cargando usuarios o áreas", "error");
      }
    };
    cargarDatos();
  }, [token]);

  return (
    <div className="px-1 sm:px-2 py-6 space-y-6 fade-in">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-semibold">👥 Lista de Usuarios</h2>
        <BotonIcono
          texto="Regresar"
          Icono={ArrowLeft}
          onClick={volver}
          variante="secundario"
        />
      </div>

      {/* 🔍 Filtros integrados como componente modular */}
      <FiltrosUsuarios
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        filtroArea={filtroArea}
        setFiltroArea={setFiltroArea}
        areas={areas}
      />

      {usuariosFiltrados.length === 0 ? (
        <p className="text-gray-500 italic">
          No se encontraron usuarios con los filtros aplicados.
        </p>
      ) : (
        <div className="space-y-4">
          {usuariosFiltrados.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-4 bg-white p-4 rounded shadow border"
            >
              <img
                src={getAvatarUrl(u.imagen || "default.png")}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">
                  {u.nombre} {u.apellidos}
                </p>
                <p className="text-xs text-gray-500">
                  {u.area && typeof u.area === "object"
                    ? u.area.nombre
                    : "Sin área"}{" "}
                  • {u.rol}
                </p>
              </div>
              <span
                className={`badge ${
                  u.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {u.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuariosVisibles;
