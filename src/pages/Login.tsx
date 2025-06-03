// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginService } from "../services/authService";
import type { Usuario } from "../types/Usuario";
import Topbar from "../components/common/Topbar";
import { showToast } from "../helpers/showToast";

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

      // 🔁 Redirección según rol
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
      <Topbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 fade-in">
        <form
          onSubmit={handleSubmit}
          className="card-panel w-full max-w-md animate-slide-up"
        >
          <h2 className="text-2xl font-bold mb-6 text-center animate-slide-right">
            Iniciar sesión
          </h2>

          <div className="mb-4">
            <label className="form-label">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="mb-6">
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-gray-500"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full animate-bounce-slow">
            Entrar
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
