import { Monitor } from "./monitor.model";
import { Aluno} from "./usuario.model";

export interface Agendamento{
  id?: number;
  monitor?:Monitor;
  servico?: 'Aula' | 'Exercícios';  //aula ou exercicios
  data?: string;
  hora?: string;
  duracao?: number; 
  link?: string;
  status?: 'AGUARDANDO' | 'CONFIRMADO' | 'CANCELADO' | 'REMARCADO' |  'CONCLUIDO';
  alunoId?:number;
  motivoCancelamento?: string;
  valor?: string;
  formaPagamento?: 'CARTAO' | 'PIX';
  statusPagamento?: 'PENDENTE' | 'PAGO' | 'REEMBOLSADO';
  topicos?: string;
};