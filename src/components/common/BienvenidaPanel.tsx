import React from "react";
import type { Usuario } from "../../types/Usuario";

interface BienvenidaPanelProps {
  titulo: string;
  descripcion: string;
  user: Usuario | null;
}

const BienvenidaPanel: React.FC<BienvenidaPanelProps> = ({ titulo, descripcion, user }) => {
  if (!user) return null;

  return (
    <div className="card-panel animate-slide-up">
      <h2 className="title-main mb-4 animate-slide-up-slow">{titulo}</h2>
      <p className="text-gray-700">
        Bienvenido, <strong>{user.nombre} {user.apellidos}</strong>.
      </p>
      <p className="text-sm text-gray-500">{descripcion}</p>
    </div>
  );
};

export default BienvenidaPanel;
