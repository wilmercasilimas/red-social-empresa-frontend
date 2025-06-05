import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";
import Global from "../../helpers/Global";

interface FormularioPublicacionProps {
  onPublicacionCreada?: () => void;
}

const FormularioPublicacion = ({ onPublicacionCreada }: FormularioPublicacionProps) => {
  const { token, user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagen(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      showToast("El título y contenido son obligatorios", "error");
      return;
    }

    if (!user || !user._id) {
      showToast("Usuario no autenticado correctamente", "error");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("contenido", contenido);
      formData.append("autor", user._id);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await fetch(`${Global.url}publicacion/crear`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Publicación creada exitosamente", "success");
        setTitulo("");
        setContenido("");
        setImagen(null);
        onPublicacionCreada?.();
      } else {
        showToast(data.message || "Error al crear la publicación", "error");
      }
    } catch (error) {
      console.error("Error al enviar publicación:", error);
      showToast("Error de red o del servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800">Nueva Publicación</h2>

      <input
        type="text"
        placeholder="Título"
        className="w-full border border-gray-300 p-2 rounded-md"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <textarea
        placeholder="Contenido..."
        className="w-full border border-gray-300 p-2 rounded-md h-32"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Imagen (opcional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
        />
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