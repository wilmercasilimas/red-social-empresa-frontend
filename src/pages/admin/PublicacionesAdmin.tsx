import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Publicacion } from "../../types/Publicacion";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";
import FormularioPublicacion from "../../components/publicaciones/FormularioPublicacion";
import ModalEditarPublicacion from "../../components/publicaciones/ModalEditarPublicacion";
import { showToast } from "../../helpers/showToast";
import ComentariosPublicacion from "../../components/comentarios/ComentariosPublicacion";

const PublicacionesAdmin = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<Publicacion | null>(null);
  const [mostrarComentarios, setMostrarComentarios] = useState<string | null>(null);

  const cargarPublicaciones = useCallback(async () => {
    if (!token || token.trim() === "") return;
    try {
      const data = await fetchWithAuth<{ publicaciones: Publicacion[] }>(
        "publicacion/todas",
        token
      );
      setPublicaciones(data.publicaciones);
    } catch (err) {
      console.debug("[fetchWithAuth] Error obteniendo publicaciones:", err);
    } finally {
      setCargando(false);
    }
  }, [token]);

  const eliminarPublicacion = async (id: string) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta publicación?");
    if (!confirmar) return;

    try {
      await fetchWithAuth(`publicacion/eliminar/${id}`, token, {
        method: "DELETE",
      });
      showToast("Publicación eliminada", "success");
      await cargarPublicaciones();
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
      showToast("Error al eliminar la publicación", "error");
    }
  };

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
        <button onClick={() => navigate("/admin")} className="btn-secondary text-sm">
          ← Volver al panel
        </button>
      </div>

      <FormularioPublicacion onPublicacionCreada={cargarPublicaciones} />

      {cargando ? (
        <p className="text-gray-500">Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <div className="space-y-6">
          {publicaciones.map((pub) => (
            <div key={pub._id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(pub.autor?.imagen || "default.png")}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Avatar"
                  />
                  <div>
                    <p className="font-semibold">
                      {pub.autor?.nombre} {pub.autor?.apellidos}
                    </p>
                    <p className="text-sm text-gray-500">{formatFecha(pub.creado_en)}</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => eliminarPublicacion(pub._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setPublicacionSeleccionada(pub)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setMostrarComentarios((prev) => (prev === pub._id ? null : pub._id))}
                    className="text-green-600 hover:underline text-sm"
                  >
                    {mostrarComentarios === pub._id ? "Ocultar comentarios" : "Ver comentarios"}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-800">{pub.texto}</p>
              {pub.imagen && (
                <img
                  src={
                    pub.imagen.startsWith("http")
                      ? pub.imagen
                      : `/uploads/publicaciones/${pub.imagen}`
                  }
                  alt="Imagen"
                  className="rounded border max-w-xs mt-2"
                />
              )}
              {mostrarComentarios === pub._id && (
                <ComentariosPublicacion publicacionId={pub._id} onComentarioAgregado={cargarPublicaciones} />
              )}
            </div>
          ))}
        </div>
      )}

      {publicacionSeleccionada && (
        <ModalEditarPublicacion
          publicacion={publicacionSeleccionada}
          onClose={() => setPublicacionSeleccionada(null)}
          onActualizacionExitosa={async () => {
            await cargarPublicaciones();
            setPublicacionSeleccionada(null);
          }}
        />
      )}
    </div>
  );
};

export default PublicacionesAdmin;