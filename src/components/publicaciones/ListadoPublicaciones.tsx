import { useEffect, useState } from "react";
import { formatFecha } from "../../helpers/formatFecha";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { useAuth } from "../../hooks/useAuth";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import Global from "../../helpers/Global";

interface Usuario {
  nombre: string;
  apellidos: string;
  email: string;
  imagen?: string;
}

interface Tarea {
  titulo: string;
}

interface Publicacion {
  _id: string;
  texto: string;
  imagen?: string;
  creado_en: string;
  autor: Usuario;
  tarea?: Tarea;
}

const ListadoPublicaciones = () => {
  const { token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>(
          "publicacion/todas",
          token || ""
        );
        setPublicaciones(data.publicaciones);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al obtener publicaciones:", error.message);
        } else {
          console.error("Error desconocido al obtener publicaciones");
        }
      }
    };

    obtenerPublicaciones();
  }, [token]);

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-xl font-semibold text-gray-700">📢 Publicaciones</h2>
      {publicaciones.length === 0 ? (
        <p className="text-gray-500">No hay publicaciones aún.</p>
      ) : (
        publicaciones.map((pub) => (
          <div
            key={pub._id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={getAvatarUrl(pub.autor.imagen)}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {pub.autor.nombre} {pub.autor.apellidos}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFecha(pub.creado_en)}
                </p>
              </div>
            </div>
            <p className="mb-2">{pub.texto}</p>
            {pub.imagen && (
              <img
                src={`${Global.url.replace(/\/api\/$/, "")}/uploads/publicaciones/${pub.imagen}`}
                alt="publicacion"
                className="rounded-lg max-h-96 object-contain border"
              />
            )}
            {pub.tarea && (
              <p className="mt-2 text-sm text-gray-600">
                🗒️ Tarea relacionada: <strong>{pub.tarea.titulo}</strong>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ListadoPublicaciones;
