import { useCallback, useEffect, useState } from "react";
import type { Publicacion } from "../../types/Publicacion";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";
import ComentariosPublicacion from "../../components/comentarios/ComentariosPublicacion";

type PublicacionesGerenciaProps = {
  volver: () => void;
};

const PublicacionesGerencia: React.FC<PublicacionesGerenciaProps> = ({ volver }) => {
  const { token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [comentariosVisibles, setComentariosVisibles] = useState<{ [id: string]: boolean }>({});

  const cargarPublicaciones = useCallback(async () => {
    if (!token || token.trim() === "") return;
    try {
      const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>("publicacion/todas", token);
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

  const toggleComentarios = (id: string) => {
    setComentariosVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <div className="space-y-6">
          {publicaciones.map((pub) => (
            <div
              key={pub._id}
              className="bg-white rounded-lg shadow p-4 space-y-3 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(pub.autor?.imagen || "default.png")}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Avatar"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {pub.autor?.nombre} {pub.autor?.apellidos}
                  </p>
                  <p className="text-xs text-gray-500">{formatFecha(pub.creado_en)}</p>
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
                  className="max-w-xs rounded border"
                />
              )}

              <div className="text-right">
                <button
                  onClick={() => toggleComentarios(pub._id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  {comentariosVisibles[pub._id] ? "Ocultar comentarios" : "Ver comentarios"}
                </button>
              </div>

              {comentariosVisibles[pub._id] && (
                <ComentariosPublicacion
                  publicacionId={pub._id}
                  onComentarioAgregado={cargarPublicaciones}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicacionesGerencia;