import { useEffect, useState } from "react";
import type { TareaCompleta, UsuarioTarea } from "../../types/Tarea";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { showToast } from "../../helpers/showToast";

interface Props {
  onSuccess?: () => void;
}

// ✅ Tipos auxiliares para respuestas
type RespuestaUsuarios = {
  status: string;
  message: string;
  total: number;
  usuarios: UsuarioTarea[];
};

type RespuestaCreacionTarea = {
  status: string;
  message: string;
  tarea: TareaCompleta;
};

const FormularioTarea: React.FC<Props> = ({ onSuccess }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [asignadoA, setAsignadoA] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioTarea[]>([]);

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await fetchWithAuth<RespuestaUsuarios>("user/usuarios", token);

      if (Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        console.error("[FormularioTarea] ❌ Formato inesperado:", data);
        showToast("Respuesta inesperada del servidor", "error");
      }
    } catch (error) {
      console.error("[FormularioTarea] ❌ Error al cargar usuarios", error);
      showToast("Error al cargar usuarios", "error");
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const nuevaTarea: Partial<TareaCompleta> = {
        titulo,
        descripcion,
        fecha_entrega: fechaEntrega,
        asignada_a: asignadoA,
      };

      const respuesta = await fetchWithAuth<RespuestaCreacionTarea>("tarea/crear", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      });

      if (respuesta && respuesta.tarea && respuesta.tarea._id) {
        showToast("Tarea registrada correctamente", "success");
        setTitulo("");
        setDescripcion("");
        setFechaEntrega("");
        setAsignadoA("");
        onSuccess?.();
      } else {
        console.error("[FormularioTarea] ❌ Respuesta inesperada:", respuesta);
        showToast("No se pudo registrar la tarea", "error");
      }
    } catch (error) {
      console.error("[FormularioTarea] ❌ Error en envío:", error);
      showToast("Error al registrar tarea", "error");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <form onSubmit={manejarEnvio} className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Registrar nueva tarea</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha límite</label>
        <input
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Asignar a:</label>
        <select
          value={asignadoA}
          onChange={(e) => setAsignadoA(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Selecciona un empleado --</option>
          {usuarios.map((usuario) => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombre} ({usuario.email})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Registrar Tarea
      </button>
    </form>
  );
};

export default FormularioTarea;
