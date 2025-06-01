import { toast } from "react-toastify";
import type { ToastOptions, ToastPosition, Theme } from "react-toastify";

type TipoToast = "success" | "error" | "info" | "warn";

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

  toast[tipo](mensaje, {
    ...opcionesPorDefecto,
    ...opcionesPersonalizadas,
  });
};
