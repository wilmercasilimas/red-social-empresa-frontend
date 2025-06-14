// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginService } from "../services/authService";
import type { Usuario } from "../types/Usuario";
import { showToast } from "../helpers/showToast";
import logo from "../assets/logo.jpg"; // ✅ asegúrate de que el archivo existe

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await loginService({ email, password });

    if (data.status === "success" && data.token && data.user) {
      const backendUser = data.user;

      const user: Usuario = {
        ...backendUser,
        imagen: backendUser.imagen ?? "",
        cargo: backendUser.cargo ?? "Sin definir",
        area:
          typeof backendUser.area === "string"
            ? { _id: "", nombre: backendUser.area }
            : backendUser.area ?? { _id: "", nombre: "Sin definir" },
      };

      login(data.token, user);
      showToast("Inicio de sesión exitoso");
      setEmail("");
      setPassword("");

      switch (user.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "gerente":
          navigate("/gerencia");
          break;
        case "empleado":
          navigate("/empleado");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      showToast(data.message || "Error al iniciar sesión", "error");
    }
  };

  return (
    <>
      {/* ✅ Header fijo con degradado */}
      <header
        className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md backdrop-blur-md"
        style={{
          background:
            "linear-gradient(to bottom, rgba(37, 99, 235, 1), rgba(37, 99, 235, 0.3))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full bg-white shadow"
          />
          <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide">
            Red Social Empresarial
          </span>
        </div>
      </header>

      {/* ✅ Login Form */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-24 fade-in">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6 mx-auto text-sm sm:text-base overflow-hidden"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-center">
            Iniciar sesión
          </h2>

          <div>
            <label className="form-label">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-gray-500 whitespace-nowrap"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
