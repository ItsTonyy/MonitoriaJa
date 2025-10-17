import { Monitor } from "../components/ListaMonitores";
import { Agendamento } from "./agendamento.model";
import { Usuario } from "./usuario.model";

export interface Avaliacao {
  id?: number;
  nota?: number;
  comentario?: string;
  monitor: Monitor;
  usuario: Usuario;
  dataAvaliacao: Date;
  status?: "PUBLICADA" | "REMOVIDA";
  agendamento?: Agendamento;
}
