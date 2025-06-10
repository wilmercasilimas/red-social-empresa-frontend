import React from "react";
import type { TareaCompleta } from "../../types/Tarea";
import { formatFecha } from "../../helpers/formatFecha";

interface Props {
  tarea: TareaCompleta;
}

const TareaCard: React.FC<Props> = ({ tarea }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{tarea.titulo}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            tarea.estado === "pendiente"
              ? "bg-yellow-100 text-yellow-700"
              : tarea.estado === "en progreso"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {tarea.estado.toUpperCase()}
        </span>
      </div>

      {tarea.descripcion && (
        <p className="text-gray-600 text-sm mb-2">{tarea.descripcion}</p>
      )}

      <div className="text-sm text-gray-500">
        <p>
          <strong>Entrega:</strong>{" "}
          {tarea.fecha_entrega ? formatFecha(tarea.fecha_entrega) : "Sin fecha"}
        </p>
        <p>
          <strong>Asignada por:</strong>{" "}
          {tarea.creada_por?.nombre} {tarea.creada_por?.apellidos}
        </p>
      </div>
    </div>
  );
};

export default TareaCard;
