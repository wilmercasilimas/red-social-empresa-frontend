// src/components/common/Topbar.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.jpg";

const Topbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isLogin = location.pathname === "/";

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Topbar avatar falló:", e.currentTarget.src);
    e.currentTarget.src = "/img/user.png"; // ✅ Ruta corregida
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full shadow bg-white"
          />
          <span className="text-lg font-semibold tracking-wide">
            Red Social Empresarial
          </span>
        </div>

        {!isLogin && user && (
          <div className="flex items-center gap-3">
            <span className="font-medium">
              {user.nombre} {user.apellidos}
            </span>
            {/* ✅ Usar directamente el valor ya normalizado */}
            <img
              src={user.imagen}
              alt="avatar"
              onError={handleAvatarError}
              className="h-10 w-10 rounded-full border border-white shadow"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
