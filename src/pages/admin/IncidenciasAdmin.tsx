import React, { useEffect, useState } from "react";
import { showToast } from "../../components/common/ui/showToast";
import FormularioIncidencia from "../../components/common/incidencias/FormularioIncidencia";
import { formatFecha } from "../../helpers/formatFecha"; // ✅ Importar helper
import BotonIcono from "../../components/ui/BotonIcono";
import { Plus, X, Trash2 } from "lucide-react";

interface Usuario {
  nombre: string;
  apellidos: string;
  email: string;
  cargo: string;
  imagen?: string;
  area?: string;
}

interface Incidencia {
  _id: string;
  tipo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  usuario: Usuario;
  asignada_por: Usuario;
  creada_en: string;
}

const IncidenciasAdmin: React.FC = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerIncidencias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/incidencia/activas",
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setIncidencias(data.incidencias);
      } else {
        showToast("Error al obtener incidencias", "error");
      }
    } catch {
      showToast("Error de conexión al listar incidencias", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminarIncidencia = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar esta incidencia?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://red-social-empresa-backend.onrender.com/api/incidencia/eliminar/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token || "",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showToast("Incidencia eliminada correctamente", "success");
        obtenerIncidencias();
      } else {
        showToast(data.message || "Error al eliminar", "error");
      }
    } catch {
      showToast("Error al eliminar la incidencia", "error");
    }
  };

  useEffect(() => {
    obtenerIncidencias();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Incidencias activas</h2>

      <div className="mb-4">
        <BotonIcono
          texto={mostrarFormulario ? "Ocultar formulario" : "Nueva incidencia"}
          Icono={mostrarFormulario ? X : Plus}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        />
      </div>

      {mostrarFormulario && (
        <FormularioIncidencia onIncidenciaCreada={obtenerIncidencias} />
      )}

      {loading ? (
        <p>Cargando incidencias...</p>
      ) : incidencias.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          No hay incidencias activas actualmente.
        </p>
      ) : (
        <table className="min-w-full border border-gray-300 mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Empleado</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Fecha inicio</th>
              <th className="p-2 border">Fecha fin</th>
              <th className="p-2 border">Asignada por</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((incidencia) => (
              <tr key={incidencia._id} className="text-center">
                <td className="p-2 border">
                  {incidencia.usuario?.nombre} {incidencia.usuario?.apellidos}
                </td>
                <td className="p-2 border capitalize">{incidencia.tipo}</td>
                <td className="p-2 border">{formatFecha(incidencia.fecha_inicio)}</td>
                <td className="p-2 border">{formatFecha(incidencia.fecha_fin)}</td>
                <td className="p-2 border">
                  {incidencia.asignada_por?.nombre} {incidencia.asignada_por?.apellidos}
                </td>
                <td className="p-2 border">
                  <BotonIcono
                    texto="Eliminar"
                    Icono={Trash2}
                    onClick={() => eliminarIncidencia(incidencia._id)}
                    variante="peligro"
                    className="text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncidenciasAdmin;
