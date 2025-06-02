// src/helpers/getAvatarUrl.ts
export const getAvatarUrl = (nombreArchivo?: string): string => {
  // Fallback si el nombre está vacío, es "undefined" o "null"
  if (
    !nombreArchivo ||
    nombreArchivo === "undefined" ||
    nombreArchivo === "null"
  ) {
    return "https://red-social-empresa-backend.onrender.com/api/avatar/default.png";
  }

  // Si ya es una URL completa, devolverla directamente
  if (/^https?:\/\//i.test(nombreArchivo)) {
    return nombreArchivo;
  }

  // Si es un nombre de archivo, construir la ruta del backend
  return `https://red-social-empresa-backend.onrender.com/api/avatar/${nombreArchivo}`;
};
