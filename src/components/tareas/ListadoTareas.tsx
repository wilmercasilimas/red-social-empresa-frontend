import React from "react";
import type { TareaCompleta } from "../../types/Tarea";
import { formatFecha } from "../../helpers/formatFecha";

type ListadoTareasProps = {
  tareas: TareaCompleta[];
  onEditar?: (tarea: TareaCompleta) => void;
  onEliminar?: (id: string) => void;
  mostrarControles?: boolean;
  paginaActual?: number;
};

const ListadoTareas: React.FC<ListadoTareasProps> = ({
  tareas,
  onEditar,
  onEliminar,
  mostrarControles = false,
  paginaActual,
}) => {
  if (tareas.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No hay tareas registradas por el momento.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tareas.map((tarea) => (
        <div
          key={`${tarea._id}-${paginaActual}`}
          className="bg-white p-4 rounded-xl shadow-md space-y-2"
        >
          <div className="text-xs text-gray-400 italic mb-1">
            Página actual: {paginaActual}
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <h2 className="text-lg font-semibold break-words">{tarea.titulo}</h2>
              <p className="text-sm text-gray-600 break-words">{tarea.descripcion}</p>
            </div>
            {mostrarControles && (
              <div className="flex flex-col items-end gap-2 min-w-[90px]">
                {onEditar && (
                  <button
                    onClick={() => onEditar(tarea)}
                    className="btn-sm btn-primary w-full"
                  >
                    Editar
                  </button>
                )}
                {onEliminar && (
                  <button
                    onClick={() => onEliminar(tarea._id)}
                    className="btn-sm btn-danger w-full"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <strong>Estado:</strong> {tarea.estado}
            </p>
            <p>
              <strong>Fecha de entrega:</strong>{" "}
              {tarea.fecha_entrega
                ? formatFecha(tarea.fecha_entrega)
                : "No asignada"}
            </p>
            <p>
              <strong>Asignada a:</strong>{" "}
              {typeof tarea.asignada_a === "string"
                ? tarea.asignada_a
                : tarea.asignada_a
                ? `${tarea.asignada_a.nombre} ${tarea.asignada_a.apellidos}`
                : "No disponible"}
            </p>
            <p>
              <strong>Creada por:</strong>{" "}
              {tarea.creada_por
                ? `${tarea.creada_por.nombre} ${tarea.creada_por.apellidos}`
                : "No disponible"}
            </p>
            <p>
              <strong>Creada el:</strong> {formatFecha(tarea.creada_en)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListadoTareas;