import { API } from "../../../config/api";
import { Agendamento } from "../../../models/agendamento.model";

const BASE_URL = `${API.URL}/agendamento`;

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

// Lista agendamentos por usuário (filtra no front)
export async function listarAgendamentosPorUsuarioId(id: string): Promise<Agendamento[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar agendamentos");
  const agendamentos: Agendamento[] = await response.json();
  // Filtra por monitor ou aluno (usuário logado)
  return agendamentos.filter(
    (ag) =>
      ag.status !== "CANCELADO" &&
      ag.status !== "CONCLUIDO" &&
      (ag.aluno && typeof ag.aluno === "object" && "id" in ag.aluno && ag.aluno.id === id) ||
      (ag.monitor && typeof ag.monitor === "object" && "id" in ag.monitor && ag.monitor.id === id)
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