import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import type { TareaCompleta, UsuarioTarea } from "../../types/Tarea";
import BotonIcono from "../ui/BotonIcono";
import { CheckCircle } from "lucide-react";

interface Props {
  onSuccess?: () => void;
}

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
  const { token } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState<Date | null>(null);
  const [asignadoA, setAsignadoA] = useState<string>("");
  const [usuarios, setUsuarios] = useState<UsuarioTarea[]>([]);

  const cargarUsuarios = useCallback(async () => {
    try {
      if (!token) return;
      const data = await fetchWithAuth<RespuestaUsuarios>("user/usuarios", token);
      if (Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        showToast("Respuesta inesperada del servidor", "error");
      }
    } catch {
      console.error("Error al cargar usuarios");
    }
  }, [token]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;

      const nuevaTarea: Partial<TareaCompleta> = {
        titulo,
        descripcion,
        fecha_entrega: fechaEntrega?.toISOString(),
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
        setFechaEntrega(null);
        setAsignadoA("");
        onSuccess?.();
      } else {
        showToast("No se pudo registrar la tarea", "error");
      }
    } catch {
      console.error("Error al registrar tarea");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

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
        <DatePicker
          selected={fechaEntrega}
          onChange={(date: Date | null) => setFechaEntrega(date)}
          className="input-field"
          placeholderText="Selecciona una fecha"
          dateFormat="dd-MM-yyyy"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Asignar a:</label>
        <Select
          options={usuarios.map((u) => ({
            value: u._id,
            label: `${u.nombre} (${u.email})`,
          }))}
          value={
            asignadoA
              ? usuarios
                  .map((u) => ({
                    value: u._id,
                    label: `${u.nombre} (${u.email})`,
                  }))
                  .find((op) => op.value === asignadoA)
              : null
          }
          onChange={(op) => setAsignadoA(op?.value || "")}
          classNamePrefix="react-select"
          placeholder="Selecciona empleado"
        />
      </div>

      <div className="pt-2">
        <BotonIcono
          type="submit"
          texto="Registrar Tarea"
          Icono={CheckCircle}
          variante="primario"
        />
      </div>
    </form>
  );
};

export default FormularioTarea;
