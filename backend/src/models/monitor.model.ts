import { Avaliacao } from "./avaliacao.model";
import { Disponibilidade } from "./disponibilidade.model";
import { Usuario } from "./usuario.model";

export interface Monitor extends Usuario {
  materia?: string[]; 
  valor?: string;
  servico?: string;
  avaliacao?: number; // Média das avaliações em estrelas (1 a 5)
  listaAvaliacoes?: Avaliacao[];  // Lista de avaliações detalhadas
  listaDisponibilidades?: Disponibilidade[]; // Lista de horários disponíveis nos dias da semana
  listaDisciplinas?: string[]; // Lista de disciplinas que o monitor pode ajudar
  formacao?: string;
  biografia?: string;
}
