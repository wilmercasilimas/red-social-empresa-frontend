import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Global from "../helpers/Global";
import type { Usuario } from "../types/Usuario";
import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/common/Topbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(Global.url + "user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      const token: string = data.token;

      const user: Usuario = {
        ...data.user,
        imagen: data.user.imagen ?? "",
      };

      login(token, user);
      setEmail("");
      setPassword("");

      if (user.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setErrorMsg(data.message || "Error al iniciar sesión");
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

          {errorMsg && (
            <p className="text-red-500 text-sm text-center mb-4">{errorMsg}</p>
          )}

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

          <button
            type="submit"
            className="btn-primary w-full animate-bounce-slow"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
