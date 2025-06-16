import { useEffect, useState, useCallback } from "react";
import type { Comentario } from "../../types/Comentario";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { useAuth } from "../../hooks/useAuth";
import { formatFecha } from "../../helpers/formatFecha";
import { showToast } from "../../helpers/showToast";
import BotonIcono from "../ui/BotonIcono";
import { Send } from "lucide-react";

interface Props {
  publicacionId: string;
  onComentarioAgregado?: () => Promise<void>;
}

const ComentariosPublicacion: React.FC<Props> = ({
  publicacionId,
  onComentarioAgregado,
}) => {
  const { token } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarComentarios = useCallback(async () => {
    if (!token) return;
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
  }, [token, publicacionId]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    try {
      await fetchWithAuth("comentario/crear", token, {
        method: "POST",
        body: JSON.stringify({
          contenido: nuevoComentario,
          publicacion: publicacionId,
        }),
      });
      setNuevoComentario("");
      showToast("Comentario enviado", "success");
      await cargarComentarios();
      if (onComentarioAgregado) await onComentarioAgregado();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      showToast("Error al enviar comentario", "error");
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [cargarComentarios]);

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded border space-y-4">
      <h4 className="font-semibold">💬 Comentarios</h4>

      {cargando ? (
        <p className="text-sm text-gray-500">Cargando comentarios...</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm italic text-gray-400">Sin comentarios aún.</p>
      ) : (
        <ul className="space-y-2">
          {comentarios.map((comentario) => (
            <li
              key={comentario._id}
              className="border p-2 rounded bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={getAvatarUrl(comentario.autor.imagen || "default.png")}
                  className="w-6 h-6 rounded-full object-cover"
                  alt="Avatar"
                />
                <span className="text-sm font-semibold">
                  {comentario.autor.nombre} {comentario.autor.apellidos}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {formatFecha(comentario.creado_en)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comentario.contenido}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Nuevo comentario */}
      <div className="mt-4">
        <textarea
          rows={2}
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="input-field"
        ></textarea>
        <BotonIcono
          texto="Comentar"
          Icono={Send}
          onClick={enviarComentario}
          variante="primario"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default ComentariosPublicacion;
