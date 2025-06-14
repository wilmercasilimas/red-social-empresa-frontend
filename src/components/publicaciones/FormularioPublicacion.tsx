import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";
import Global from "../../helpers/Global";

interface Tarea {
  _id: string;
  titulo: string;
}

interface FormularioPublicacionProps {
  onPublicacionCreada?: () => void;
}

const FormularioPublicacion = ({ onPublicacionCreada }: FormularioPublicacionProps) => {
  const { token, user } = useAuth();
  const [texto, setTexto] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [tarea, setTarea] = useState("");
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(false);
  const [esperandoContexto, setEsperandoContexto] = useState(true);

  const cargarTareas = useCallback(async () => {
    try {
      const res = await fetch(`${Global.url}tarea/listar`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.tareas)) {
        setTareas(data.tareas);
      } else {
        showToast("No se pudieron cargar las tareas", "warn");
      }
    } catch {
      showToast("Error al cargar tareas", "error");
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      setEsperandoContexto(false);
      cargarTareas();
    }
  }, [user, token, cargarTareas]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagen(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!texto.trim() || !tarea.trim()) {
      showToast("El texto y la tarea son obligatorios", "error");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("texto", texto);
      formData.append("tarea", tarea);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await fetch(`${Global.url}publicacion/crear`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Publicación creada exitosamente", "success");
        setTexto("");
        setImagen(null);
        setTarea("");
        onPublicacionCreada?.();
      } else {
        showToast(data.message || "Error al crear la publicación", "error");
      }
    } catch {
      showToast("Error de red o del servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  if (esperandoContexto) {
    return (
      <div className="text-center py-10 text-gray-600">
        Cargando sesión del usuario...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800">Nueva Publicación</h2>

      <textarea
        placeholder="Escribe tu publicación..."
        className="w-full border border-gray-300 p-2 rounded-md h-32"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        required
      />

      <select
        value={tarea}
        onChange={(e) => setTarea(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-md"
        required
      >
        <option value="">Selecciona una tarea</option>
        {tareas.map((t) => (
          <option key={t._id} value={t._id}>
            {t.titulo}
          </option>
        ))}
      </select>

      <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">
    Imagen (opcional)
  </label>

  <div className="flex items-center gap-3 mt-1">
    <label
      htmlFor="imagenInput"
      className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
    >
      Seleccionar imagen
    </label>
    <span className="text-sm text-gray-600 truncate max-w-[160px]">
      {imagen ? imagen.name : "No hay imagen seleccionada"}
    </span>
    <input
      id="imagenInput"
      type="file"
      accept="image/*"
      onChange={handleImagenChange}
      className="hidden"
    />
  </div>

  {imagen && (
    <img
      src={URL.createObjectURL(imagen)}
      alt="Vista previa"
      className="mt-2 h-40 object-cover rounded-lg border"
    />
  )}
</div>


      <button
        type="submit"
        disabled={cargando}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {cargando ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
};

export default FormularioPublicacion;
