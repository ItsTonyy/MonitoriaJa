
import { Agendamento } from "./agendamento.model";
import { Usuario } from "./usuario.model";

export interface Avaliacao {
  id?: number;
  nota?: number;
  comentario?: string;
  monitor?: Usuario | string; // pode ser objeto ou id
  aluno?: Usuario | string;   // pode ser objeto ou id
  dataAvaliacao: Date;
  status?: "PUBLICADA" | "REMOVIDA";
  agendamento?:  Agendamento | string;
}
