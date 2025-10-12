import { Agendamento } from "./agendamento.model";
import { Usuario } from "./usuario.model";

export interface Notificacao {
    id?: number;
    titulo: string;
    mensagem: string;
    tipo: 'AGENDAMENTO' | 'CANCELAMENTO' | 'REMARCACAO' | 'AVALIACAO' | 'SISTEMA';
    status: 'LIDA' | 'NAO_LIDA' | 'ARQUIVADA';
    dataEnvio: Date;
    dataLeitura?: Date;
    destinatario: Usuario;
    remetente?: Usuario;
    agendamentoRelacionado?: Agendamento;
    prioridade?: 'ALTA' | 'MEDIA' | 'BAIXA';
}