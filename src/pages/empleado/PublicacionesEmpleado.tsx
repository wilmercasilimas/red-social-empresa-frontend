import { useCallback, useEffect, useState } from "react";
import type { Publicacion } from "../../types/Publicacion";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../helpers/getAvatarUrl";
import { formatFecha } from "../../helpers/formatFecha";
import ComentariosPublicacion from "../../components/comentarios/ComentariosPublicacion";
import FormularioPublicacion from "../../components/publicaciones/FormularioPublicacion";
import FiltrosPublicaciones from "../../components/publicaciones/FiltrosPublicaciones";
import BotonIcono from "../../components/ui/BotonIcono";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Usuario } from "../../types/Usuario";
import type { Tarea } from "../../types/Tarea";
import type { Area } from "../../types/Area";

interface PublicacionesEmpleadoProps {
  volver: () => void;
}

const PublicacionesEmpleado: React.FC<PublicacionesEmpleadoProps> = ({
  volver,
}) => {
  const { token } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [comentariosVisibles, setComentariosVisibles] = useState<
    Record<string, boolean>
  >({});
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const [filtroAutor, setFiltroAutor] = useState("");
  const [filtroTarea, setFiltroTarea] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  const [autores, setAutores] = useState<Usuario[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const cargarPublicaciones = useCallback(async () => {
    if (!token?.trim()) return;
    setCargando(true);
    try {
      const queryParams = new URLSearchParams({
        pagina: paginaActual.toString(),
        limite: "5",
        ...(filtroAutor && { autor: filtroAutor }),
        ...(filtroTarea && { tarea: filtroTarea }),
        ...(filtroArea && { area: filtroArea }),
      }).toString();

      const data = await fetchWithAuth<{
        publicaciones: Publicacion[];
        totalPaginas: number;
      }>(`publicacion/todas?${queryParams}`, token);

      setPublicaciones(data.publicaciones);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      console.error("Error obteniendo publicaciones:", err);
    } finally {
      setCargando(false);
    }
  }, [token, paginaActual, filtroAutor, filtroTarea, filtroArea]);

  const cargarFiltros = useCallback(async () => {
    if (!token?.trim()) return;
    try {
      const [usuariosData, tareasData, areasData] = await Promise.all([
        fetchWithAuth<{ usuarios: Usuario[] }>("user/usuarios", token),
        fetchWithAuth<{ tareas: Tarea[] }>("tarea/listar", token),
        fetchWithAuth<{ areas: Area[] }>("area/listar", token),
      ]);
      setAutores(usuariosData.usuarios);
      setTareas(tareasData.tareas);
      setAreas(areasData.areas);
    } catch (err) {
      console.error("Error cargando filtros:", err);
    }
  }, [token]);

  useEffect(() => {
    cargarFiltros();
  }, [cargarFiltros]);

  useEffect(() => {
    cargarPublicaciones();
  }, [cargarPublicaciones]);

  const toggleComentarios = (id: string) => {
    setComentariosVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="px-1 sm:px-2 py-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-semibold">📚 Publicaciones</h2>
        <BotonIcono
          texto="Regresar"
          Icono={ArrowLeft}
          onClick={volver}
          variante="secundario"
        />
      </div>

      <FormularioPublicacion
        onPublicacionCreada={async () => {
          setPaginaActual(1);
          await cargarPublicaciones();
        }}
      />

      <FiltrosPublicaciones
        autores={autores}
        filtroAutor={filtroAutor}
        setFiltroAutor={setFiltroAutor}
        tareas={tareas}
        filtroTarea={filtroTarea}
        setFiltroTarea={setFiltroTarea}
        areas={areas}
        filtroArea={filtroArea}
        setFiltroArea={setFiltroArea}
      />

      {cargando ? (
        <p className="text-gray-500">Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <>
          {publicaciones.map((pub) => (
            <div
              key={pub._id}
              className="bg-white rounded shadow p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={getAvatarUrl(pub.autor?.imagen || "default.png")}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Avatar"
                />
                <div>
                  <p className="font-semibold">
                    {pub.autor?.nombre} {pub.autor?.apellidos}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFecha(pub.creado_en)}
                  </p>
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
                  onClick={() => setImagenAmpliada(pub.imagen ?? null)}
                  className="w-full max-w-md max-h-[400px] mx-auto rounded-lg object-cover border cursor-zoom-in hover:opacity-90 transition"
                />
              )}

              <div className="text-right">
                <BotonIcono
                  texto={
                    comentariosVisibles[pub._id]
                      ? "Ocultar comentarios"
                      : "Ver comentarios"
                  }
                  Icono={comentariosVisibles[pub._id] ? EyeOff : Eye}
                  onClick={() => toggleComentarios(pub._id)}
                  variante="secundario"
                />
              </div>

              {comentariosVisibles[pub._id] && (
                <ComentariosPublicacion
                  publicacionId={pub._id}
                  onComentarioAgregado={async () => cargarPublicaciones()}
                />
              )}
            </div>
          ))}

          <div className="flex justify-center items-center gap-4 pt-6">
            <BotonIcono
              texto="Anterior"
              Icono={ChevronLeft}
              onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
              variante="secundario"
            />
            <BotonIcono
              texto="Siguiente"
              Icono={ChevronRight}
              onClick={() => setPaginaActual((prev) => prev + 1)}
              disabled={paginaActual === totalPaginas}
              variante="secundario"
            />
          </div>
        </>
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

export default PublicacionesEmpleado;
