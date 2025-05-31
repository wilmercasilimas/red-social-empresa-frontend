export const getAvatarUrl = (nombreArchivo?: string): string => {
  if (!nombreArchivo) return "";

  // Si ya es una URL válida, devolverla tal cual
  if (/^https?:\/\//i.test(nombreArchivo)) {
    return nombreArchivo;
  }

  // Si es un nombre de archivo, generar URL del backend
  return `https://red-social-empresa-backend.onrender.com/api/avatar/${nombreArchivo}`;
};
