export type Usuario = {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
  cargo: string;
  area: {
    _id: string;
    nombre: string;
    descripcion?: string;
  };
  rol: string;
  imagen?: string;
};
