import { useCallback, useEffect, useState } from "react";
import type { Publicacion } from "../../types/Publicacion";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";

type PublicacionesGerenciaProps = {
  volver: () => void;
};

const PublicacionesGerencia: React.FC<PublicacionesGerenciaProps> = ({ volver }) => {
  const { token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPublicaciones = useCallback(async () => {
    if (!token || token.trim() === "") return;
    try {
      const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>(
        "publicacion/todas",
        token
      );
      setPublicaciones(data.publicaciones);
    } catch (err) {
      console.error("Error obteniendo publicaciones:", err);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    const delayTokenCheck = setTimeout(() => {
      cargarPublicaciones();
    }, 200);
    return () => clearTimeout(delayTokenCheck);
  }, [cargarPublicaciones]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-2">📚 Publicaciones</h2>
        <button onClick={volver} className="btn-secondary text-sm">
          ← Volver al panel
        </button>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <table className="table-auto w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2">Autor</th>
              <th className="p-2">Tarea</th>
              <th className="p-2">Texto</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {publicaciones.map((pub) => (
              <tr key={pub._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {pub.autor ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarUrl(pub.autor.imagen || "default.png")}
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Avatar"
                      />
                      <span>
                        {pub.autor.nombre} {pub.autor.apellidos}
                      </span>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">Autor desconocido</span>
                  )}
                </td>
                <td className="p-2">{pub.tarea?.titulo || "Sin tarea"}</td>
                <td className="p-2 text-sm">{pub.texto}</td>
                <td className="p-2 text-sm">{formatFecha(pub.creado_en)}</td>
                <td className="p-2">
                  {pub.imagen ? (
                    <img
                      src={
                        pub.imagen.startsWith("http")
                          ? pub.imagen
                          : `/uploads/publicaciones/${pub.imagen}`
                      }
                      alt="Imagen"
                      className="h-16 rounded border"
                    />
                  ) : (
                    <span className="text-xs italic text-gray-400">Sin imagen</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PublicacionesGerencia;
