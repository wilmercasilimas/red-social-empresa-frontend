// src/context/AuthProvider.tsx
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextDef";
import type { Usuario } from "../types/Usuario";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && typeof storedToken === "string" && storedToken.trim() !== "") {
      const parsedUser = JSON.parse(storedUser) as Usuario;
      setUser(parsedUser);
      setToken(storedToken);
    }
  }, []);

  const login = (token: string, user: Usuario) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  const actualizarAvatar = (nuevaImagen: string) => {
    if (!user) return;
    const userActualizado = { ...user, imagen: nuevaImagen };
    setUser(userActualizado);
    localStorage.setItem("user", JSON.stringify(userActualizado));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, actualizarAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
