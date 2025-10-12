import { Monitor } from "./monitor.model";
import { Usuario } from "./usuario.model";

export interface Agendamento{
  id?: number;
  monitor?:Monitor;
  servico?: 'Aula' | 'Exercícios';  //aula ou exercicios
  data?: string;
  hora?: string;
  link?: string;
  status?: 'AGUARDANDO' | 'CONFIRMADO' | 'CANCELADO' | 'REMARCADO' |  'CONCLUIDO';
  usuario?:Usuario;
  motivoCancelamento?: string;
  valor?: number;
  formaPagamento?: 'CARTAO' | 'PIX';
  statusPagamento?: 'PENDENTE' | 'PAGO' | 'REEMBOLSADO';
};