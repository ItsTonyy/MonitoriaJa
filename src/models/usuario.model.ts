import { Agendamento } from "./agendamento.model";
import { Cartao } from "./cartao.model";

export interface Usuario {  
id?: string;
nome: string;
email?: string;
password?: string;
telefone?: string; 
foto?: string;
listaAgendamentos?: Agendamento[];
listaCartoes?: Cartao[];
}


export interface Aluno extends Usuario {
    tipoUsuario: 'ALUNO';
    // campos específicos do aluno
}

export interface Admin extends Usuario {
    tipoUsuario: 'ADMIN';
    // campos específicos do admin
}