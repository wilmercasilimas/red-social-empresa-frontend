import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Este componente protege rutas privadas
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, muestra el contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;
