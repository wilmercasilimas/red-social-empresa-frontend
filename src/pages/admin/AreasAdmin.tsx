import React, { useEffect, useState } from "react";
import type { Area } from "../../types/Area";
import CrearArea from "./CrearArea";

const AreasAdmin: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerAreas = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/area/listar",
        {
          headers: {
            Authorization: token || "",
          },
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
        console.log("✅ Área eliminada correctamente");
      } else {
        console.error("❌ Error al eliminar área:", data.message);
      }
    } catch (error) {
      console.error("❌ Error en la solicitud DELETE:", error);
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
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Agregar área"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-6">
          <CrearArea onAreaCreada={obtenerAreas} />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando áreas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 shadow rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Nombre del Área</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area._id} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-4">{area.nombre}</td>
                  <td className="py-2 px-4">{area.descripcion}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button className="btn-primary text-sm">Editar</button>
                    <button
                      className="btn-danger text-sm"
                      onClick={() => handleEliminarArea(area._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AreasAdmin;