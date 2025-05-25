import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [visible, setVisible] = useState(false); // Para animación de opacidad

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("https://red-social-empresa-backend.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === "success" && data.token && data.user) {
        login(data.token, data.user);
        setStatus("success");
        console.log("✅ Login exitoso");
        navigate("/dashboard");
      } else {
        setStatus("error");
        console.warn("❌ Login fallido");
      }
    } catch (err) {
      setStatus("error");
      console.error("❌ Error de red", err);
    }

    // Siempre limpiar campos
    setEmail("");
    setPassword("");
  };

  // Animación temporal de mensajes
  useEffect(() => {
    if (status) {
      setVisible(true);

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 2500);

      const clearTimer = setTimeout(() => {
        setStatus(null);
      }, 3000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Iniciar sesión
          </h2>

          {/* Mensajes de estado con transición */}
          {status === "success" && visible && (
            <p className="text-green-600 text-center mb-4 transition-opacity duration-500 ease-in-out opacity-100">
              Sesión iniciada correctamente.
            </p>
          )}
          {status === "error" && visible && (
            <p className="text-red-500 text-center mb-4 transition-opacity duration-500 ease-in-out opacity-100">
              Correo o contraseña incorrectos.
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                placeholder="correo@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                  placeholder="••••••••"
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
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
