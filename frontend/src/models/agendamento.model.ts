import { Usuario } from "./usuario.model";

export interface Agendamento{
  id?: string;
  monitor?:Usuario | string;
  servico?: 'Aula' | 'Exercícios';  //aula ou exercicios
  data?: string;
  hora?: string;
  duracao?: number; 
  link?: string;
  status?: 'AGUARDANDO' | 'CONFIRMADO' | 'CANCELADO' | 'REMARCADO' |  'CONCLUIDO';
  aluno?: Usuario | string; 
  motivoCancelamento?: string;
  valor?: string;
  formaPagamento?: 'CARTAO' | 'PIX';
  statusPagamento?: 'PENDENTE' | 'PAGO' | 'REEMBOLSADO';
  topicos?: string;
};