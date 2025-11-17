import { API } from "../../../config/api";
import { Disciplina } from "../../../models/disciplina.model";

const BASE_URL = `${API.URL}/disciplina`;

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar disciplinas");
  return response.json();
}

export async function buscarDisciplinaPorId(id: number): Promise<Disciplina> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Disciplina não encontrada");
  return response.json();
}

export async function criarDisciplina(disciplina: Disciplina): Promise<Disciplina> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(disciplina),
  });
  if (!response.ok) throw new Error("Erro ao criar disciplina");
  return response.json();
}

export async function atualizarDisciplina(id: number, disciplina: Partial<Disciplina>): Promise<Disciplina> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(disciplina),
  });
  if (!response.ok) throw new Error("Erro ao atualizar disciplina");
  return response.json();
}

export async function removerDisciplina(id: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao remover disciplina");
  return true;
}