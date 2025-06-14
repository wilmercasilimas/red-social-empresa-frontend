// src/components/common/Topbar.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.jpg";

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLogin = location.pathname === "/";

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Topbar avatar falló:", e.currentTarget.src);
    e.currentTarget.src = "/img/user.png";
  };

  return (
    <header className="w-full bg-transparent text-white shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 bg-blue-600 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        {/* Logo + título */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full bg-white shadow"
          />
          <span className="text-lg font-semibold tracking-wide text-center sm:text-left">
            Red Social Empresarial
          </span>
        </div>

        {/* Usuario + botón */}
        {!isLogin && user && (
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            <span className="font-medium text-sm text-white text-center sm:text-right">
              {user.nombre} {user.apellidos}
            </span>
            <img
              src={user.imagen}
              alt="avatar"
              onError={handleAvatarError}
              className="w-10 h-10 rounded-full border border-white shadow"
            />
            <button
              onClick={logout}
              className="btn-secondary text-sm px-3 py-1 whitespace-nowrap"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
