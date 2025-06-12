import type { TareaCompleta } from "../types/Tarea";
import { fetchWithAuth } from "../helpers/fetchWithAuth";

interface RespuestaTareas {
  tareas: TareaCompleta[];
  total: number;
}

export const cargarTareasAsignadas = async (
  pagina: number,
  limite: number
): Promise<RespuestaTareas> => {
  const token = localStorage.getItem("token") || "";

  try {
    const url = `tarea/listar?pagina=${pagina}&limite=${limite}`;
    const data = await fetchWithAuth<RespuestaTareas>(url, token, {
      method: "GET",
    });

    return {
      tareas: data.tareas || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Error al cargar tareas asignadas:", error);
    return {
      tareas: [],
      total: 0,
    };
  }
};
