import { toast } from "react-toastify";

export const showToast = (message: string, type: "success" | "error" | "info") => {
  toast(message, {
    type,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
