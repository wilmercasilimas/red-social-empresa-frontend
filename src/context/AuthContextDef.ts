// src/context/AuthContextDef.ts
import { createContext } from "react";
import type { Usuario } from "../types/Usuario";

interface AuthContextProps {
  user: Usuario | null;
  token: string; // ✅ Corregido: ya no es string | null
  login: (token: string, user: Usuario) => void;
  logout: () => void;
  setUser?: React.Dispatch<React.SetStateAction<Usuario | null>>;
  actualizarAvatar?: (nuevaImagen: string) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
