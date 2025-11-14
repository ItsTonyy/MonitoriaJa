import { Usuario } from "./usuario.model";

export interface Disponibilidade {
  id?: string;
  usuario: Usuario | string; 
  day: string;
  times: string[];
}
