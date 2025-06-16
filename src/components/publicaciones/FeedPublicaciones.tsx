// src/components/publicaciones/FeedPublicaciones.tsx
import { useEffect, useState, useCallback } from "react";
import type { Publicacion } from "../../types/Publicacion";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";
import ComentariosPublicacion from "../comentarios/ComentariosPublicacion";
import BotonIcono from "../ui/BotonIcono";
import { Eye, EyeOff } from "lucide-react";

const FeedPublicaciones: React.FC = () => {
  const { token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [comentariosVisibles, setComentariosVisibles] = useState<Record<string, boolean>>({});
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const cargarPublicaciones = useCallback(async () => {
    try {
      const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>(
        "publicacion/todas",
        token
      );
      setPublicaciones(data.publicaciones);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  }, [token]);

  useEffect(() => {
    cargarPublicaciones();
  }, [cargarPublicaciones]);

  const toggleComentarios = (id: string) => {
    setComentariosVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 p-4 fade-in">
      {publicaciones.map((pub) => (
        <div
          key={pub._id}
          className="bg-white rounded-xl shadow p-4 space-y-3 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(pub.autor?.imagen || "default.png")}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Avatar"
            />
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {pub.autor?.nombre} {pub.autor?.apellidos}
              </p>
              <p className="text-xs text-gray-500">
                {formatFecha(pub.creado_en)}
              </p>
            </div>
          </div>

          <p className="text-gray-700 text-sm whitespace-pre-wrap">{pub.texto}</p>

          {pub.imagen && (
            <img
              src={
                pub.imagen.startsWith("http")
                  ? pub.imagen
                  : `/uploads/publicaciones/${pub.imagen}`
              }
              alt="Imagen"
              onClick={() => setImagenAmpliada(pub.imagen ?? null)}
              className="w-full max-w-md max-h-[400px] mx-auto rounded-lg object-cover border cursor-zoom-in hover:opacity-90 transition"
            />
          )}

          <div className="flex justify-end">
            <BotonIcono
              texto={comentariosVisibles[pub._id] ? "Ocultar" : "Comentarios"}
              Icono={comentariosVisibles[pub._id] ? EyeOff : Eye}
              onClick={() => toggleComentarios(pub._id)}
              variante="secundario"
            />
          </div>

          {comentariosVisibles[pub._id] && (
            <ComentariosPublicacion
              publicacionId={pub._id}
              onComentarioAgregado={cargarPublicaciones}
            />
          )}
        </div>
      ))}

      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={
              imagenAmpliada.startsWith("http")
                ? imagenAmpliada
                : `/uploads/publicaciones/${imagenAmpliada}`
            }
            className="w-full h-full object-contain p-4"
            alt="Ampliada"
          />
        </div>
      )}
    </div>
  );
};

export default FeedPublicaciones;
