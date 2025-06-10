import type { TareaCompleta } from "../types/Tarea";
import { fetchWithAuth } from "../helpers/fetchWithAuth";

export const cargarTareasAsignadas = async (): Promise<TareaCompleta[]> => {
  const token = localStorage.getItem("token") || "";

  try {
    const data = await fetchWithAuth<{ tareas: TareaCompleta[] }>(
      "tarea/listar", // ✅ sin /api/
      token,
      { method: "GET" }
    );
    return data.tareas;
  } catch (error) {
    console.error("Error al cargar tareas asignadas:", error);
    return [];
  }
};
