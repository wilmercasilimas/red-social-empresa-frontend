import { toast } from "react-toastify";
import type { ToastOptions, ToastPosition, Theme } from "react-toastify";

// Acepta también "warning" por conveniencia
type TipoToast = "success" | "error" | "info" | "warn" | "warning";

// Mapeo interno para que "warning" use "warn"
const mapeoToast: Record<TipoToast, "success" | "error" | "info" | "warn"> = {
  success: "success",
  error: "error",
  info: "info",
  warn: "warn",
  warning: "warn",
};

export const showToast = (
  mensaje: string,
  tipo: TipoToast = "success",
  opcionesPersonalizadas: ToastOptions = {}
) => {
  const opcionesPorDefecto: ToastOptions = {
    position: "top-right" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored" as Theme,
  };

  toast[mapeoToast[tipo]](mensaje, {
    ...opcionesPorDefecto,
    ...opcionesPersonalizadas,
  });
};
