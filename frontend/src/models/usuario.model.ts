import { Agendamento } from "./agendamento.model";
import { Cartao } from "./cartao.model";

export interface Usuario {  
id?: string;
nome?: string;
email?: string;
cpf?: string;
password?: string;
telefone?: string; 
foto?: string;
tipoUsuario?: "ALUNO" | "ADMIN" | "MONITOR";
isAtivo?: boolean;
materia?: string;
valor?: string;
servico?: string;
avaliacao?: number;
formacao?: string;
biografia?: string;
listaDisciplinas?: string[]; 
listaAgendamentos?: Agendamento[];
listaCartoes?: Cartao[];
}

