import { useEffect, useState } from "react";
import { showToast } from "../../helpers/showToast";
import { useAuth } from "../../hooks/useAuth";
import Global from "../../helpers/Global";
import type { Publicacion } from "../../types/Publicacion";
import Select from "react-select";
import { Save, X } from "lucide-react";
import BotonIcono from "../ui/BotonIcono";

interface ModalEditarPublicacionProps {
  publicacion: Publicacion;
  onClose: () => void;
  onActualizacionExitosa: () => void;
}

const ModalEditarPublicacion = ({
  publicacion,
  onClose,
  onActualizacionExitosa,
}: ModalEditarPublicacionProps) => {
  const { token } = useAuth();
  const [texto, setTexto] = useState(publicacion.texto);
  const [tarea, setTarea] = useState(publicacion.tarea?._id || "");
  const [imagen, setImagen] = useState<File | null>(null);
  const [tareas, setTareas] = useState<{ _id: string; titulo: string }[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const res = await fetch(`${Global.url}tarea/listar`, {
          headers: { Authorization: token },
        });
        const data = await res.json();
        if (res.ok) {
          setTareas(data.tareas || []);
        }
      } catch {
        showToast("Error al cargar tareas", "error");
      }
    };

    cargarTareas();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!texto.trim() || !tarea.trim()) {
      showToast("Texto y tarea son obligatorios", "error");
      return;
    }

    setCargando(true);
    try {
      const formData = new FormData();
      formData.append("texto", texto);
      formData.append("tarea", tarea);
      if (imagen) formData.append("imagen", imagen);

      const res = await fetch(`${Global.url}publicacion/editar/${publicacion._id}`, {
        method: "PUT",
        headers: { Authorization: token },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Publicación actualizada", "success");
        onActualizacionExitosa();
      } else {
        showToast(data.message || "Error al actualizar", "error");
      }
    } catch {
      showToast("Error de red o del servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">Editar Publicación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />

          <Select
            options={[
              { value: "", label: "Selecciona una tarea" },
              ...tareas.map((t) => ({ value: t._id, label: t.titulo })),
            ]}
            value={{
              value: tarea,
              label: tareas.find((t) => t._id === tarea)?.titulo || "Selecciona una tarea",
            }}
            onChange={(op) => setTarea(op?.value || "")}
            classNamePrefix="react-select"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
          />

          <div className="flex justify-end space-x-2">
            <BotonIcono
              type="button"
              texto="Cancelar"
              Icono={X}
              onClick={onClose}
              variante="secundario"
            />
            <BotonIcono
              type="submit"
              texto="Guardar cambios"
              Icono={Save}
              cargando={cargando}
              disabled={cargando}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPublicacion;
