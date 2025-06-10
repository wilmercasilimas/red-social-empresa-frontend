import type { Usuario } from "./Usuario";
import type { Tarea } from "./Tarea";
import type { Area } from "./Area";

export interface FiltrosPublicacionesProps {
  autores?: Usuario[]; // ahora opcionales para permitir omitirlos en empleados
  filtroAutor?: string;
  setFiltroAutor?: React.Dispatch<React.SetStateAction<string>>;

  tareas: Tarea[];
  filtroTarea: string;
  setFiltroTarea: React.Dispatch<React.SetStateAction<string>>;

  areas: Area[];
  filtroArea: string;
  setFiltroArea: React.Dispatch<React.SetStateAction<string>>;
}
