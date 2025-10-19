import { API } from "../../../config/api";
import { Agendamento } from "../../../models/agendamento.model";

const BASE_URL = `${API.URL}/agendamentos`;

export async function listarAgendamentos(): Promise<Agendamento[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar agendamentos");
  return response.json();
}

export async function buscarAgendamentoPorId(id: number): Promise<Agendamento> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Agendamento não encontrado");
  return response.json();
}

export async function criarAgendamento(agendamento: Agendamento): Promise<Agendamento> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });
  if (!response.ok) throw new Error("Erro ao criar agendamento");
  return response.json();
}

export async function atualizarAgendamento(id: number, agendamento: Partial<Agendamento>): Promise<Agendamento> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });
  if (!response.ok) throw new Error("Erro ao atualizar agendamento");
  return response.json();
}

export async function removerAgendamento(id: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao remover agendamento");
  return true;
}