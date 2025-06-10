import type { Tarea } from "./Tarea";
import type { Usuario } from "./Usuario";
import type { Area } from "./Area";

export interface FiltrosPublicacionesProps {
  autores: Usuario[];
  tareas: Tarea[];
  areas: Area[];

  filtroAutor: string;
  setFiltroAutor: (valor: string) => void;

  filtroTarea: string;
  setFiltroTarea: (valor: string) => void;

  filtroArea: string;
  setFiltroArea: (valor: string) => void;
}
