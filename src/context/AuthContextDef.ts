import { createContext } from "react";
import type { Usuario } from "../types/Usuario"; // Importación solo de tipo

interface AuthContextProps {
  user: Usuario | null;
  token: string | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
