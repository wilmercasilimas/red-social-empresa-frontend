import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";

interface Comentario {
  _id: string;
  contenido: string;
  creado_en: string;
  autor: {
    _id: string;
    nombre: string;
    apellidos: string;
    imagen?: string;
  };
}

interface ListaComentariosProps {
  publicacionId: string;
}

const ListaComentarios = ({ publicacionId }: ListaComentariosProps) => {
  const { token } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const data = await fetchWithAuth<{ comentarios: Comentario[] }>(
          `comentario/publicacion/${publicacionId}`,
          token
        );
        setComentarios(data.comentarios);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setCargando(false);
      }
    };

    if (token && publicacionId) cargarComentarios();
  }, [token, publicacionId]);

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold text-gray-700">🗨 Comentarios</h3>
      {cargando ? (
        <p className="text-sm text-gray-500">Cargando comentarios...</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm italic text-gray-400">Sin comentarios aún.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {comentarios.map((comentario) => (
            <li key={comentario._id} className="py-3 flex items-start gap-4">
              <img
                src={getAvatarUrl(comentario.autor.imagen || "default.png")}
                className="w-10 h-10 rounded-full object-cover border"
                alt="Avatar"
              />
              <div>
                <p className="text-sm font-medium">
                  {comentario.autor.nombre} {comentario.autor.apellidos}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatFecha(comentario.creado_en)}
                  </span>
                </p>
                <p className="text-sm text-gray-700">{comentario.contenido}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaComentarios;