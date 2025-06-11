import React from "react";
import type { TareaCompleta } from "../../types/Tarea";
import { formatFecha } from "../../helpers/formatFecha";

type ListadoTareasProps = {
  tareas: TareaCompleta[];
  onEditar?: (tarea: TareaCompleta) => void;
  onEliminar?: (id: string) => void;
  mostrarControles?: boolean;
};

const ListadoTareas: React.FC<ListadoTareasProps> = ({
  tareas,
  onEditar,
  onEliminar,
  mostrarControles = false,
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
        <div key={tarea._id} className="bg-white p-4 rounded-xl shadow-md space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{tarea.titulo}</h2>
              <p className="text-sm text-gray-600">{tarea.descripcion}</p>
            </div>
            {mostrarControles && (
              <div className="flex space-x-2">
                {onEditar && (
                  <button
                    onClick={() => onEditar(tarea)}
                    className="btn-sm btn-primary"
                  >
                    Editar
                  </button>
                )}
                {onEliminar && (
                  <button
                    onClick={() => onEliminar(tarea._id)}
                    className="btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            <p><strong>Estado:</strong> {tarea.estado}</p>
            <p><strong>Fecha de entrega:</strong> {tarea.fecha_entrega ? formatFecha(tarea.fecha_entrega) : "No asignada"}</p>
            <p><strong>Asignada a:</strong> {typeof tarea.asignada_a === "string" ? tarea.asignada_a : `${tarea.asignada_a.nombre} ${tarea.asignada_a.apellidos}`}</p>
            <p><strong>Creada por:</strong> {`${tarea.creada_por.nombre} ${tarea.creada_por.apellidos}`}</p>
            <p><strong>Creada el:</strong> {formatFecha(tarea.creada_en)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListadoTareas;
