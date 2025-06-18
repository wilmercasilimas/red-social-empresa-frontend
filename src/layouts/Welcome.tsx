import React from "react";

const welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Red Empresarial
        </h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión interna de empleados, tareas e incidencias.
        </p>
        <h1 className="text-4xl font-bold text-blue-600">¡Funciona Tailwind!</h1>
        <p className="text-sm text-gray-400">
          Usa el menú o las rutas para comenzar.
        </p>
      </div>
    </div>
  );
};

export default welcome;
