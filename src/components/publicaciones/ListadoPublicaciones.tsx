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
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>(
          "publicacion/todas",
          token || ""
        );
        setPublicaciones(data.publicaciones);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    obtenerPublicaciones();
  }, [token]);

  return (
    <div className="space-y-6 fade-in p-4">
      <h2 className="text-xl font-semibold text-gray-800">📢 Publicaciones</h2>

      {publicaciones.length === 0 ? (
        <p className="text-gray-500">No hay publicaciones aún.</p>
      ) : (
        publicaciones.map((pub) => (
          <div
            key={pub._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={getAvatarUrl(pub.autor.imagen || "default.png")}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {pub.autor.nombre} {pub.autor.apellidos}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFecha(pub.creado_en)}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-wrap">{pub.texto}</p>

            {pub.imagen && (
              <img
                src={
                  pub.imagen.startsWith("http")
                    ? pub.imagen
                    : `${Global.url.replace(/\/api\/$/, "")}/uploads/publicaciones/${pub.imagen}`
                }
                alt="publicacion"
                className="rounded-lg max-h-96 object-contain border cursor-zoom-in hover:opacity-90 transition"
                onClick={() => setImagenAmpliada(pub.imagen ?? null)}
              />
            )}

            {pub.tarea && (
              <p className="text-sm text-gray-600">
                🗒️ Tarea relacionada: <strong>{pub.tarea.titulo}</strong>
              </p>
            )}
          </div>
        ))
      )}

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={
              imagenAmpliada.startsWith("http")
                ? imagenAmpliada
                : `${Global.url.replace(/\/api\/$/, "")}/uploads/publicaciones/${imagenAmpliada}`
            }
            className="w-full h-full object-contain p-4"
            alt="Ampliada"
          />
        </div>
      )}
    </div>
  );
};

export default ListadoPublicaciones;
