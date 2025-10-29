import { Agendamento } from "./agendamento.model";
import { Usuario } from "./usuario.model";

export interface Notificacao {
    id?: number;
    titulo: string;
    mensagem: string;
    tipo: 'AGENDAMENTO' | 'CANCELAMENTO' | 'REAGENDAMENTO' | 'AVALIACAO' | 'SISTEMA';
    status: 'LIDA' | 'NAO_LIDA' | 'ARQUIVADA';
    dataEnvio: Date;
    dataLeitura?: Date;
    destinatario: Usuario;
    remetente?: string ; // Era Usuario
    agendamentoRelacionado?: Agendamento;
    prioridade?: 'ALTA' | 'MEDIA' | 'BAIXA';
}