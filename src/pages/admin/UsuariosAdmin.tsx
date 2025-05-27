import React from "react";
import avatarDefault from "../../assets/user.png";

const UsuariosAdmin: React.FC = () => {
  return (
    <div className="card-panel animate-slide-up">
      <h2 className="title-main mb-4 animate-slide-right">Gestión de usuarios</h2>
      <p className="text-gray-600 mb-4">
        Aquí puedes ver, editar y eliminar usuarios registrados.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 shadow rounded">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4">Usuario</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Cargo</th>
              <th className="py-2 px-4">Área</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Ejemplo estático - se reemplazará con datos reales luego */}
            <tr className="hover:bg-gray-100 transition">
              <td className="py-2 px-4 flex items-center gap-3">
                <img
                  src={avatarDefault}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span>Juan Pérez</span>
              </td>
              <td className="py-2 px-4">juan@empresa.com</td>
              <td className="py-2 px-4">Diseñador</td>
              <td className="py-2 px-4">Marketing</td>
              <td className="py-2 px-4">
                <span className="badge bg-green-100 text-green-700">Empleado</span>
              </td>
              <td className="py-2 px-4 text-center space-x-2">
                <button className="btn-primary text-sm">Editar</button>
                <button className="btn-danger text-sm">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosAdmin;
