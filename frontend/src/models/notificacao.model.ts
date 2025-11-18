import { Agendamento } from "./agendamento.model";
import { Usuario } from "./usuario.model";

export interface Notificacao {
  id?: string;
  titulo?: string;
  mensagem?: string;
  tipo?: "AGENDAMENTO" | "CANCELAMENTO" | "REAGENDAMENTO" | "AVALIACAO";
  status?: "LIDA" | "NAO_LIDA" | "ARQUIVADA";
  dataEnvio?: Date;
  dataLeitura?: Date;
  destinatario?: Usuario | string; 
  agendamento?: Agendamento | string; 
  prioridade?: "ALTA" | "MEDIA" | "BAIXA";
}