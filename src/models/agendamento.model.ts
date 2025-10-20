import { Monitor } from "./monitor.model";

export interface Agendamento{
  id?: string;
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