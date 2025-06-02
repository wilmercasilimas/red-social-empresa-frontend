import React, { useEffect, useState } from "react";
import type { Area } from "../../types/Area";
import CrearArea from "./CrearArea";
import EditarArea from "./EditarArea";
import { showToast } from "../../helpers/showToast";

interface Empleado {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  cargo?: string;
}

const AreasAdmin: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
  const [areaExpandidaId, setAreaExpandidaId] = useState<string | null>(null);
  const [detalleEmpleados, setDetalleEmpleados] = useState<Empleado[]>([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const obtenerAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/area/listar",
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setAreas(data.areas);
      }
    } catch (error) {
      console.error("Error al obtener áreas:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDetalleArea = async (id: string) => {
    try {
      setLoadingDetalle(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://red-social-empresa-backend.onrender.com/api/area/detalle/${id}`,
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setDetalleEmpleados(data.empleados || []);
        setAreaExpandidaId(id);
      } else {
        showToast(data.message || "Error al obtener detalle del área", "error");
      }
    } catch (error) {
      console.error("Error al obtener detalle del área:", error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleEliminarArea = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta área?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://red-social-empresa-backend.onrender.com/api/area/eliminar/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setAreas((prev) => prev.filter((a) => a._id !== id));
        showToast("Área eliminada correctamente");
        if (areaExpandidaId === id) setAreaExpandidaId(null);
      } else {
        showToast(data.message || "Error al eliminar área", "error");
      }
    } catch (error) {
      console.error("Error al eliminar área:", error);
    }
  };

  const toggleExpand = (id: string) => {
    if (areaExpandidaId === id) {
      setAreaExpandidaId(null);
      setDetalleEmpleados([]);
    } else {
      obtenerDetalleArea(id);
    }
  };

  useEffect(() => {
    obtenerAreas();
  }, []);

  return (
    <div className="card-panel animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="title-main animate-slide-right">Gestión de Áreas</h2>
          <p className="text-gray-600">
            Aquí puedes ver, editar y eliminar las áreas registradas.
          </p>
        </div>
        <button
          className="btn-primary animate-bounce-slow"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setAreaSeleccionada(null);
          }}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar área"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-6">
          <CrearArea onAreaCreada={obtenerAreas} />
        </div>
      )}

      {areaSeleccionada && (
        <div className="mb-6">
          <EditarArea
            area={areaSeleccionada}
            onAreaActualizada={() => {
              setAreaSeleccionada(null);
              obtenerAreas();
            }}
            onCancelar={() => setAreaSeleccionada(null)}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando áreas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 shadow rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4">Creado en</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <React.Fragment key={area._id}>
                  <tr
                    onClick={() => toggleExpand(area._id)}
                    className="hover:bg-gray-100 transition cursor-pointer"
                  >
                    <td className="py-2 px-4">{area.nombre}</td>
                    <td className="py-2 px-4">{area.descripcion}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {new Date(area.creado_en).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      {area.activa ? (
                        <span className="text-green-600 font-semibold">Activa</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Inactiva</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        className="btn-primary text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAreaSeleccionada(area);
                          setMostrarFormulario(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminarArea(area._id);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>

                  {areaExpandidaId === area._id && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 px-4 py-2">
                        {loadingDetalle ? (
                          <p className="text-sm text-gray-500">Cargando empleados...</p>
                        ) : detalleEmpleados.length > 0 ? (
                          <ul className="list-disc ml-6">
                            {detalleEmpleados.map((emp) => (
                              <li key={emp._id}>
                                {emp.nombre} {emp.apellidos} – {emp.email} ({emp.cargo || "Sin cargo"})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No hay empleados en esta área.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AreasAdmin;
