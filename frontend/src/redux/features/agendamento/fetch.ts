import { API } from "../../../config/api";
import { Agendamento } from "../../../models/agendamento.model";

const BASE_URL = `${API.URL}/agendamento`;


function mapAgendamentoMongo(agendamento: any) {
  return {
    ...agendamento,
    id: agendamento._id,
    monitor: agendamento.monitor
      ? { ...agendamento.monitor, id: agendamento.monitor._id }
      : undefined,
    aluno: agendamento.aluno
      ? { ...agendamento.aluno, id: agendamento.aluno._id }
      : undefined,
  };
}

// Lista todos os agendamentos (com monitor e aluno populados)
export async function listarAgendamentos(): Promise<Agendamento[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar agendamentos");
  return response.json();
}

// Busca agendamento por id
export async function buscarAgendamentoPorId(id: string): Promise<Agendamento> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Agendamento não encontrado");
  return response.json();
}

// Lista agendamentos por usuário (filtra no front) com status diferente de cancelado ou concluído
export async function listarAgendamentosPorUsuarioId(id: string): Promise<Agendamento[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/usuario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao buscar agendamentos");
  const data = await response.json();
  return data.map(mapAgendamentoMongo).filter(
      (ag: Agendamento) =>
        ag.status !== "CANCELADO" && ag.status !== "CONCLUIDO"
    );
}

// Cria agendamento
export async function criarAgendamento(agendamento: Agendamento): Promise<Agendamento> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });
  if (!response.ok) throw new Error("Erro ao criar agendamento");
  return response.json();
}

// Atualiza agendamento
export async function atualizarAgendamento(id: string, agendamento: Partial<Agendamento>): Promise<Agendamento> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });
  if (!response.ok) throw new Error("Erro ao atualizar agendamento");
  return response.json();
}

// Remove agendamento
export async function removerAgendamento(id: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao remover agendamento");
  return true;
}